const { NseIndia } = require("stock-nse-india");
const nseIndia = new NseIndia()
const Users = require("../models/User")
const Stock = require("../models/Stock")
const ListedStock = require("../models/ListedStock")
const services = require("../services/stockServices")
module.exports = {
    async addListedStock(req, res) {
        try {
            nseIndia.getAllStockSymbols().then(async symbols => {
                const existingStocks = await ListedStock.find({}, { symbol: 1 });
                const set = new Set(existingStocks.map(stock => stock.symbol));
                const listedStockData = []
                symbols.forEach(symbol => {
                    if (!set.has(symbol)) listedStockData.push({ symbol: symbol });
                })
                if (listedStockData.length) await ListedStock.insertMany(listedStockData)
                return res.status(200).json({ newStocks: listedStockData, status: 'stock data updated' });
            })
        } catch (error) {
            res.status(400).send({
                message: error.message, status: false
            })
        }
    },
    async addBalance(req, res) {
        try {
            const { balance } = req.body
            const userData = await Users.findOne({ _id: req.user._id });
            if (!userData) throw new Error("user not found");
            userData.balance = userData.balance + balance
            await userData.save();
            return res.status(200).json({ message: "user balance added", status: true });
        } catch (error) {
            return res.status(400).send({
                message: error.message, status: false
            })
        }
    },
    async getUserData(req, res) {
        try {
            const userData = await Users.findOne({ _id: req.user._id });
            if (!userData) throw new Error("user not found");
            return res.status(200).json({
                user: {
                    _id: userData._id, username: userData.username, balance: userData.balance, liveSubscription: userData.liveSubscription
                }, status: true
            });
        } catch (error) {
            return res.status(400).send({
                message: error.message, status: false
            })
        }
    },
    async getPorfolio(req, res) {
        try {
            const userData = await Stock.find({ userId: req.user._id, isActive:true });
            return res.status(200).json({
                portfolio:userData, status: true
            });
        } catch (error) {
            return res.status(400).send({
                message: error.message, status: false
            })
        }
    },
    async buyStock(req, res) {
        try {
            const { symbol, quantity } = req.body
            const userData = await Users.findOne({ _id: req.user._id, isActive: true});
            if (!userData) throw new Error("user not found");
            
            const listedStockData = await ListedStock.findOne({ symbol });
            if (!listedStockData) throw new Error("stock not found with symbol: " + symbol);
            const stockPrice = await services.getCurrentPriceBySymbol(symbol)
            if (stockPrice && quantity * stockPrice <= userData.balance) {
                const existingStock = await Stock.findOne({ userId: req.user._id, stockId: listedStockData._id, isActive: true });
                if (existingStock) {
                    existingStock.price = (existingStock.price*existingStock.quantity + quantity * stockPrice)/(existingStock.quantity + quantity)
                    existingStock.quantity = existingStock.quantity + quantity
                    await existingStock.save()
                } else {
                    const stockData = { 
                        stockId: listedStockData._id, 
                        userId: req.user._id, 
                        price: stockPrice, 
                        quantity: quantity
                    }
                    await new Stock(stockData).save()
                }
                userData.balance = userData.balance - quantity * stockPrice;
                await userData.save();
            } else {
                throw new Error(`You required to add ${userData.balance-quantity * stockPrice} to place this order`)
            }
            return res.status(200).json({
                message:`symbol quantity: ${quantity} bought at ${stockPrice}`, status: true
            });
        } catch (error) {
            return res.status(400).send({
                message: error.message, status: false
            })
        }
    },
    async sellStock(req, res) {
        try {
            const { symbol, quantity } = req.body
            const userData = await Users.findOne({ _id: req.user._id, isActive: true});
            if (!userData) throw new Error("user not found");
            const listedStockData = await ListedStock.findOne({ symbol });
            if (!listedStockData) throw new Error("stock not found with symbol: " + symbol);

            const existingStock = await Stock.findOne({ userId: req.user._id, stockId: listedStockData._id, isActive: true });
            let stockPrice = 0;
            if (existingStock) {
                if (existingStock.quantity < quantity) throw new Error(`cannot sell stock with quantity ${quantity} as you have only quantity ${existingStock.quantity}`)
                existingStock.quantity = existingStock.quantity - quantity;
                stockPrice = await services.getCurrentPriceBySymbol(symbol)
                const sellAmount = stockPrice * quantity;
                userData.balance = userData.balance + sellAmount;
                await userData.save();
                if (existingStock.quantity == 0) await Stock.deleteOne({ userId: req.user._id, stockId: listedStockData._id, isActive: true })
                else await existingStock.save()
            } else {
                throw new Error(`You don't have this stock in your account`)
            }
            return res.status(200).json({
                message:`${symbol} quantity: ${quantity} sold at price ${stockPrice}`, status: true
            });
        } catch (error) {
            return res.status(400).send({
                message: error.message, status: false
            })
        }
    },
    async startSubscription(req, res) {
        try {
            const userData = await Users.findOne({ userId: req.user._id, isActive: true });
            if (!userData) throw new Error("user not found");
            if (!userData.liveSubscription) {
                userData.liveSubscription = true;
                await userData.save()
            } else {
                return res.status(200).json({
                    message:"You already have a live subscription", status: true
                });
            }
            return res.status(200).json({
                message:"Live subscription started successfully", status: true
            });
        } catch (error) {
            return res.status(400).send({
                message: error.message, status: false
            })
        }
    },
    async getLiveData(req, res) {
        try {
            const { symbol } = req.body;
            const userData = await Users.findOne({ userId: req.user._id, isActive: true });
            if (userData && !userData.liveSubscription) throw new Error("You don't have a live subscription, please subscription first")
            const stockDetails = await services.getLiveDataBySymbol(symbol)
            if(stockDetails) return res.status(200).json({
                stockDetails, status: true
            });
            else {
                throw new Error("stockDetails not found for symbol " + symbol)
            }
        } catch (error) {
            return res.status(400).send({
                message: error.message, status: false
            })
        }
    },
}

const { NseIndia } = require("stock-nse-india");
const nseIndia = new NseIndia()
const ListedStock = require("../models/ListedStock")
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
    }
}

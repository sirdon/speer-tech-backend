const { NseIndia } = require("stock-nse-india");
const nseIndia = new NseIndia()

module.exports = {
    async getLiveDataBySymbol(symbol) {
        try {
            let stockDetails;
            await nseIndia.getEquityDetails(symbol.toUpperCase()).then(details => {
                stockDetails = details.priceInfo
            })
            if (stockDetails) return stockDetails;
        } catch (error) {
            throw error;
        }
    },
    async getCurrentPriceBySymbol(symbol) {
        try {
            let price;
            await nseIndia.getEquityDetails(symbol.toUpperCase()).then(details => {
                if (details?.priceInfo?.lastPrice) price = details.priceInfo.lastPrice
                else throw new Error("Detail not found for symbol " + symbol)
            })
            if (price) return price
        } catch (error) {
            throw error;
        }
    }
}
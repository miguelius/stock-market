/* Trade class: records a trade with:
	time: 		operation timestamp
	quantity: 	amount traded
	type: 		'buy' or 'sell'
	price: 		unit price
*/
var Trade = function(time, quantity, type, price) {
	this.time = time;
	this.quantity = quantity;
	this.type = type;
	this.price = price;
}

Trade.prototype.operationTotal = function() {
	return this.price * this.quantity;
};
/* Trade class end */

/* Stock class
	symbol
	type		common|preferred
	lastDividend
	fixedDividend
	parValue
*/
function Stock(symbol, type, lastDividend, fixedDividend, parValue) {
	this.trades = [];
	this.symbol = symbol;
	this.type = type;
	this.lastDividend = lastDividend;
	this.fixedDividend = fixedDividend;
	this.parValue = parValue;
	this.id = symbol;
}

Stock.prototype.dividendYield = function(price) {
	if (this.type == 'preferred') {
		if (!price || price === 0)
			throw { type: "validation", message: "Invalid price. undefined or 0 are not valid." }
		return (this.fixedDividend/100.0)*this.parValue / price ;
	}
	return this.lastDividend / price ;
};

Stock.prototype.priceEarningRatio = function(price) {
	let lastDividend = this.lastDividend;
	if (!lastDividend || lastDividend === 0)
		throw { type: "validation", message: "Invalid last dividend. undefined or 0 are not valid." }
	return price / this.lastDividend;
};

Stock.prototype.recordTrade = function(time, quantity, type, price) {
	this.trades.push(new Trade(time, quantity, type, price));
};

Stock.prototype.lastNMinutesTrades = function(n) {
	var WHEN = (n > 0 ? n : 5) * 60 * 1000;
	var now = new Date();
	return this.trades.filter(function(t) {
		return (now - t.time) < WHEN;
	});
};

Stock.prototype.volumeWeightPrice = function() {
	var recentTrades = this.lastNMinutesTrades(5);
	var totalQuantity = recentTrades.reduce(function(sum, t) { return sum + t.quantity; }, 0);
	var totalOperationValue = recentTrades.reduce(function(sum, t) { return sum + t.operationTotal(); }, 0);

	if (totalQuantity > 0) {
		return totalOperationValue / (1.0*totalQuantity);
	}

	return 0;
};
/* Stock class end */

/* Market class
 * Contains a map of stocks and let us get all share index.
 */
/* quick nthRoot implementation only defined for x > 0. for odd n returns the positive solution */
function nthRoot(x, n) {
	if (n === 0) throw Error("nthRoot(x,n) is not defnied for n = 0");
  if(x < 0) throw Error("nthRoot(x,n) implementation only defined for x > 0."); // Not well defined
  return Math.round((x < 0 ? -1 : 1) * Math.pow(Math.abs(x), 1/n), 3);
}

function Market() {
	this.stocks = {};
}

Market.prototype.registerStock= function(symbol, type, lastDividend, fixedDividend, parValue) {
	this.stocks[symbol] = new Stock(symbol, type, lastDividend, fixedDividend, parValue);
}

Market.prototype.getStock= function(symbol) {
	return this.stocks[symbol];
}

Market.prototype.allShareIndex = function() {
	var stocks = this.stocks;
	var nonZeros = Object.keys(stocks)
			.map( function (s) { return stocks[s].volumeWeightPrice(); } )
			.filter( function(v) { return v > 0 });
	var x = nonZeros.reduce(function(p, v) { return p*v; }, 1);
	var n =  nonZeros.length;
	if (n === 0)
	  return 0;
	return nthRoot(x, n);
};
/* Market class end */

module.exports.Trade = Trade;
module.exports.Stock = Stock;
module.exports.Market = Market;

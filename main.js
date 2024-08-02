
const jsonData = require('./dataSourceData.json'); 

function getPriceBoostMarkets(data) {
    // Ensure the event and markets exist
    if (!data.event || !data.event.markets) {
      return [];
    }
  
    const boostedOddsMarkets = data.event.markets.filter(market => 
      market.name === "Boosted Odds" 
    );
  
    // Return the filtered markets
    return boostedOddsMarkets;
  }
  
  const priceBoostMarkets = getPriceBoostMarkets(jsonData);
  console.log(JSON.stringify(priceBoostMarkets, null, 2));
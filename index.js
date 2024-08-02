const functions = require('@google-cloud/functions-framework');
const fs = require('fs');
const path = require('path');

// Read the JSON data from the file
const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, 'dataSourceData.json'), 'utf8'));

function filterMarkets(data, filters) {
  // Ensure the event and markets exist
  if (!data.event || !data.event.markets) {
    return [];
  }

  return data.event.markets.filter(market => {
    const nameMatch = filters.name ? market.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
    const oddsMatch = market.selections.some(selection => 
      (!filters.minOdds || selection.odds >= filters.minOdds) &&
      (!filters.maxOdds || selection.odds <= filters.maxOdds)
    );
    const suspendedMatch = filters.suspended === undefined || market.suspended === filters.suspended;

    return nameMatch && oddsMatch && suspendedMatch;
  });
}

functions.http('filterMarkets', (req, res) => {
  console.log('Function called with query:', req.query);

  const filters = {
    name: req.query.name,
    minOdds: req.query.minOdds ? parseFloat(req.query.minOdds) : undefined,
    maxOdds: req.query.maxOdds ? parseFloat(req.query.maxOdds) : undefined,
    suspended: req.query.suspended ? req.query.suspended === 'true' : undefined
  };

  try {
    const filteredMarkets = filterMarkets(jsonData, filters);
    console.log(`Returning ${filteredMarkets.length} markets`);
    res.status(200).json(filteredMarkets);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('An error occurred while processing your request');
  }
});
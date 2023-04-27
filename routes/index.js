const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const router = express.Router();

// Read Ethereum addresses from the unique_pepe_addresses.csv file in the data folder
const airdropList = [];

fs.createReadStream('data/unique_pepe_addresses.csv')
  .pipe(csvParser({ headers: false }))
  .on('data', (row) => {
    airdropList.push(Object.values(row)[0]);
  })
  .on('end', () => {
    console.log('Airdrop list loaded from unique_pepe_addresses.csv.');
  });

// Read Ethereum addresses from the arb_claim_addresses.csv file in the data folder
const claimAddresses = [];

fs.createReadStream('data/arb_claim_addresses.csv')
  .pipe(csvParser({ headers: ['address', 'amount'] }))
  .on('data', (row) => {
    claimAddresses.push(row.address);
  })
  .on('end', () => {
    console.log('Claim addresses loaded from arb_claim_addresses.csv.');
  });


// API endpoint to validate if an address is in the airdrop list
router.get('/api/check-airdrop/:address', (req, res) => {
  const address = req.params.address;
  if (airdropList.includes(address) || claimAddresses.includes(address)) {
    res.json({ status: 'success', message: 'Address is in the airdrop list.' });
  } else {
    res.json({ status: 'failed', message: 'Address is not in the airdrop list.' });
  }
});

module.exports = router;

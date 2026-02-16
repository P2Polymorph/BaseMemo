// Script to generate account association for Farcaster Mini App
// This should be run after you have your Farcaster account and app ID

const crypto = require('crypto');

// You'll need to fill these in:
// 1. Your Farcaster account FID (get from Warpcast profile)
// 2. Your app ID (provided by Base team)
// 3. Your account's custody address

const CONFIG = {
  fid: 'YOUR_FID_HERE', // Replace with your Farcaster FID
  appId: 'YOUR_APP_ID_HERE', // Replace with your app ID from Base
  custodyAddress: 'YOUR_CUSTODY_ADDRESS_HERE', // Replace with your custody address
  timestamp: Math.floor(Date.now() / 1000),
};

function generateAccountAssociation() {
  // Create the payload
  const payload = {
    fid: CONFIG.fid,
    timestamp: CONFIG.timestamp,
    appId: CONFIG.appId,
  };

  // Create header (typically just indicates the algorithm)
  const header = {
    alg: 'ethereum-personal-sign',
    typ: 'JWT',
  };

  // Encode header and payload
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

  // Create message to sign
  const message = `${encodedHeader}.${encodedPayload}`;

  console.log('=== Account Association Setup ===');
  console.log('Header:', JSON.stringify(header, null, 2));
  console.log('Payload:', JSON.stringify(payload, null, 2));
  console.log('Message to sign:', message);
  console.log('\n=== Next Steps ===');
  console.log('1. Sign this message with your custody address');
  console.log('2. Update farcaster.config.ts with the signature');
  console.log('3. Replace the placeholder values in this script');
  console.log('\n=== Example farcaster.config.ts update ===');
  console.log(`
accountAssociation: {
  header: "${encodedHeader}",
  payload: "${encodedPayload}",
  signature: "YOUR_SIGNATURE_HERE"
},`);
}

if (CONFIG.fid !== 'YOUR_FID_HERE' && CONFIG.appId !== 'YOUR_APP_ID_HERE') {
  generateAccountAssociation();
} else {
  console.log('Please update the CONFIG object with your actual values:');
  console.log('- fid: Your Farcaster FID');
  console.log('- appId: Your app ID from Base team');
  console.log('- custodyAddress: Your account custody address');
}
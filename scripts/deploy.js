const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying BaseMemoryLeaderboard contract...");
  
  // Get the contract factory
  const BaseMemoryLeaderboard = await ethers.getContractFactory("BaseMemoryLeaderboard");
  
  // Deploy the contract
  const leaderboard = await BaseMemoryLeaderboard.deploy();
  await leaderboard.waitForDeployment();
  
  const contractAddress = await leaderboard.getAddress();
  console.log(`✅ BaseMemoryLeaderboard deployed to: ${contractAddress}`);
  console.log(`📍 Contract deployed on Base L2 network`);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    network: "base",
    timestamp: new Date().toISOString(),
    abi: BaseMemoryLeaderboard.interface.format("json")
  };
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save deployment info
  const deploymentPath = path.join(deploymentsDir, "base-memory-leaderboard.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`📄 Deployment info saved to: ${deploymentPath}`);
  
  // Verify contract on Base scan (optional)
  console.log("\n📋 Contract Deployment Summary:");
  console.log(`   Address: ${contractAddress}`);
  console.log(`   Network: Base L2`);
  console.log(`   Contract: BaseMemoryLeaderboard`);
  
  console.log("\n📝 Next steps:");
  console.log(`1. Add this to your .env file: NEXT_PUBLIC_LEADERBOARD_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("2. Verify the contract on Base scan for better transparency");
  console.log("3. Test the contract functions");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
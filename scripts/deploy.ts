import { ethers } from "hardhat";

async function main() {
  console.log("Deploying BaseReview contract to Base...");

  // Configuration parameters
  const MIN_REVIEW_STAKE = ethers.parseEther("0.0001"); // 0.0001 ETH
  const REVIEW_EDIT_WINDOW = 24 * 60 * 60; // 24 hours
  const DISPUTE_PERIOD = 7 * 24 * 60 * 60; // 7 days
  const SCAM_REPORT_THRESHOLD = 5; // 5 verified reports
  const VERIFICATION_STAKE = ethers.parseEther("0.05"); // 0.05 ETH
  const DISPUTE_BOND = ethers.parseEther("0.01"); // 0.01 ETH
  const MAX_REVIEWS_PER_DAY = 5; // 5 reviews per day limit

  console.log("\nDeployment Configuration:");
  console.log("- Min Review Stake:", ethers.formatEther(MIN_REVIEW_STAKE), "ETH");
  console.log("- Review Edit Window:", REVIEW_EDIT_WINDOW / 3600, "hours");
  console.log("- Dispute Period:", DISPUTE_PERIOD / (24 * 3600), "days");
  console.log("- Scam Report Threshold:", SCAM_REPORT_THRESHOLD, "reports");
  console.log("- Verification Stake:", ethers.formatEther(VERIFICATION_STAKE), "ETH");
  console.log("- Dispute Bond:", ethers.formatEther(DISPUTE_BOND), "ETH");
  console.log("- Max Reviews Per Day:", MAX_REVIEWS_PER_DAY);

  // Deploy contract
  const BaseReview = await ethers.getContractFactory("BaseReview");
  const baseReview = await BaseReview.deploy(
    MIN_REVIEW_STAKE,
    REVIEW_EDIT_WINDOW,
    DISPUTE_PERIOD,
    SCAM_REPORT_THRESHOLD,
    VERIFICATION_STAKE,
    DISPUTE_BOND,
    MAX_REVIEWS_PER_DAY
  );

  await baseReview.waitForDeployment();
  const address = await baseReview.getAddress();

  console.log("\n✅ BaseReview deployed to:", address);
  console.log("\nTo verify on BaseScan, run:");
  console.log(
    `npx hardhat verify --network base ${address} ${MIN_REVIEW_STAKE} ${REVIEW_EDIT_WINDOW} ${DISPUTE_PERIOD} ${SCAM_REPORT_THRESHOLD} ${VERIFICATION_STAKE} ${DISPUTE_BOND} ${MAX_REVIEWS_PER_DAY}`
  );

  console.log("\n⚠️  IMPORTANT: Update your frontend .env file:");
  console.log(`VITE_REVIEW_CONTRACT_ADDRESS=${address}`);

  // Save deployment info
  const fs = require("fs");
  const network = await ethers.provider.getNetwork();
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(), // Convert BigInt to string
    contractAddress: address,
    deployer: (await ethers.getSigners())[0].address,
    deploymentTime: new Date().toISOString(),
    config: {
      minReviewStake: MIN_REVIEW_STAKE.toString(),
      reviewEditWindow: REVIEW_EDIT_WINDOW,
      disputePeriod: DISPUTE_PERIOD,
      scamReportThreshold: SCAM_REPORT_THRESHOLD,
      verificationStake: VERIFICATION_STAKE.toString(),
      disputeBond: DISPUTE_BOND.toString(),
      maxReviewsPerDay: MAX_REVIEWS_PER_DAY,
    },
  };

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n📝 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

import { ethers } from "hardhat";

/**
 * Seed script to populate BaseReview with demo apps and reviews
 * Use for testing and demonstration purposes only
 */
async function main() {
  console.log("Seeding BaseReview with demo data...\n");

  const [deployer, user1, user2, user3] = await ethers.getSigners();

  // Get deployed contract address
  const deploymentInfo = require("../deployment-info.json");
  const contractAddress = deploymentInfo.contractAddress;

  const BaseReview = await ethers.getContractFactory("BaseReview");
  const baseReview = BaseReview.attach(contractAddress);

  console.log("Connected to BaseReview at:", contractAddress);
  console.log("Deployer:", deployer.address);

  // Seed data
  const sampleApps = [
    {
      name: "BaseBet",
      url: "https://baseapp.com/basebet",
      category: 1, // Gaming
      contracts: ["0x1234567890123456789012345678901234567890"],
      metadata: "QmExampleIPFSHash1",
    },
    {
      name: "BaseSwap",
      url: "https://baseswap.fi",
      category: 0, // DeFi
      contracts: ["0x2345678901234567890123456789012345678901"],
      metadata: "QmExampleIPFSHash2",
    },
    {
      name: "BaseNFT",
      url: "https://basenft.xyz",
      category: 2, // NFT
      contracts: ["0x3456789012345678901234567890123456789012"],
      metadata: "QmExampleIPFSHash3",
    },
  ];

  console.log("\n1️⃣  Registering sample apps...");

  const appIds = [];
  for (const app of sampleApps) {
    try {
      const tx = await baseReview.registerMiniApp(
        app.name,
        app.url,
        app.category,
        app.contracts,
        app.metadata
      );

      const receipt = await tx.wait();
      const event = receipt?.logs.find(
        (log: any) => log.fragment?.name === "AppRegistered"
      );

      if (event) {
        const appId = event.args[0];
        appIds.push(appId);
        console.log(`   ✅ ${app.name} registered (ID: ${appId})`);
      }
    } catch (error: any) {
      console.log(`   ❌ Failed to register ${app.name}:`, error.message);
    }
  }

  console.log("\n2️⃣  Submitting sample reviews...");

  const minStake = await baseReview.minReviewStake();

  // Review for app 1 (BaseBet) - Positive
  try {
    const tx = await baseReview
      .connect(user1)
      .leaveReview(
        appIds[0],
        5,
        0, // GENERAL
        [0, 1], // Tags
        "QmReviewIPFS1",
        "",
        [],
        { value: minStake }
      );
    await tx.wait();
    console.log("   ✅ User1 reviewed BaseBet (5 stars)");
  } catch (error: any) {
    console.log("   ❌ Review failed:", error.message);
  }

  // Review for app 1 (BaseBet) - Another positive
  try {
    const tx = await baseReview
      .connect(user2)
      .leaveReview(
        appIds[0],
        4,
        0, // GENERAL
        [0, 2], // Tags
        "QmReviewIPFS2",
        "",
        [],
        { value: minStake }
      );
    await tx.wait();
    console.log("   ✅ User2 reviewed BaseBet (4 stars)");
  } catch (error: any) {
    console.log("   ❌ Review failed:", error.message);
  }

  // Review for app 2 (BaseSwap) - Mixed
  try {
    const tx = await baseReview
      .connect(user1)
      .leaveReview(
        appIds[1],
        3,
        0, // GENERAL
        [3], // Tags
        "QmReviewIPFS3",
        "",
        [],
        { value: minStake }
      );
    await tx.wait();
    console.log("   ✅ User1 reviewed BaseSwap (3 stars)");
  } catch (error: any) {
    console.log("   ❌ Review failed:", error.message);
  }

  // Scam report for app 3 (BaseNFT) - Warning
  try {
    const tx = await baseReview
      .connect(user3)
      .leaveReview(
        appIds[2],
        1,
        2, // SCAM_REPORT
        [8, 9], // Scam tags
        "QmScamReportIPFS1",
        "QmProofIPFS1",
        [ethers.keccak256(ethers.toUtf8Bytes("fakeTx1"))],
        { value: minStake }
      );
    await tx.wait();
    console.log("   ✅ User3 filed scam report for BaseNFT (1 star)");
  } catch (error: any) {
    console.log("   ❌ Scam report failed:", error.message);
  }

  console.log("\n3️⃣  Submitting helpful votes...");

  // Users vote on reviews
  try {
    const tx1 = await baseReview.connect(user2).voteHelpful(1, true);
    await tx1.wait();
    console.log("   ✅ User2 voted review #1 helpful");
  } catch (error: any) {
    console.log("   ❌ Vote failed:", error.message);
  }

  try {
    const tx2 = await baseReview.connect(user3).voteHelpful(1, true);
    await tx2.wait();
    console.log("   ✅ User3 voted review #1 helpful");
  } catch (error: any) {
    console.log("   ❌ Vote failed:", error.message);
  }

  console.log("\n4️⃣  Developer responses...");

  try {
    const tx = await baseReview
      .connect(deployer)
      .respondToReview(4, "QmDeveloperResponseIPFS");
    await tx.wait();
    console.log("   ✅ Developer responded to scam report");
  } catch (error: any) {
    console.log("   ❌ Response failed:", error.message);
  }

  console.log("\n✅ Seeding complete!");
  console.log("\n📊 Summary:");
  console.log(`   - ${appIds.length} apps registered`);
  console.log(`   - 4 reviews submitted`);
  console.log(`   - 2 helpful votes cast`);
  console.log(`   - 1 developer response`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

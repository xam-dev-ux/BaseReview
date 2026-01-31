import { expect } from "chai";
import { ethers } from "hardhat";
import { BaseReview } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("BaseReview", function () {
  let baseReview: BaseReview;
  let owner: SignerWithAddress;
  let developer: SignerWithAddress;
  let reviewer1: SignerWithAddress;
  let reviewer2: SignerWithAddress;
  let reviewer3: SignerWithAddress;

  const MIN_REVIEW_STAKE = ethers.parseEther("0.0001");
  const REVIEW_EDIT_WINDOW = 24 * 60 * 60; // 24 hours
  const DISPUTE_PERIOD = 7 * 24 * 60 * 60; // 7 days
  const SCAM_REPORT_THRESHOLD = 5;
  const VERIFICATION_STAKE = ethers.parseEther("0.05");
  const DISPUTE_BOND = ethers.parseEther("0.01");
  const MAX_REVIEWS_PER_DAY = 5;

  beforeEach(async function () {
    [owner, developer, reviewer1, reviewer2, reviewer3] = await ethers.getSigners();

    const BaseReviewFactory = await ethers.getContractFactory("BaseReview");
    baseReview = await BaseReviewFactory.deploy(
      MIN_REVIEW_STAKE,
      REVIEW_EDIT_WINDOW,
      DISPUTE_PERIOD,
      SCAM_REPORT_THRESHOLD,
      VERIFICATION_STAKE,
      DISPUTE_BOND,
      MAX_REVIEWS_PER_DAY
    );

    await baseReview.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await baseReview.owner()).to.equal(owner.address);
    });

    it("Should set correct configuration", async function () {
      expect(await baseReview.minReviewStake()).to.equal(MIN_REVIEW_STAKE);
      expect(await baseReview.reviewEditWindow()).to.equal(REVIEW_EDIT_WINDOW);
      expect(await baseReview.disputePeriod()).to.equal(DISPUTE_PERIOD);
      expect(await baseReview.scamReportThreshold()).to.equal(SCAM_REPORT_THRESHOLD);
    });
  });

  describe("App Registration", function () {
    it("Should register a new MiniApp", async function () {
      const tx = await baseReview.connect(developer).registerMiniApp(
        "TestApp",
        "https://testapp.com",
        0, // DeFi
        ["0x1234567890123456789012345678901234567890"],
        "QmTestMetadata"
      );

      await expect(tx)
        .to.emit(baseReview, "AppRegistered")
        .withArgs(1, "TestApp", "https://testapp.com", developer.address, 0);

      const app = await baseReview.getApp(1);
      expect(app.name).to.equal("TestApp");
      expect(app.developer).to.equal(developer.address);
      expect(app.verificationStatus).to.equal(0); // UNVERIFIED
    });

    it("Should reject duplicate app names", async function () {
      await baseReview.connect(developer).registerMiniApp(
        "TestApp",
        "https://testapp1.com",
        0,
        [],
        "QmMeta1"
      );

      await expect(
        baseReview.connect(developer).registerMiniApp(
          "TestApp",
          "https://testapp2.com",
          0,
          [],
          "QmMeta2"
        )
      ).to.be.revertedWith("Name already taken");
    });

    it("Should reject duplicate URLs", async function () {
      await baseReview.connect(developer).registerMiniApp(
        "TestApp1",
        "https://testapp.com",
        0,
        [],
        "QmMeta1"
      );

      await expect(
        baseReview.connect(developer).registerMiniApp(
          "TestApp2",
          "https://testapp.com",
          0,
          [],
          "QmMeta2"
        )
      ).to.be.revertedWith("URL already registered");
    });

    it("Should reject invalid name length", async function () {
      await expect(
        baseReview.connect(developer).registerMiniApp(
          "AB", // Too short
          "https://testapp.com",
          0,
          [],
          "QmMeta"
        )
      ).to.be.revertedWith("Invalid name length");
    });

    it("Should allow developer to update app", async function () {
      await baseReview.connect(developer).registerMiniApp(
        "TestApp",
        "https://testapp.com",
        0,
        [],
        "QmMeta1"
      );

      await expect(
        baseReview.connect(developer).updateMiniApp(
          1,
          "QmMeta2",
          ["0x9876543210987654321098765432109876543210"]
        )
      ).to.emit(baseReview, "AppUpdated");

      const app = await baseReview.getApp(1);
      expect(app.metadataIPFS).to.equal("QmMeta2");
    });

    it("Should reject updates from non-developer", async function () {
      await baseReview.connect(developer).registerMiniApp(
        "TestApp",
        "https://testapp.com",
        0,
        [],
        "QmMeta1"
      );

      await expect(
        baseReview.connect(reviewer1).updateMiniApp(1, "QmMeta2", [])
      ).to.be.revertedWith("Only developer can update");
    });
  });

  describe("Review System", function () {
    beforeEach(async function () {
      // Register an app first
      await baseReview.connect(developer).registerMiniApp(
        "TestApp",
        "https://testapp.com",
        0,
        [],
        "QmTestMetadata"
      );

      // Advance time to meet minimum account age
      await time.increase(8 * 24 * 60 * 60); // 8 days
    });

    it("Should allow leaving a review", async function () {
      const tx = await baseReview.connect(reviewer1).leaveReview(
        1, // appId
        5, // rating
        0, // GENERAL
        [0, 1], // tags
        "QmReviewIPFS",
        "",
        [],
        { value: MIN_REVIEW_STAKE }
      );

      await expect(tx)
        .to.emit(baseReview, "ReviewSubmitted")
        .withArgs(1, 1, reviewer1.address, 5, 0);

      const app = await baseReview.getApp(1);
      expect(app.totalReviews).to.equal(1);
    });

    it("Should reject review without stake", async function () {
      await expect(
        baseReview.connect(reviewer1).leaveReview(
          1,
          5,
          0,
          [],
          "QmReviewIPFS",
          "",
          [],
          { value: 0 }
        )
      ).to.be.revertedWith("Insufficient stake");
    });

    it("Should reject invalid rating", async function () {
      await expect(
        baseReview.connect(reviewer1).leaveReview(
          1,
          6, // Invalid (must be 1-5)
          0,
          [],
          "QmReviewIPFS",
          "",
          [],
          { value: MIN_REVIEW_STAKE }
        )
      ).to.be.revertedWith("Rating must be 1-5");
    });

    it("Should reject duplicate review from same user", async function () {
      await baseReview.connect(reviewer1).leaveReview(
        1,
        5,
        0,
        [],
        "QmReviewIPFS1",
        "",
        [],
        { value: MIN_REVIEW_STAKE }
      );

      await expect(
        baseReview.connect(reviewer1).leaveReview(
          1,
          4,
          0,
          [],
          "QmReviewIPFS2",
          "",
          [],
          { value: MIN_REVIEW_STAKE }
        )
      ).to.be.revertedWith("Already reviewed this app");
    });

    it("Should require proof for scam reports", async function () {
      await expect(
        baseReview.connect(reviewer1).leaveReview(
          1,
          1,
          2, // SCAM_REPORT
          [8],
          "QmScamReportIPFS",
          "", // No proof
          [], // No tx hashes
          { value: MIN_REVIEW_STAKE }
        )
      ).to.be.revertedWith("Scam reports require proof");
    });

    it("Should allow editing within edit window", async function () {
      await baseReview.connect(reviewer1).leaveReview(
        1,
        5,
        0,
        [],
        "QmReviewIPFS1",
        "",
        [],
        { value: MIN_REVIEW_STAKE }
      );

      // Edit within window
      await expect(
        baseReview.connect(reviewer1).editReview(1, 4, "QmReviewIPFS2")
      ).to.emit(baseReview, "ReviewEdited");

      const review = await baseReview.reviews(1);
      expect(review.rating).to.equal(4);
      expect(review.status).to.equal(1); // EDITED
    });

    it("Should reject editing after edit window", async function () {
      await baseReview.connect(reviewer1).leaveReview(
        1,
        5,
        0,
        [],
        "QmReviewIPFS1",
        "",
        [],
        { value: MIN_REVIEW_STAKE }
      );

      // Advance time past edit window
      await time.increase(25 * 60 * 60); // 25 hours

      await expect(
        baseReview.connect(reviewer1).editReview(1, 4, "QmReviewIPFS2")
      ).to.be.revertedWith("Edit window expired");
    });

    it("Should allow deleting own review", async function () {
      await baseReview.connect(reviewer1).leaveReview(
        1,
        5,
        0,
        [],
        "QmReviewIPFS",
        "",
        [],
        { value: MIN_REVIEW_STAKE }
      );

      await expect(
        baseReview.connect(reviewer1).deleteReview(1)
      ).to.emit(baseReview, "ReviewDeleted");

      const review = await baseReview.reviews(1);
      expect(review.status).to.equal(4); // REMOVED
    });
  });

  describe("Helpful Voting", function () {
    beforeEach(async function () {
      await baseReview.connect(developer).registerMiniApp(
        "TestApp",
        "https://testapp.com",
        0,
        [],
        "QmTestMetadata"
      );

      await time.increase(8 * 24 * 60 * 60);

      await baseReview.connect(reviewer1).leaveReview(
        1,
        5,
        0,
        [],
        "QmReviewIPFS",
        "",
        [],
        { value: MIN_REVIEW_STAKE }
      );
    });

    it("Should allow voting helpful", async function () {
      await expect(
        baseReview.connect(reviewer2).voteHelpful(1, true)
      ).to.emit(baseReview, "HelpfulVoted");

      const review = await baseReview.reviews(1);
      expect(review.helpfulScore).to.be.gt(0);
    });

    it("Should reject voting on own review", async function () {
      await expect(
        baseReview.connect(reviewer1).voteHelpful(1, true)
      ).to.be.revertedWith("Cannot vote on own review");
    });

    it("Should reject duplicate votes", async function () {
      await baseReview.connect(reviewer2).voteHelpful(1, true);

      await expect(
        baseReview.connect(reviewer2).voteHelpful(1, false)
      ).to.be.revertedWith("Already voted");
    });
  });

  describe("Developer Features", function () {
    beforeEach(async function () {
      await baseReview.connect(developer).registerMiniApp(
        "TestApp",
        "https://testapp.com",
        0,
        [],
        "QmTestMetadata"
      );

      await time.increase(8 * 24 * 60 * 60);

      await baseReview.connect(reviewer1).leaveReview(
        1,
        3,
        0,
        [],
        "QmReviewIPFS",
        "",
        [],
        { value: MIN_REVIEW_STAKE }
      );
    });

    it("Should allow developer to respond to review", async function () {
      await expect(
        baseReview.connect(developer).respondToReview(1, "QmResponseIPFS")
      ).to.emit(baseReview, "DeveloperResponded");

      const review = await baseReview.reviews(1);
      expect(review.developerResponse).to.equal("QmResponseIPFS");
    });

    it("Should reject response from non-developer", async function () {
      await expect(
        baseReview.connect(reviewer2).respondToReview(1, "QmResponseIPFS")
      ).to.be.revertedWith("Only app developer can respond");
    });

    it("Should allow developer to dispute review", async function () {
      await expect(
        baseReview.connect(developer).disputeReview(
          1,
          "QmEvidenceIPFS",
          [],
          { value: DISPUTE_BOND }
        )
      ).to.emit(baseReview, "ReviewDisputed");

      const review = await baseReview.reviews(1);
      expect(review.status).to.equal(2); // DISPUTED
    });

    it("Should reject dispute without bond", async function () {
      await expect(
        baseReview.connect(developer).disputeReview(
          1,
          "QmEvidenceIPFS",
          [],
          { value: ethers.parseEther("0.001") } // Too low
        )
      ).to.be.revertedWith("Insufficient dispute bond");
    });

    it("Should allow developer to verify app", async function () {
      await expect(
        baseReview.connect(developer).verifyApp(1, "QmProofIPFS", {
          value: VERIFICATION_STAKE,
        })
      ).to.emit(baseReview, "AppVerificationChanged");

      const app = await baseReview.getApp(1);
      expect(app.verificationStatus).to.equal(2); // DEVELOPER_VERIFIED
      expect(app.developerStake).to.equal(VERIFICATION_STAKE);
    });
  });

  describe("Reputation System", function () {
    it("Should return 0 reputation for new user", async function () {
      const score = await baseReview.getReputationScore(reviewer1.address);
      expect(score).to.equal(0);
    });

    it("Should calculate reputation tier correctly", async function () {
      // Newbie tier
      expect(await baseReview.getReputationTier(reviewer1.address)).to.equal(0);
    });
  });

  describe("Query Functions", function () {
    beforeEach(async function () {
      await baseReview.connect(developer).registerMiniApp(
        "TestApp1",
        "https://testapp1.com",
        0,
        [],
        "QmMeta1"
      );

      await baseReview.connect(developer).registerMiniApp(
        "TestApp2",
        "https://testapp2.com",
        1,
        [],
        "QmMeta2"
      );
    });

    it("Should get all apps with pagination", async function () {
      const apps = await baseReview.getAllApps(0, 10);
      expect(apps.length).to.equal(2);
      expect(apps[0].name).to.equal("TestApp1");
      expect(apps[1].name).to.equal("TestApp2");
    });

    it("Should get total apps count", async function () {
      expect(await baseReview.getTotalApps()).to.equal(2);
    });

    it("Should get reviews for app", async function () {
      await time.increase(8 * 24 * 60 * 60);

      await baseReview.connect(reviewer1).leaveReview(
        1,
        5,
        0,
        [],
        "QmReview1",
        "",
        [],
        { value: MIN_REVIEW_STAKE }
      );

      await baseReview.connect(reviewer2).leaveReview(
        1,
        4,
        0,
        [],
        "QmReview2",
        "",
        [],
        { value: MIN_REVIEW_STAKE }
      );

      const reviews = await baseReview.getReviewsForApp(1, 0, 10);
      expect(reviews.length).to.equal(2);
    });
  });

  describe("Admin Functions", function () {
    beforeEach(async function () {
      await baseReview.connect(developer).registerMiniApp(
        "TestApp",
        "https://testapp.com",
        0,
        [],
        "QmTestMetadata"
      );
    });

    it("Should allow owner to update config", async function () {
      await baseReview.updateConfig(
        ethers.parseEther("0.0002"),
        48 * 60 * 60,
        14 * 24 * 60 * 60,
        10
      );

      expect(await baseReview.minReviewStake()).to.equal(
        ethers.parseEther("0.0002")
      );
    });

    it("Should allow owner to confirm scam", async function () {
      await expect(
        baseReview.confirmScam(1)
      ).to.emit(baseReview, "ScamConfirmed");

      const app = await baseReview.getApp(1);
      expect(app.verificationStatus).to.equal(5); // CONFIRMED_SCAM
    });

    it("Should allow owner to set official verification", async function () {
      await expect(
        baseReview.setOfficialVerification(1)
      ).to.emit(baseReview, "AppVerificationChanged");

      const app = await baseReview.getApp(1);
      expect(app.verificationStatus).to.equal(3); // OFFICIAL
    });

    it("Should reject admin functions from non-owner", async function () {
      await expect(
        baseReview.connect(reviewer1).confirmScam(1)
      ).to.be.reverted;
    });

    it("Should allow owner to pause contract", async function () {
      await baseReview.pause();

      await expect(
        baseReview.connect(developer).registerMiniApp(
          "NewApp",
          "https://newapp.com",
          0,
          [],
          "QmMeta"
        )
      ).to.be.reverted;
    });

    it("Should allow owner to unpause contract", async function () {
      await baseReview.pause();
      await baseReview.unpause();

      await expect(
        baseReview.connect(developer).registerMiniApp(
          "NewApp",
          "https://newapp.com",
          0,
          [],
          "QmMeta"
        )
      ).to.not.be.reverted;
    });
  });

  describe("Gas Optimization", function () {
    it("Should register app within gas limits", async function () {
      const tx = await baseReview.connect(developer).registerMiniApp(
        "TestApp",
        "https://testapp.com",
        0,
        ["0x1234567890123456789012345678901234567890"],
        "QmTestMetadata"
      );

      const receipt = await tx.wait();
      const gasUsed = receipt?.gasUsed || 0n;

      console.log("      Gas used for registerMiniApp:", gasUsed.toString());
      expect(gasUsed).to.be.lt(150000); // Should be under 150k gas
    });

    it("Should submit review within gas limits", async function () {
      await baseReview.connect(developer).registerMiniApp(
        "TestApp",
        "https://testapp.com",
        0,
        [],
        "QmTestMetadata"
      );

      await time.increase(8 * 24 * 60 * 60);

      const tx = await baseReview.connect(reviewer1).leaveReview(
        1,
        5,
        0,
        [0, 1],
        "QmReviewIPFS",
        "",
        [],
        { value: MIN_REVIEW_STAKE }
      );

      const receipt = await tx.wait();
      const gasUsed = receipt?.gasUsed || 0n;

      console.log("      Gas used for leaveReview:", gasUsed.toString());
      expect(gasUsed).to.be.lt(200000); // Should be under 200k gas
    });
  });
});

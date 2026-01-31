// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./libraries/ReputationLib.sol";

/**
 * @title BaseReview
 * @notice Decentralized reputation and review platform for Base MiniApps
 * @dev Community-driven watchdog to protect users from scam apps
 */
contract BaseReview is Ownable2Step, ReentrancyGuard, Pausable {
    using ReputationLib for ReputationLib.ReputationData;

    // ============ Enums ============

    enum Category {
        DeFi,
        Gaming,
        NFT,
        Social,
        Utility,
        DAO,
        Other
    }

    enum VerificationStatus {
        UNVERIFIED,
        COMMUNITY_VERIFIED,
        DEVELOPER_VERIFIED,
        OFFICIAL,
        FLAGGED_SUSPICIOUS,
        CONFIRMED_SCAM
    }

    enum ReviewType {
        GENERAL,
        WARNING,
        SCAM_REPORT,
        POSITIVE
    }

    enum ReviewStatus {
        ACTIVE,
        EDITED,
        DISPUTED,
        REMOVED,
        HIDDEN
    }

    enum AppStatus {
        ACTIVE,
        SUSPENDED,
        REMOVED
    }

    // ============ Structs ============

    struct MiniApp {
        uint256 appId;
        string name;
        string url;
        Category category;
        address developer;
        address[] contractAddresses;
        VerificationStatus verificationStatus;
        uint256 registrationDate;
        uint256 totalReviews;
        uint256 averageRating; // Stored as rating * 100 for precision
        uint256 scamReportsCount;
        string metadataIPFS;
        AppStatus status;
        uint256 developerStake;
    }

    struct Review {
        uint256 reviewId;
        uint256 appId;
        address reviewer;
        uint8 rating; // 1-5
        ReviewType reviewType;
        uint8[] tags;
        string reviewIPFS;
        string proofIPFS;
        bytes32[] txHashes;
        uint256 timestamp;
        uint256 lastEdited;
        int256 helpfulScore; // Net votes (upvotes - downvotes)
        uint256 reviewerReputationAtTime;
        string developerResponse;
        ReviewStatus status;
    }

    struct ReviewerProfile {
        uint256 accountCreationBlock;
        uint256 totalReviews;
        uint256 helpfulReviewsCount;
        uint256 disputesLost;
        uint256 consensusAlignments;
        bool hasVerifiedNFT;
        mapping(uint256 => bool) hasReviewedApp;
        mapping(uint256 => bool) hasVotedOnReview;
        uint256 dailyReviewCount;
        uint256 lastReviewDate;
    }

    struct DisputeInfo {
        address disputant;
        uint256 bondAmount;
        string evidenceIPFS;
        bytes32[] proofTxHashes;
        uint256 disputeTimestamp;
        uint256 votesFor;
        uint256 votesAgainst;
        bool resolved;
        bool disputantWon;
    }

    // ============ State Variables ============

    // Configuration
    uint256 public minReviewStake;
    uint256 public reviewEditWindow;
    uint256 public disputePeriod;
    uint256 public scamReportThreshold;
    uint256 public platformFeePercentage;
    uint256 public verificationStake;
    uint256 public disputeBond;
    uint256 public maxReviewsPerDay;
    address[] public commissionWallets;

    // Counters
    uint256 private _appIdCounter;
    uint256 private _reviewIdCounter;

    // Mappings
    mapping(uint256 => MiniApp) public apps;
    mapping(uint256 => Review) public reviews;
    mapping(address => ReviewerProfile) private reviewerProfiles;
    mapping(uint256 => DisputeInfo) public disputes;
    mapping(uint256 => uint256[]) private appReviews; // appId => reviewIds[]
    mapping(uint256 => mapping(address => bool)) private hasVotedOnReview;
    mapping(string => bool) private appNameTaken;
    mapping(string => bool) private appURLTaken;

    // ============ Events ============

    event AppRegistered(
        uint256 indexed appId,
        string name,
        string url,
        address indexed developer,
        Category category
    );
    event AppUpdated(uint256 indexed appId, string field);
    event AppVerificationChanged(
        uint256 indexed appId,
        VerificationStatus oldStatus,
        VerificationStatus newStatus
    );
    event AppFlagged(uint256 indexed appId, uint256 scamReportsCount);

    event ReviewSubmitted(
        uint256 indexed reviewId,
        uint256 indexed appId,
        address indexed reviewer,
        uint8 rating,
        ReviewType reviewType
    );
    event ReviewEdited(uint256 indexed reviewId, uint256 timestamp);
    event ReviewDeleted(uint256 indexed reviewId, address deletedBy);
    event ReviewDisputed(
        uint256 indexed reviewId,
        address indexed developer,
        uint256 bondAmount
    );
    event DisputeResolved(
        uint256 indexed reviewId,
        bool reviewerWon,
        address winner
    );

    event HelpfulVoted(
        uint256 indexed reviewId,
        address indexed voter,
        bool isHelpful,
        int256 newHelpfulScore
    );
    event DeveloperResponded(
        uint256 indexed reviewId,
        uint256 indexed appId,
        address indexed developer
    );

    event ScamReportFiled(
        uint256 indexed reviewId,
        uint256 indexed appId,
        address indexed reporter
    );
    event ScamThresholdReached(
        uint256 indexed appId,
        uint256 scamReportsCount,
        VerificationStatus newStatus
    );
    event ScamConfirmed(uint256 indexed appId, uint256 timestamp);
    event ScamReportInvalidated(uint256 indexed reviewId, string reason);

    event ReputationUpdated(
        address indexed user,
        uint256 oldScore,
        uint256 newScore
    );
    event StakeRefunded(address indexed user, uint256 amount, string reason);
    event ConfigUpdated(string parameter, uint256 newValue);

    // ============ Constructor ============

    constructor(
        uint256 _minReviewStake,
        uint256 _reviewEditWindow,
        uint256 _disputePeriod,
        uint256 _scamReportThreshold,
        uint256 _verificationStake,
        uint256 _disputeBond,
        uint256 _maxReviewsPerDay
    ) Ownable(msg.sender) {
        minReviewStake = _minReviewStake;
        reviewEditWindow = _reviewEditWindow;
        disputePeriod = _disputePeriod;
        scamReportThreshold = _scamReportThreshold;
        verificationStake = _verificationStake;
        disputeBond = _disputeBond;
        maxReviewsPerDay = _maxReviewsPerDay;
        platformFeePercentage = 0;
    }

    // ============ MiniApp Registration ============

    /**
     * @notice Register a new MiniApp for review
     * @param _name App name (must be unique, 3-50 characters)
     * @param _url App URL (must be unique)
     * @param _category App category
     * @param _contractAddresses Associated smart contract addresses
     * @param _metadataIPFS IPFS hash with additional metadata
     * @return appId The ID of the registered app
     */
    function registerMiniApp(
        string memory _name,
        string memory _url,
        Category _category,
        address[] memory _contractAddresses,
        string memory _metadataIPFS
    ) external whenNotPaused returns (uint256 appId) {
        require(bytes(_name).length >= 3 && bytes(_name).length <= 50, "Invalid name length");
        require(bytes(_url).length > 0, "URL required");
        require(bytes(_metadataIPFS).length > 0, "Metadata required");
        require(!appNameTaken[_name], "Name already taken");
        require(!appURLTaken[_url], "URL already registered");

        appId = ++_appIdCounter;

        apps[appId] = MiniApp({
            appId: appId,
            name: _name,
            url: _url,
            category: _category,
            developer: msg.sender,
            contractAddresses: _contractAddresses,
            verificationStatus: VerificationStatus.UNVERIFIED,
            registrationDate: block.timestamp,
            totalReviews: 0,
            averageRating: 0,
            scamReportsCount: 0,
            metadataIPFS: _metadataIPFS,
            status: AppStatus.ACTIVE,
            developerStake: 0
        });

        appNameTaken[_name] = true;
        appURLTaken[_url] = true;

        emit AppRegistered(appId, _name, _url, msg.sender, _category);
        return appId;
    }

    /**
     * @notice Update MiniApp details (only by developer)
     * @param _appId App ID
     * @param _metadataIPFS New metadata IPFS hash
     * @param _contractAddresses New contract addresses
     */
    function updateMiniApp(
        uint256 _appId,
        string memory _metadataIPFS,
        address[] memory _contractAddresses
    ) external {
        require(_appId <= _appIdCounter && _appId > 0, "App does not exist");
        MiniApp storage app = apps[_appId];
        require(app.developer == msg.sender, "Only developer can update");
        require(app.status == AppStatus.ACTIVE, "App not active");

        app.metadataIPFS = _metadataIPFS;
        app.contractAddresses = _contractAddresses;

        emit AppUpdated(_appId, "metadata");
    }

    // ============ Review System ============

    /**
     * @notice Submit a review for a MiniApp
     * @param _appId App ID to review
     * @param _rating Rating (1-5)
     * @param _reviewType Type of review
     * @param _tags Array of tag IDs
     * @param _reviewIPFS IPFS hash of review text
     * @param _proofIPFS IPFS hash of proof/evidence
     * @param _txHashes Transaction hashes as proof
     * @return reviewId The ID of the submitted review
     */
    function leaveReview(
        uint256 _appId,
        uint8 _rating,
        ReviewType _reviewType,
        uint8[] memory _tags,
        string memory _reviewIPFS,
        string memory _proofIPFS,
        bytes32[] memory _txHashes
    ) external payable nonReentrant whenNotPaused returns (uint256 reviewId) {
        require(_appId <= _appIdCounter && _appId > 0, "App does not exist");
        require(apps[_appId].status == AppStatus.ACTIVE, "App not active");
        require(msg.value >= minReviewStake, "Insufficient stake");
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");
        require(bytes(_reviewIPFS).length > 0, "Review text required");

        ReviewerProfile storage profile = reviewerProfiles[msg.sender];

        // Initialize profile if first review
        if (profile.accountCreationBlock == 0) {
            profile.accountCreationBlock = block.number;
        }

        // Check minimum requirements
        uint256 accountAge = block.timestamp - (block.number - profile.accountCreationBlock) * 12; // Rough estimate
        require(
            ReputationLib.meetsMinimumRequirements(accountAge, profile.totalReviews),
            "Does not meet minimum requirements"
        );

        // Check rate limiting
        if (block.timestamp / 1 days == profile.lastReviewDate / 1 days) {
            require(profile.dailyReviewCount < maxReviewsPerDay, "Daily review limit reached");
            profile.dailyReviewCount++;
        } else {
            profile.dailyReviewCount = 1;
            profile.lastReviewDate = block.timestamp;
        }

        // Check if already reviewed this app
        require(!profile.hasReviewedApp[_appId], "Already reviewed this app");

        // Scam reports require proof
        if (_reviewType == ReviewType.SCAM_REPORT) {
            require(
                bytes(_proofIPFS).length > 0 || _txHashes.length > 0,
                "Scam reports require proof"
            );
        }

        // Create review
        reviewId = ++_reviewIdCounter;
        uint256 currentReputation = getReputationScore(msg.sender);

        reviews[reviewId] = Review({
            reviewId: reviewId,
            appId: _appId,
            reviewer: msg.sender,
            rating: _rating,
            reviewType: _reviewType,
            tags: _tags,
            reviewIPFS: _reviewIPFS,
            proofIPFS: _proofIPFS,
            txHashes: _txHashes,
            timestamp: block.timestamp,
            lastEdited: 0,
            helpfulScore: 0,
            reviewerReputationAtTime: currentReputation,
            developerResponse: "",
            status: ReviewStatus.ACTIVE
        });

        // Update app stats
        MiniApp storage app = apps[_appId];
        app.totalReviews++;
        _updateAverageRating(_appId);

        // Update reviewer profile
        profile.hasReviewedApp[_appId] = true;
        profile.totalReviews++;

        // Track review for app
        appReviews[_appId].push(reviewId);

        // Handle scam reports
        if (_reviewType == ReviewType.SCAM_REPORT) {
            app.scamReportsCount++;
            emit ScamReportFiled(reviewId, _appId, msg.sender);
            _checkScamThreshold(_appId);
        }

        emit ReviewSubmitted(reviewId, _appId, msg.sender, _rating, _reviewType);
        return reviewId;
    }

    /**
     * @notice Edit a review within the edit window
     * @param _reviewId Review ID
     * @param _rating New rating
     * @param _reviewIPFS New review IPFS hash
     */
    function editReview(
        uint256 _reviewId,
        uint8 _rating,
        string memory _reviewIPFS
    ) external {
        require(_reviewId <= _reviewIdCounter && _reviewId > 0, "Review does not exist");
        Review storage review = reviews[_reviewId];
        require(review.reviewer == msg.sender, "Only reviewer can edit");
        require(review.status == ReviewStatus.ACTIVE, "Review not editable");
        require(
            block.timestamp <= review.timestamp + reviewEditWindow,
            "Edit window expired"
        );
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");

        review.rating = _rating;
        review.reviewIPFS = _reviewIPFS;
        review.lastEdited = block.timestamp;
        review.status = ReviewStatus.EDITED;

        _updateAverageRating(review.appId);

        emit ReviewEdited(_reviewId, block.timestamp);
    }

    /**
     * @notice Delete own review
     * @param _reviewId Review ID
     */
    function deleteReview(uint256 _reviewId) external {
        require(_reviewId <= _reviewIdCounter && _reviewId > 0, "Review does not exist");
        Review storage review = reviews[_reviewId];
        require(review.reviewer == msg.sender, "Only reviewer can delete");
        require(review.status != ReviewStatus.REMOVED, "Already removed");

        review.status = ReviewStatus.REMOVED;

        // Update app stats
        MiniApp storage app = apps[review.appId];
        if (app.totalReviews > 0) {
            app.totalReviews--;
        }
        if (review.reviewType == ReviewType.SCAM_REPORT && app.scamReportsCount > 0) {
            app.scamReportsCount--;
        }

        _updateAverageRating(review.appId);

        // Update reviewer profile
        ReviewerProfile storage profile = reviewerProfiles[msg.sender];
        profile.hasReviewedApp[review.appId] = false;

        emit ReviewDeleted(_reviewId, msg.sender);
    }

    // ============ Helpful Voting ============

    /**
     * @notice Vote on review helpfulness
     * @param _reviewId Review ID
     * @param _isHelpful True for helpful, false for not helpful
     */
    function voteHelpful(uint256 _reviewId, bool _isHelpful) external whenNotPaused {
        require(_reviewId <= _reviewIdCounter && _reviewId > 0, "Review does not exist");
        Review storage review = reviews[_reviewId];
        require(review.status == ReviewStatus.ACTIVE || review.status == ReviewStatus.EDITED, "Review not active");
        require(review.reviewer != msg.sender, "Cannot vote on own review");
        require(!hasVotedOnReview[_reviewId][msg.sender], "Already voted");

        hasVotedOnReview[_reviewId][msg.sender] = true;

        // Apply vote weight based on voter's reputation
        uint256 voterReputation = getReputationScore(msg.sender);
        uint256 voteWeight = ReputationLib.getVoteWeight(voterReputation);

        int256 weightedVote = _isHelpful ? int256(voteWeight) : -int256(voteWeight);
        review.helpfulScore += weightedVote;

        // Update reviewer's helpful reviews count if positive
        if (review.helpfulScore >= 1000) { // 10+ helpful votes (10 * 100 weight)
            ReviewerProfile storage reviewerProfile = reviewerProfiles[review.reviewer];
            bool wasHelpful = reviewerProfile.helpfulReviewsCount > 0;

            if (!wasHelpful) {
                reviewerProfile.helpfulReviewsCount++;

                // Refund stake if reaches threshold
                payable(review.reviewer).transfer(minReviewStake);
                emit StakeRefunded(review.reviewer, minReviewStake, "Helpful review");
            }
        }

        emit HelpfulVoted(_reviewId, msg.sender, _isHelpful, review.helpfulScore);
    }

    // ============ Developer Features ============

    /**
     * @notice Developer responds to a review
     * @param _reviewId Review ID
     * @param _responseIPFS IPFS hash of response
     */
    function respondToReview(uint256 _reviewId, string memory _responseIPFS) external {
        require(_reviewId <= _reviewIdCounter && _reviewId > 0, "Review does not exist");
        Review storage review = reviews[_reviewId];
        MiniApp storage app = apps[review.appId];
        require(app.developer == msg.sender, "Only app developer can respond");
        require(bytes(_responseIPFS).length > 0, "Response required");

        review.developerResponse = _responseIPFS;

        emit DeveloperResponded(_reviewId, review.appId, msg.sender);
    }

    /**
     * @notice Dispute a review
     * @param _reviewId Review ID
     * @param _evidenceIPFS IPFS hash of counter-evidence
     * @param _proofTxHashes Transaction hashes as proof
     */
    function disputeReview(
        uint256 _reviewId,
        string memory _evidenceIPFS,
        bytes32[] memory _proofTxHashes
    ) external payable nonReentrant {
        require(_reviewId <= _reviewIdCounter && _reviewId > 0, "Review does not exist");
        require(msg.value >= disputeBond, "Insufficient dispute bond");
        Review storage review = reviews[_reviewId];
        MiniApp storage app = apps[review.appId];
        require(app.developer == msg.sender, "Only app developer can dispute");
        require(review.status == ReviewStatus.ACTIVE || review.status == ReviewStatus.EDITED, "Review not disputable");
        require(disputes[_reviewId].disputant == address(0), "Already disputed");

        review.status = ReviewStatus.DISPUTED;

        disputes[_reviewId] = DisputeInfo({
            disputant: msg.sender,
            bondAmount: msg.value,
            evidenceIPFS: _evidenceIPFS,
            proofTxHashes: _proofTxHashes,
            disputeTimestamp: block.timestamp,
            votesFor: 0,
            votesAgainst: 0,
            resolved: false,
            disputantWon: false
        });

        emit ReviewDisputed(_reviewId, msg.sender, msg.value);
    }

    /**
     * @notice Verify app by staking ETH
     * @param _appId App ID
     * @param _proofIPFS IPFS hash of verification proof
     */
    function verifyApp(uint256 _appId, string memory _proofIPFS) external payable nonReentrant {
        require(_appId <= _appIdCounter && _appId > 0, "App does not exist");
        require(msg.value >= verificationStake, "Insufficient verification stake");
        MiniApp storage app = apps[_appId];
        require(app.developer == msg.sender, "Only app developer can verify");
        require(
            app.verificationStatus == VerificationStatus.UNVERIFIED ||
            app.verificationStatus == VerificationStatus.COMMUNITY_VERIFIED,
            "Already verified or flagged"
        );

        VerificationStatus oldStatus = app.verificationStatus;
        app.verificationStatus = VerificationStatus.DEVELOPER_VERIFIED;
        app.developerStake = msg.value;

        emit AppVerificationChanged(_appId, oldStatus, VerificationStatus.DEVELOPER_VERIFIED);
    }

    // ============ View Functions ============

    /**
     * @notice Get app details
     * @param _appId App ID
     * @return app MiniApp struct
     */
    function getApp(uint256 _appId) external view returns (MiniApp memory) {
        require(_appId <= _appIdCounter && _appId > 0, "App does not exist");
        return apps[_appId];
    }

    /**
     * @notice Get multiple apps with pagination
     * @param _offset Starting index
     * @param _limit Number of apps to return
     * @return appsList Array of MiniApp structs
     */
    function getAllApps(uint256 _offset, uint256 _limit) external view returns (MiniApp[] memory appsList) {
        require(_offset < _appIdCounter, "Offset out of bounds");

        uint256 end = _offset + _limit;
        if (end > _appIdCounter) {
            end = _appIdCounter;
        }

        uint256 resultSize = end - _offset;
        appsList = new MiniApp[](resultSize);

        for (uint256 i = 0; i < resultSize; i++) {
            appsList[i] = apps[_offset + i + 1];
        }

        return appsList;
    }

    /**
     * @notice Get reviews for a specific app
     * @param _appId App ID
     * @param _offset Starting index
     * @param _limit Number of reviews to return
     * @return reviewsList Array of Review structs
     */
    function getReviewsForApp(
        uint256 _appId,
        uint256 _offset,
        uint256 _limit
    ) external view returns (Review[] memory reviewsList) {
        require(_appId <= _appIdCounter && _appId > 0, "App does not exist");

        uint256[] storage reviewIds = appReviews[_appId];
        require(_offset < reviewIds.length, "Offset out of bounds");

        uint256 end = _offset + _limit;
        if (end > reviewIds.length) {
            end = reviewIds.length;
        }

        uint256 resultSize = end - _offset;
        reviewsList = new Review[](resultSize);

        for (uint256 i = 0; i < resultSize; i++) {
            reviewsList[i] = reviews[reviewIds[_offset + i]];
        }

        return reviewsList;
    }

    /**
     * @notice Get reputation score for a reviewer
     * @param _reviewer Reviewer address
     * @return score Reputation score (0-100)
     */
    function getReputationScore(address _reviewer) public view returns (uint256 score) {
        ReviewerProfile storage profile = reviewerProfiles[_reviewer];

        if (profile.accountCreationBlock == 0) {
            return 0;
        }

        ReputationLib.ReputationData memory data = ReputationLib.ReputationData({
            accountCreationBlock: (block.number - profile.accountCreationBlock) * 12, // Convert to timestamp
            totalReviews: profile.totalReviews,
            helpfulReviews: profile.helpfulReviewsCount,
            disputesLost: profile.disputesLost,
            consensusAlignments: profile.consensusAlignments,
            hasVerifiedNFT: profile.hasVerifiedNFT
        });

        return data.calculateScore();
    }

    /**
     * @notice Get reviewer's tier
     * @param _reviewer Reviewer address
     * @return tier 0=Newbie, 1=Regular, 2=Trusted, 3=Expert
     */
    function getReputationTier(address _reviewer) external view returns (uint8 tier) {
        uint256 score = getReputationScore(_reviewer);
        return ReputationLib.getTier(score);
    }

    /**
     * @notice Get total number of apps
     * @return count Total apps registered
     */
    function getTotalApps() external view returns (uint256) {
        return _appIdCounter;
    }

    /**
     * @notice Get total number of reviews
     * @return count Total reviews submitted
     */
    function getTotalReviews() external view returns (uint256) {
        return _reviewIdCounter;
    }

    // ============ Internal Functions ============

    /**
     * @dev Update average rating for an app
     * @param _appId App ID
     */
    function _updateAverageRating(uint256 _appId) internal {
        uint256[] storage reviewIds = appReviews[_appId];
        uint256 totalWeightedRating = 0;
        uint256 totalWeight = 0;
        uint256 activeReviewCount = 0;

        for (uint256 i = 0; i < reviewIds.length; i++) {
            Review storage review = reviews[reviewIds[i]];

            if (review.status == ReviewStatus.ACTIVE || review.status == ReviewStatus.EDITED) {
                if (review.reviewType == ReviewType.GENERAL || review.reviewType == ReviewType.POSITIVE) {
                    uint256 weight = ReputationLib.getVoteWeight(review.reviewerReputationAtTime);
                    totalWeightedRating += review.rating * weight;
                    totalWeight += weight;
                    activeReviewCount++;
                }
            }
        }

        if (totalWeight > 0) {
            // Store as rating * 100 for precision (e.g., 4.5 stars = 450)
            apps[_appId].averageRating = (totalWeightedRating * 100) / totalWeight;
        } else {
            apps[_appId].averageRating = 0;
        }

        apps[_appId].totalReviews = activeReviewCount;
    }

    /**
     * @dev Check if scam threshold is reached and flag app
     * @param _appId App ID
     */
    function _checkScamThreshold(uint256 _appId) internal {
        MiniApp storage app = apps[_appId];

        // Count verified scam reports (from users with reputation > 50)
        uint256 verifiedScamReports = 0;
        uint256[] storage reviewIds = appReviews[_appId];

        for (uint256 i = 0; i < reviewIds.length; i++) {
            Review storage review = reviews[reviewIds[i]];
            if (review.reviewType == ReviewType.SCAM_REPORT &&
                (review.status == ReviewStatus.ACTIVE || review.status == ReviewStatus.EDITED)) {
                if (review.reviewerReputationAtTime >= 50) {
                    verifiedScamReports++;
                }
            }
        }

        // Flag if threshold reached
        if (verifiedScamReports >= scamReportThreshold) {
            VerificationStatus oldStatus = app.verificationStatus;
            app.verificationStatus = VerificationStatus.FLAGGED_SUSPICIOUS;
            emit AppFlagged(_appId, app.scamReportsCount);
            emit ScamThresholdReached(_appId, app.scamReportsCount, VerificationStatus.FLAGGED_SUSPICIOUS);
            emit AppVerificationChanged(_appId, oldStatus, VerificationStatus.FLAGGED_SUSPICIOUS);
        }
    }

    // ============ Admin Functions ============

    /**
     * @notice Update configuration parameters
     * @param _minReviewStake New minimum review stake
     * @param _reviewEditWindow New edit window
     * @param _disputePeriod New dispute period
     * @param _scamReportThreshold New scam threshold
     */
    function updateConfig(
        uint256 _minReviewStake,
        uint256 _reviewEditWindow,
        uint256 _disputePeriod,
        uint256 _scamReportThreshold
    ) external onlyOwner {
        minReviewStake = _minReviewStake;
        reviewEditWindow = _reviewEditWindow;
        disputePeriod = _disputePeriod;
        scamReportThreshold = _scamReportThreshold;

        emit ConfigUpdated("all", 0);
    }

    /**
     * @notice Mark app as confirmed scam (DAO/governance only)
     * @param _appId App ID
     */
    function confirmScam(uint256 _appId) external onlyOwner {
        require(_appId <= _appIdCounter && _appId > 0, "App does not exist");
        MiniApp storage app = apps[_appId];

        VerificationStatus oldStatus = app.verificationStatus;
        app.verificationStatus = VerificationStatus.CONFIRMED_SCAM;
        app.status = AppStatus.SUSPENDED;

        emit ScamConfirmed(_appId, block.timestamp);
        emit AppVerificationChanged(_appId, oldStatus, VerificationStatus.CONFIRMED_SCAM);

        // Distribute developer stake to scam reporters if exists
        if (app.developerStake > 0) {
            // Logic to distribute stake would go here
            app.developerStake = 0;
        }
    }

    /**
     * @notice Set official verification (DAO/governance only)
     * @param _appId App ID
     */
    function setOfficialVerification(uint256 _appId) external onlyOwner {
        require(_appId <= _appIdCounter && _appId > 0, "App does not exist");
        MiniApp storage app = apps[_appId];

        VerificationStatus oldStatus = app.verificationStatus;
        app.verificationStatus = VerificationStatus.OFFICIAL;

        emit AppVerificationChanged(_appId, oldStatus, VerificationStatus.OFFICIAL);
    }

    /**
     * @notice Remove review (moderation only)
     * @param _reviewId Review ID
     * @param _reason Reason for removal
     */
    function removeReview(uint256 _reviewId, string memory _reason) external onlyOwner {
        require(_reviewId <= _reviewIdCounter && _reviewId > 0, "Review does not exist");
        Review storage review = reviews[_reviewId];
        review.status = ReviewStatus.REMOVED;

        emit ReviewDeleted(_reviewId, msg.sender);
    }

    /**
     * @notice Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Withdraw contract balance (fees)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        payable(owner()).transfer(balance);
    }

    // Allow contract to receive ETH
    receive() external payable {}
}

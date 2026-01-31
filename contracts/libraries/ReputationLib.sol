// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ReputationLib
 * @notice Library for calculating reviewer reputation scores
 * @dev Score range: 0-100 based on multiple factors
 */
library ReputationLib {
    uint256 private constant MAX_SCORE = 100;
    uint256 private constant WALLET_AGE_MAX_POINTS = 20;
    uint256 private constant ACTIVITY_MAX_POINTS = 20;
    uint256 private constant HELPFUL_MAX_POINTS = 30;
    uint256 private constant NFT_MAX_POINTS = 10;
    uint256 private constant CONSENSUS_MAX_POINTS = 20;

    uint256 private constant MONTH_IN_SECONDS = 30 days;
    uint256 private constant DISPUTE_PENALTY = 5;

    struct ReputationData {
        uint256 accountCreationBlock;
        uint256 totalReviews;
        uint256 helpfulReviews;
        uint256 disputesLost;
        uint256 consensusAlignments;
        bool hasVerifiedNFT;
    }

    /**
     * @notice Calculate reputation score for a reviewer
     * @param data Reputation data struct
     * @return score Final reputation score (0-100)
     */
    function calculateScore(ReputationData memory data) internal view returns (uint256 score) {
        // Wallet age: 1 point per month, max 20 months
        uint256 accountAge = block.timestamp - data.accountCreationBlock;
        uint256 agePoints = (accountAge / MONTH_IN_SECONDS);
        if (agePoints > WALLET_AGE_MAX_POINTS) {
            agePoints = WALLET_AGE_MAX_POINTS;
        }

        // Activity: 2 points per review, max 20 points (10 reviews)
        uint256 activityPoints = data.totalReviews * 2;
        if (activityPoints > ACTIVITY_MAX_POINTS) {
            activityPoints = ACTIVITY_MAX_POINTS;
        }

        // Helpful reviews: 3 points per helpful review, max 30 points (10 reviews)
        uint256 helpfulPoints = data.helpfulReviews * 3;
        if (helpfulPoints > HELPFUL_MAX_POINTS) {
            helpfulPoints = HELPFUL_MAX_POINTS;
        }

        // NFT holdings: 10 points if has verified NFT
        uint256 nftPoints = data.hasVerifiedNFT ? NFT_MAX_POINTS : 0;

        // Consensus alignment: 2 points per alignment, max 20 points
        uint256 consensusPoints = data.consensusAlignments * 2;
        if (consensusPoints > CONSENSUS_MAX_POINTS) {
            consensusPoints = CONSENSUS_MAX_POINTS;
        }

        // Sum up points
        score = agePoints + activityPoints + helpfulPoints + nftPoints + consensusPoints;

        // Apply penalties for lost disputes
        uint256 penalties = data.disputesLost * DISPUTE_PENALTY;
        if (score > penalties) {
            score -= penalties;
        } else {
            score = 0;
        }

        // Cap at max score
        if (score > MAX_SCORE) {
            score = MAX_SCORE;
        }

        return score;
    }

    /**
     * @notice Get reputation tier based on score
     * @param score Reputation score (0-100)
     * @return tier 0=Newbie, 1=Regular, 2=Trusted, 3=Expert
     */
    function getTier(uint256 score) internal pure returns (uint8 tier) {
        if (score >= 81) return 3; // Expert
        if (score >= 51) return 2; // Trusted
        if (score >= 21) return 1; // Regular
        return 0; // Newbie
    }

    /**
     * @notice Get vote weight multiplier based on reputation score
     * @param score Reputation score (0-100)
     * @return weight Vote weight as a multiplier (50 = 0.5x, 100 = 1x, 150 = 1.5x, 200 = 2x)
     */
    function getVoteWeight(uint256 score) internal pure returns (uint256 weight) {
        if (score >= 81) return 200; // Expert: 2x weight
        if (score >= 51) return 150; // Trusted: 1.5x weight
        if (score >= 21) return 100; // Regular: 1x weight
        return 50; // Newbie: 0.5x weight
    }

    /**
     * @notice Check if reviewer meets minimum activity requirements
     * @param accountAge Age of account in seconds
     * @param reviewCount Number of reviews written
     * @return bool True if meets requirements
     */
    function meetsMinimumRequirements(
        uint256 accountAge,
        uint256 reviewCount
    ) internal pure returns (bool) {
        // Account must be at least 7 days old
        if (accountAge < 7 days) return false;

        // No minimum review count for first review
        return true;
    }
}

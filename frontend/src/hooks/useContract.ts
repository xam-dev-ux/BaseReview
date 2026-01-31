import { useMemo } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import { useWallet } from './useWallet';

const CONTRACT_ADDRESS = import.meta.env.VITE_REVIEW_CONTRACT_ADDRESS;

// Simplified ABI - add full ABI from compiled contract
const BASE_REVIEW_ABI = [
  // Read functions
  'function getApp(uint256 _appId) view returns (tuple(uint256 appId, string name, string url, uint8 category, address developer, address[] contractAddresses, uint8 verificationStatus, uint256 registrationDate, uint256 totalReviews, uint256 averageRating, uint256 scamReportsCount, string metadataIPFS, uint8 status, uint256 developerStake))',
  'function getAllApps(uint256 _offset, uint256 _limit) view returns (tuple(uint256 appId, string name, string url, uint8 category, address developer, address[] contractAddresses, uint8 verificationStatus, uint256 registrationDate, uint256 totalReviews, uint256 averageRating, uint256 scamReportsCount, string metadataIPFS, uint8 status, uint256 developerStake)[])',
  'function getReviewsForApp(uint256 _appId, uint256 _offset, uint256 _limit) view returns (tuple(uint256 reviewId, uint256 appId, address reviewer, uint8 rating, uint8 reviewType, uint8[] tags, string reviewIPFS, string proofIPFS, bytes32[] txHashes, uint256 timestamp, uint256 lastEdited, int256 helpfulScore, uint256 reviewerReputationAtTime, string developerResponse, uint8 status)[])',
  'function getReputationScore(address _reviewer) view returns (uint256)',
  'function getReputationTier(address _reviewer) view returns (uint8)',
  'function getTotalApps() view returns (uint256)',
  'function getTotalReviews() view returns (uint256)',
  'function minReviewStake() view returns (uint256)',
  'function verificationStake() view returns (uint256)',
  'function disputeBond() view returns (uint256)',

  // Write functions
  'function registerMiniApp(string memory _name, string memory _url, uint8 _category, address[] memory _contractAddresses, string memory _metadataIPFS) returns (uint256)',
  'function updateMiniApp(uint256 _appId, string memory _metadataIPFS, address[] memory _contractAddresses)',
  'function leaveReview(uint256 _appId, uint8 _rating, uint8 _reviewType, uint8[] memory _tags, string memory _reviewIPFS, string memory _proofIPFS, bytes32[] memory _txHashes) payable returns (uint256)',
  'function editReview(uint256 _reviewId, uint8 _rating, string memory _reviewIPFS)',
  'function deleteReview(uint256 _reviewId)',
  'function voteHelpful(uint256 _reviewId, bool _isHelpful)',
  'function respondToReview(uint256 _reviewId, string memory _responseIPFS)',
  'function disputeReview(uint256 _reviewId, string memory _evidenceIPFS, bytes32[] memory _proofTxHashes) payable',
  'function verifyApp(uint256 _appId, string memory _proofIPFS) payable',

  // Events
  'event AppRegistered(uint256 indexed appId, string name, string url, address indexed developer, uint8 category)',
  'event ReviewSubmitted(uint256 indexed reviewId, uint256 indexed appId, address indexed reviewer, uint8 rating, uint8 reviewType)',
  'event HelpfulVoted(uint256 indexed reviewId, address indexed voter, bool isHelpful, int256 newHelpfulScore)',
];

export function useContract() {
  const { provider, account } = useWallet();

  const contract = useMemo(() => {
    if (!provider || !CONTRACT_ADDRESS) {
      return null;
    }

    return new Contract(CONTRACT_ADDRESS, BASE_REVIEW_ABI, provider);
  }, [provider]);

  const contractWithSigner = useMemo(async () => {
    if (!provider || !CONTRACT_ADDRESS || !account) {
      return null;
    }

    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESS, BASE_REVIEW_ABI, signer);
  }, [provider, account]);

  return {
    contract,
    contractWithSigner,
    contractAddress: CONTRACT_ADDRESS,
  };
}

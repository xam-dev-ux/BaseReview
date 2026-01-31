export enum Category {
  DeFi = 0,
  Gaming = 1,
  NFT = 2,
  Social = 3,
  Utility = 4,
  DAO = 5,
  Other = 6,
}

export enum VerificationStatus {
  UNVERIFIED = 0,
  COMMUNITY_VERIFIED = 1,
  DEVELOPER_VERIFIED = 2,
  OFFICIAL = 3,
  FLAGGED_SUSPICIOUS = 4,
  CONFIRMED_SCAM = 5,
}

export enum ReviewType {
  GENERAL = 0,
  WARNING = 1,
  SCAM_REPORT = 2,
  POSITIVE = 3,
}

export enum ReviewStatus {
  ACTIVE = 0,
  EDITED = 1,
  DISPUTED = 2,
  REMOVED = 3,
  HIDDEN = 4,
}

export enum AppStatus {
  ACTIVE = 0,
  SUSPENDED = 1,
  REMOVED = 2,
}

export interface MiniApp {
  appId: bigint;
  name: string;
  url: string;
  category: Category;
  developer: string;
  contractAddresses: string[];
  verificationStatus: VerificationStatus;
  registrationDate: bigint;
  totalReviews: bigint;
  averageRating: bigint;
  scamReportsCount: bigint;
  metadataIPFS: string;
  status: AppStatus;
  developerStake: bigint;
}

export interface Review {
  reviewId: bigint;
  appId: bigint;
  reviewer: string;
  rating: number;
  reviewType: ReviewType;
  tags: number[];
  reviewIPFS: string;
  proofIPFS: string;
  txHashes: string[];
  timestamp: bigint;
  lastEdited: bigint;
  helpfulScore: bigint;
  reviewerReputationAtTime: bigint;
  developerResponse: string;
  status: ReviewStatus;
}

export interface AppMetadata {
  name: string;
  description: string;
  logo: string;
  screenshots: string[];
  category: string;
  website: string;
  twitter: string;
  discord: string;
  docs: string;
  version: string;
}

export interface ReviewMetadata {
  rating: number;
  reviewText: string;
  tags: string[];
  pros: string[];
  cons: string[];
  wouldRecommend: boolean;
  timestamp: number;
}

export interface ProofMetadata {
  type: string;
  description: string;
  screenshots: string[];
  transactionHashes: string[];
  additionalInfo: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.DeFi]: 'DeFi',
  [Category.Gaming]: 'Gaming',
  [Category.NFT]: 'NFT',
  [Category.Social]: 'Social',
  [Category.Utility]: 'Utility',
  [Category.DAO]: 'DAO',
  [Category.Other]: 'Other',
};

export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  [VerificationStatus.UNVERIFIED]: 'Unverified',
  [VerificationStatus.COMMUNITY_VERIFIED]: 'Community Verified',
  [VerificationStatus.DEVELOPER_VERIFIED]: 'Developer Verified',
  [VerificationStatus.OFFICIAL]: 'Official',
  [VerificationStatus.FLAGGED_SUSPICIOUS]: 'Flagged',
  [VerificationStatus.CONFIRMED_SCAM]: 'Confirmed Scam',
};

export const REVIEW_TYPE_LABELS: Record<ReviewType, string> = {
  [ReviewType.GENERAL]: 'General Review',
  [ReviewType.WARNING]: 'Warning',
  [ReviewType.SCAM_REPORT]: 'Scam Report',
  [ReviewType.POSITIVE]: 'Positive',
};

export const TAG_OPTIONS = {
  positive: [
    { id: 0, label: 'Easy to use' },
    { id: 1, label: 'Fast' },
    { id: 2, label: 'Low fees' },
    { id: 3, label: 'Great support' },
    { id: 4, label: 'Transparent' },
  ],
  negative: [
    { id: 5, label: 'Confusing' },
    { id: 6, label: 'Slow' },
    { id: 7, label: 'High fees' },
    { id: 8, label: 'Bugs' },
    { id: 9, label: 'Poor UX' },
  ],
  scam: [
    { id: 10, label: 'Rug pull' },
    { id: 11, label: 'Cannot withdraw' },
    { id: 12, label: 'Fake promises' },
    { id: 13, label: 'Honeypot' },
    { id: 14, label: 'Phishing' },
  ],
};

export const ALL_TAGS = [
  ...TAG_OPTIONS.positive,
  ...TAG_OPTIONS.negative,
  ...TAG_OPTIONS.scam,
];

const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';

/**
 * Upload data to IPFS (mock implementation)
 * In production, integrate with Web3.Storage or similar service
 */
export async function uploadToIPFS(data: any): Promise<string> {
  // Mock implementation - returns a fake IPFS hash
  // In production, use Web3.Storage client:
  /*
  const client = new Web3StorageClient({ token: import.meta.env.VITE_WEB3_STORAGE_TOKEN });
  const file = new File([JSON.stringify(data)], 'data.json');
  const cid = await client.put([file]);
  return cid;
  */

  console.log('Uploading to IPFS:', data);

  // Generate fake CID for demo
  const fakeCid = 'Qm' + Math.random().toString(36).substring(2, 15) +
                  Math.random().toString(36).substring(2, 15);

  // Store in localStorage for demo purposes
  localStorage.setItem(`ipfs_${fakeCid}`, JSON.stringify(data));

  return fakeCid;
}

/**
 * Fetch data from IPFS
 */
export async function fetchFromIPFS<T>(cid: string): Promise<T | null> {
  try {
    // Try localStorage first (for demo data)
    const localData = localStorage.getItem(`ipfs_${cid}`);
    if (localData) {
      return JSON.parse(localData) as T;
    }

    // Fetch from gateway
    const response = await fetch(`${IPFS_GATEWAY}${cid}`);
    if (!response.ok) {
      throw new Error('Failed to fetch from IPFS');
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    return null;
  }
}

/**
 * Get IPFS gateway URL for a CID
 */
export function getIPFSUrl(cid: string): string {
  if (!cid) return '';
  if (cid.startsWith('http')) return cid;
  return `${IPFS_GATEWAY}${cid}`;
}

/**
 * Upload file to IPFS
 */
export async function uploadFileToIPFS(file: File): Promise<string> {
  // Mock implementation
  console.log('Uploading file to IPFS:', file.name);

  const fakeCid = 'Qm' + Math.random().toString(36).substring(2, 15) +
                  Math.random().toString(36).substring(2, 15);

  // In production, upload the actual file
  return fakeCid;
}

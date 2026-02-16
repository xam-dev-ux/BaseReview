import { Contract, TransactionResponse, ContractRunner } from 'ethers';
import { appendBuilderCode } from './builderCode';

/**
 * Executes a contract transaction with builder code attribution.
 * This wraps any contract write function to automatically append the builder code.
 */
export async function executeWithBuilderCode<T extends any[]>(
  contract: Contract,
  functionName: string,
  args: T,
  overrides: any = {}
): Promise<TransactionResponse> {
  // Populate the transaction to get the data field
  const populatedTx = await contract[functionName].populateTransaction(...args, overrides);

  // Append the builder code to the transaction data
  const txWithBuilderCode = {
    ...populatedTx,
    data: appendBuilderCode(populatedTx.data),
  };

  // Send the transaction with the modified data
  const signer = contract.runner as ContractRunner & { sendTransaction: (tx: any) => Promise<TransactionResponse> };
  if (!signer || typeof signer.sendTransaction !== 'function') {
    throw new Error('Contract must be connected to a signer');
  }

  return await signer.sendTransaction(txWithBuilderCode);
}

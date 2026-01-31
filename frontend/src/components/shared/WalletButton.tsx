import { Wallet, AlertCircle, LogOut } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { formatAddress } from '../../utils/format';

export function WalletButton() {
  const { account, isConnecting, isConnected, isCorrectNetwork, connect, disconnect, switchToBase, error } = useWallet();

  if (isConnected && !isCorrectNetwork) {
    return (
      <button
        onClick={switchToBase}
        className="btn bg-warning text-white hover:bg-orange-600 flex items-center gap-2"
      >
        <AlertCircle size={18} />
        Switch to Base
      </button>
    );
  }

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm font-medium text-green-700">
          {formatAddress(account)}
        </div>
        <button
          onClick={disconnect}
          className="btn btn-secondary flex items-center gap-2"
          title="Disconnect"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={connect}
        disabled={isConnecting}
        className="btn btn-primary flex items-center gap-2"
      >
        <Wallet size={18} />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {error && (
        <p className="text-xs text-danger mt-1">{error}</p>
      )}
    </div>
  );
}

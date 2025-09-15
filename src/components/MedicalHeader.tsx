import { Shield } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const MedicalHeader = () => {
  const { isConnected } = useAccount();

  return (
    <header className="bg-gradient-to-r from-medical-primary to-clinical-green text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Health Records, Your Privacy</h1>
              <p className="text-blue-100 text-sm">Secure medical identity NFTs</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isConnected && (
              <div className="text-sm text-blue-100">
                Connected to Sepolia
              </div>
            )}
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="bg-white/20 text-white border border-white/30 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                          >
                            <Shield className="h-4 w-4" />
                            Connect Wallet
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            className="bg-red-500/20 text-white border border-red-300/30 hover:bg-red-500/30 px-4 py-2 rounded-lg transition-colors duration-200"
                          >
                            Wrong network
                          </button>
                        );
                      }

                      return (
                        <div className="flex items-center gap-3">
                          <div className="text-right text-sm">
                            <div className="text-white font-medium">
                              {account.displayName}
                            </div>
                            <div className="text-blue-100 text-xs">
                              {account.balanceFormatted} {account.symbol}
                            </div>
                          </div>
                          <button
                            onClick={openAccountModal}
                            className="bg-white/20 text-white border border-white/30 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors duration-200"
                          >
                            Account
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MedicalHeader;
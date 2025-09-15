import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Check, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const { disconnect } = useDisconnect();

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  const openExplorer = () => {
    if (address) {
      window.open(`https://sepolia.etherscan.io/address/${address}`, '_blank');
    }
  };

  return (
    <Card className="max-w-md mx-auto border-2 border-clinical-blue/20">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-clinical-blue">
          <Wallet className="h-6 w-6" />
          Wallet Connection
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Connect your wallet to mint and manage your medical NFTs</p>
            
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
                          <Button 
                            variant="medical" 
                            className="w-full" 
                            size="lg"
                            onClick={openConnectModal}
                          >
                            <Wallet className="h-5 w-5 mr-2" />
                            Connect Wallet
                          </Button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <Button 
                            variant="destructive" 
                            className="w-full" 
                            size="lg"
                            onClick={openChainModal}
                          >
                            Wrong network
                          </Button>
                        );
                      }

                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-center gap-2">
                            <Badge variant="secondary" className="bg-clinical-green text-white">
                              <Check className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                          </div>
                          
                          <div className="bg-medical-accent p-3 rounded-lg border">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-muted-foreground">Wallet Address</p>
                                <p className="font-mono text-sm">{account.address.slice(0, 6)}...{account.address.slice(-4)}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={copyAddress}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={openExplorer}>
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="bg-background p-2 rounded border">
                              <p className="text-xs text-muted-foreground">Balance</p>
                              <p className="font-semibold">{balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}</p>
                            </div>
                            <div className="bg-background p-2 rounded border">
                              <p className="text-xs text-muted-foreground">Network</p>
                              <p className="font-semibold">{chain.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={openAccountModal}
                            >
                              Account
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => disconnect()}
                            >
                              Disconnect
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
            
            <p className="text-xs text-muted-foreground">
              Make sure you're on Sepolia Testnet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="bg-clinical-green text-white">
                <Check className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>
            
            <div className="bg-medical-accent p-3 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Wallet Address</p>
                  <p className="font-mono text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={copyAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={openExplorer}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-background p-2 rounded border">
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="font-semibold">{balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}</p>
              </div>
              <div className="bg-background p-2 rounded border">
                <p className="text-xs text-muted-foreground">Network</p>
                <p className="font-semibold">Sepolia</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => disconnect()}
            >
              Disconnect Wallet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
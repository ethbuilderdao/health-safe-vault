import { Shield, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const MedicalHeader = () => {
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
          
          <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MedicalHeader;
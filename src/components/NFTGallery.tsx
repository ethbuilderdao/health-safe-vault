import MedicalNFTCard from "./MedicalNFTCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockNFTs = [
  {
    id: "1",
    patientName: "John Doe",
    recordType: "Vaccination Records",
    dateCreated: "2024-01-15",
    isEncrypted: true,
    tokenId: "0x1a2b3c4d"
  },
  {
    id: "2", 
    patientName: "Jane Smith",
    recordType: "General Health",
    dateCreated: "2024-02-20",
    isEncrypted: true,
    tokenId: "0x5e6f7g8h"
  },
  {
    id: "3",
    patientName: "Mike Johnson", 
    recordType: "Lab Results",
    dateCreated: "2024-03-10",
    isEncrypted: true,
    tokenId: "0x9i0j1k2l"
  }
];

interface NFTGalleryProps {
  onCreateNewNFT: () => void;
}

const NFTGallery = ({ onCreateNewNFT }: NFTGalleryProps) => {
  return (
    <section className="py-12 bg-gradient-to-br from-secure-bg to-white">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-clinical-blue mb-2">Your Medical NFTs</h2>
            <p className="text-muted-foreground">Securely manage your encrypted health records</p>
          </div>
          
          <Button variant="medical" size="lg" onClick={onCreateNewNFT}>
            <Plus className="h-5 w-5 mr-2" />
            Create New NFT
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockNFTs.map((nft) => (
            <MedicalNFTCard key={nft.id} {...nft} />
          ))}
        </div>
        
        {mockNFTs.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-medical-accent p-8 rounded-lg border-2 border-dashed border-clinical-blue/30 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-clinical-blue mb-2">No NFTs Yet</h3>
              <p className="text-muted-foreground mb-4">Create your first encrypted health profile NFT</p>
              <Button variant="medical" onClick={onCreateNewNFT}>
                <Plus className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NFTGallery;
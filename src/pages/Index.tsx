import React from "react";
import MedicalHeader from "@/components/MedicalHeader";
import NFTGallery from "@/components/NFTGallery";
import HealthProfileForm from "@/components/HealthProfileForm";
import WalletConnect from "@/components/WalletConnect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = React.useState("gallery");

  return (
    <div className="min-h-screen bg-gradient-to-br from-secure-bg via-white to-medical-accent">
      <MedicalHeader />
      
      <main className="container mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="gallery">My NFTs</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery">
            <NFTGallery onCreateNewNFT={() => setActiveTab("create")} />
          </TabsContent>
          
          <TabsContent value="create">
            <div className="max-w-4xl mx-auto">
              <HealthProfileForm />
            </div>
          </TabsContent>
          
          <TabsContent value="wallet">
            <div className="flex justify-center">
              <WalletConnect />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

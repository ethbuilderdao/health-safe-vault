import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, FileText, Calendar, Hash } from "lucide-react";

interface MedicalNFTCardProps {
  id: string;
  patientName: string;
  recordType: string;
  dateCreated: string;
  isEncrypted: boolean;
  tokenId: string;
}

const MedicalNFTCard = ({ 
  id, 
  patientName, 
  recordType, 
  dateCreated, 
  isEncrypted, 
  tokenId 
}: MedicalNFTCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-clinical-blue/50 bg-gradient-to-br from-white to-medical-accent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-clinical-blue flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Medical Record NFT
          </CardTitle>
          {isEncrypted && (
            <Badge variant="secondary" className="bg-clinical-green text-white">
              <Lock className="h-3 w-3 mr-1" />
              Encrypted
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Patient:</span>
            <span className="font-medium">{patientName}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Record Type:</span>
            <span className="font-medium">{recordType}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Created:
            </span>
            <span className="font-medium">{dateCreated}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Hash className="h-3 w-3" />
              Token ID:
            </span>
            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
              {tokenId}
            </span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-border">
          <div className="flex gap-2">
            <div className="flex-1 text-center py-2 bg-clinical-green/10 rounded text-clinical-green text-sm font-medium">
              Verified
            </div>
            <div className="flex-1 text-center py-2 bg-medical-primary/10 rounded text-medical-primary text-sm font-medium">
              On-Chain
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalNFTCard;
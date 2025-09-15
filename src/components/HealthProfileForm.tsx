import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Shield, Sparkles, Loader2, CheckCircle, Lock, Unlock } from "lucide-react";
import { useAccount } from 'wagmi';
import { FHEEncryption, HealthData, HealthDataProcessor } from '@/lib/fhe-utils';
import { useContractInteraction, CreateHealthRecordParams, MintNFTParams } from '@/lib/contract-utils';

const healthProfileSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  recordType: z.string().min(1, "Please select a record type"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  bloodType: z.string().min(1, "Please select a blood type"),
  medicalHistory: z.string().min(10, "Medical history must be at least 10 characters"),
  emergencyContact: z.string().min(5, "Emergency contact information is required"),
  isEncrypted: z.boolean().default(true),
});

type HealthProfileFormData = z.infer<typeof healthProfileSchema>;

const HealthProfileForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState<'encrypt' | 'record' | 'mint' | 'complete'>('encrypt');
  const [recordId, setRecordId] = useState<number | null>(null);
  const [nftId, setNftId] = useState<number | null>(null);
  const [encryptedData, setEncryptedData] = useState<string>('');
  
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { createHealthRecord, mintMedicalNFT, isPending, isConfirming, isConfirmed, error } = useContractInteraction();

  const form = useForm<HealthProfileFormData>({
    resolver: zodResolver(healthProfileSchema),
    defaultValues: {
      patientName: "",
      recordType: "",
      dateOfBirth: "",
      bloodType: "",
      medicalHistory: "",
      emergencyContact: "",
      isEncrypted: true,
    },
  });

  const onSubmit = async (data: HealthProfileFormData) => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint health profile NFT.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setCurrentStep('encrypt');

    try {
      // Step 1: Validate and prepare health data
      const healthData: HealthData = {
        patientName: data.patientName,
        recordType: data.recordType,
        dateOfBirth: data.dateOfBirth,
        bloodType: data.bloodType,
        medicalHistory: data.medicalHistory,
        emergencyContact: data.emergencyContact,
        age: HealthDataProcessor.calculateAge(data.dateOfBirth),
        weight: 70, // Default values - in real app, these would be input fields
        height: 170,
        bloodPressure: 120,
        heartRate: 72,
        temperature: 36.5,
        healthScore: HealthDataProcessor.generateHealthScore({
          ...healthData,
          age: HealthDataProcessor.calculateAge(data.dateOfBirth)
        })
      };

      // Validate health data
      const validation = HealthDataProcessor.validateHealthData(healthData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Step 2: Encrypt health data using FHE
      setCurrentStep('encrypt');
      const fheEncryption = FHEEncryption.getInstance();
      const encryptedRecord = fheEncryption.prepareDataForFHE(healthData);
      setEncryptedData(encryptedRecord.encryptedData);

      // Step 3: Create health record on blockchain
      setCurrentStep('record');
      const recordParams: CreateHealthRecordParams = {
        age: healthData.age!,
        weight: healthData.weight!,
        height: healthData.height!,
        bloodPressure: healthData.bloodPressure!,
        heartRate: healthData.heartRate!,
        temperature: healthData.temperature!,
        healthScore: healthData.healthScore!,
        diagnosis: data.recordType,
        treatment: data.medicalHistory,
        medication: data.emergencyContact,
        patient: address
      };

      const recordResult = await createHealthRecord(recordParams);
      if (!recordResult.success) {
        throw new Error(recordResult.error || 'Failed to create health record');
      }

      setRecordId(recordResult.recordId!);

      // Step 4: Mint medical NFT
      setCurrentStep('mint');
      const mintParams: MintNFTParams = {
        recordId: recordResult.recordId!,
        mintPrice: "0.01", // 0.01 ETH mint price
        metadataHash: encryptedRecord.metadata.dataHash,
        encryptedData: encryptedRecord.encryptedData
      };

      const mintResult = await mintMedicalNFT(mintParams);
      if (!mintResult.success) {
        throw new Error(mintResult.error || 'Failed to mint NFT');
      }

      setNftId(mintResult.nftId!);
      setCurrentStep('complete');
      setIsSuccess(true);

      toast({
        title: "NFT Minted Successfully!",
        description: `Your encrypted health profile NFT (ID: ${mintResult.nftId}) has been created and added to your wallet.`,
      });

      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setCurrentStep('encrypt');
        setRecordId(null);
        setNftId(null);
        setEncryptedData('');
        form.reset();
      }, 5000);

    } catch (error) {
      console.error('Minting error:', error);
      toast({
        title: "Minting Failed",
        description: error instanceof Error ? error.message : "There was an error creating your health profile NFT. Please try again.",
        variant: "destructive",
      });
      setCurrentStep('encrypt');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto border-2 border-clinical-blue/20 shadow-lg">
      <CardHeader className="text-center bg-gradient-to-r from-medical-accent to-white">
        <CardTitle className="text-2xl font-bold text-clinical-blue flex items-center justify-center gap-2">
          <UserPlus className="h-6 w-6" />
          Create Health Profile NFT
        </CardTitle>
        <p className="text-muted-foreground">Mint your encrypted medical identity as an NFT</p>
      </CardHeader>
      
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter full name"
                        className="border-clinical-blue/30 focus:border-clinical-blue"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="recordType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Record Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-clinical-blue/30 focus:border-clinical-blue">
                          <SelectValue placeholder="Select record type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General Health</SelectItem>
                        <SelectItem value="vaccination">Vaccination Records</SelectItem>
                        <SelectItem value="lab-results">Lab Results</SelectItem>
                        <SelectItem value="prescription">Prescription History</SelectItem>
                        <SelectItem value="allergies">Allergies & Conditions</SelectItem>
                        <SelectItem value="emergency">Emergency Contact</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        className="border-clinical-blue/30 focus:border-clinical-blue"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-clinical-blue/30 focus:border-clinical-blue">
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="a+">A+</SelectItem>
                        <SelectItem value="a-">A-</SelectItem>
                        <SelectItem value="b+">B+</SelectItem>
                        <SelectItem value="b-">B-</SelectItem>
                        <SelectItem value="ab+">AB+</SelectItem>
                        <SelectItem value="ab-">AB-</SelectItem>
                        <SelectItem value="o+">O+</SelectItem>
                        <SelectItem value="o-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical History</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter relevant medical history, conditions, medications..."
                      className="min-h-32 border-clinical-blue/30 focus:border-clinical-blue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Emergency contact name and phone"
                      className="border-clinical-blue/30 focus:border-clinical-blue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-medical-accent p-4 rounded-lg border border-clinical-blue/20">
              <FormField
                control={form.control}
                name="isEncrypted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-clinical-green" />
                        Enable End-to-End Encryption
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Your health data will be encrypted before minting. Only you and authorized providers can access it.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-4">
              {/* Progress Steps */}
              {isSubmitting && (
                <div className="mb-4 p-4 bg-medical-accent rounded-lg border border-clinical-blue/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-clinical-blue">Minting Progress</span>
                    <span className="text-xs text-muted-foreground">
                      {currentStep === 'encrypt' && 'Step 1/4'}
                      {currentStep === 'record' && 'Step 2/4'}
                      {currentStep === 'mint' && 'Step 3/4'}
                      {currentStep === 'complete' && 'Step 4/4'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {currentStep === 'encrypt' && (
                      <>
                        <Lock className="h-4 w-4 text-clinical-green" />
                        <span>Encrypting health data with FHE...</span>
                      </>
                    )}
                    {currentStep === 'record' && (
                      <>
                        <Shield className="h-4 w-4 text-clinical-green" />
                        <span>Creating encrypted health record on blockchain...</span>
                      </>
                    )}
                    {currentStep === 'mint' && (
                      <>
                        <Sparkles className="h-4 w-4 text-clinical-green" />
                        <span>Minting medical NFT...</span>
                      </>
                    )}
                    {currentStep === 'complete' && (
                      <>
                        <CheckCircle className="h-4 w-4 text-clinical-green" />
                        <span>NFT minted successfully!</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Success State */}
              {isSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">NFT Minted Successfully!</span>
                  </div>
                  <div className="text-sm text-green-700 space-y-1">
                    {recordId && <p>Health Record ID: {recordId}</p>}
                    {nftId && <p>Medical NFT ID: {nftId}</p>}
                    <p>Your encrypted health data is now stored on the blockchain.</p>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                variant="mint" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting || !isConnected}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {currentStep === 'encrypt' && 'Encrypting Data...'}
                    {currentStep === 'record' && 'Creating Record...'}
                    {currentStep === 'mint' && 'Minting NFT...'}
                    {currentStep === 'complete' && 'Completing...'}
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    NFT Created Successfully!
                  </>
                ) : !isConnected ? (
                  <>
                    <Unlock className="h-5 w-5 mr-2" />
                    Connect Wallet to Mint
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Mint Health Profile NFT
                  </>
                )}
              </Button>
              
              <div className="text-xs text-center text-muted-foreground mt-2 space-y-1">
                <p>Network fee: ~0.01 ETH | Gas: Estimated</p>
                {isConnected && (
                  <p className="text-clinical-green">✓ Wallet connected to Sepolia</p>
                )}
                {!isConnected && (
                  <p className="text-orange-600">⚠ Please connect your wallet first</p>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default HealthProfileForm;
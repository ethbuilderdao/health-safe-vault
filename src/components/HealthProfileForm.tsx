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
import { UserPlus, Shield, Sparkles, Loader2, CheckCircle } from "lucide-react";

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
  const { toast } = useToast();

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
    setIsSubmitting(true);
    try {
      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIsSuccess(true);
      toast({
        title: "NFT Minted Successfully!",
        description: "Your health profile NFT has been created and added to your wallet.",
      });
      
      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        form.reset();
      }, 2000);
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "There was an error creating your health profile NFT. Please try again.",
        variant: "destructive",
      });
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
              <Button 
                type="submit" 
                variant="mint" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Minting NFT...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    NFT Created Successfully!
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Mint Health Profile NFT
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Network fee: ~0.01 ETH | Gas: Estimated
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default HealthProfileForm;
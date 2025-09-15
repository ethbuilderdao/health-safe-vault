// TypeScript types for HealthSafeVault contract
export interface HealthSafeVault {
  // Contract address
  address: string;
  
  // Contract ABI
  abi: readonly any[];
  
  // Contract methods
  createHealthRecord: (
    age: `0x${string}`,
    weight: `0x${string}`,
    height: `0x${string}`,
    bloodPressure: `0x${string}`,
    heartRate: `0x${string}`,
    temperature: `0x${string}`,
    healthScore: `0x${string}`,
    diagnosis: string,
    treatment: string,
    medication: string,
    patient: `0x${string}`,
    inputProof: `0x${string}`
  ) => Promise<bigint>;
  
  mintMedicalNFT: (
    recordId: bigint,
    mintPrice: `0x${string}`,
    metadataHash: string,
    inputProof: `0x${string}`
  ) => Promise<bigint>;
  
  getHealthRecordInfo: (recordId: bigint) => Promise<{
    age: number;
    weight: number;
    height: number;
    bloodPressure: number;
    heartRate: number;
    temperature: number;
    healthScore: number;
    isActive: boolean;
    isVerified: boolean;
    diagnosis: string;
    treatment: string;
    medication: string;
    patient: string;
    doctor: string;
    timestamp: bigint;
  }>;
  
  getMedicalNFTInfo: (nftId: bigint) => Promise<{
    healthRecordId: number;
    mintPrice: number;
    isMinted: boolean;
    isTransferable: boolean;
    metadataHash: string;
    owner: string;
    creator: string;
    mintTime: bigint;
  }>;
}

// Contract events
export interface HealthRecordCreatedEvent {
  recordId: bigint;
  patient: string;
  doctor: string;
}

export interface MedicalNFTMintedEvent {
  nftId: bigint;
  recordId: bigint;
  owner: string;
}

export interface DoctorRegisteredEvent {
  doctorId: bigint;
  doctor: string;
  specialization: string;
}

export interface RecordVerifiedEvent {
  recordId: bigint;
  isVerified: boolean;
}

export interface ReputationUpdatedEvent {
  user: string;
  reputation: number;
}

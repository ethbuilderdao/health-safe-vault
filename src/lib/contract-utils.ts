// Smart contract interaction utilities
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, encodeFunctionData } from 'viem';
import { HealthSafeVault } from '../contracts/HealthSafeVault';

// Contract ABI - This would be generated from the actual contract
const HEALTH_SAFE_VAULT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_targetAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_duration",
        "type": "uint256"
      }
    ],
    "name": "createCampaign",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "campaignId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "amount",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "makeDonation",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "age",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "weight",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "height",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "bloodPressure",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "heartRate",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "temperature",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "healthScore",
        "type": "bytes"
      },
      {
        "internalType": "string",
        "name": "diagnosis",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "treatment",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "medication",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "patient",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "createHealthRecord",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "recordId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "mintPrice",
        "type": "bytes"
      },
      {
        "internalType": "string",
        "name": "metadataHash",
        "type": "string"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "mintMedicalNFT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

// Contract address - This would be the deployed contract address
const HEALTH_SAFE_VAULT_ADDRESS = '0x742d35Cc6C4B23A2b4761329e3E8F13a4b2e4A2c' as const;

export interface MintNFTParams {
  recordId: number;
  mintPrice: string; // in ETH
  metadataHash: string;
  encryptedData: string;
}

export interface CreateHealthRecordParams {
  age: number;
  weight: number;
  height: number;
  bloodPressure: number;
  heartRate: number;
  temperature: number;
  healthScore: number;
  diagnosis: string;
  treatment: string;
  medication: string;
  patient: string;
}

export class ContractInteraction {
  private static instance: ContractInteraction;
  
  private constructor() {}
  
  public static getInstance(): ContractInteraction {
    if (!ContractInteraction.instance) {
      ContractInteraction.instance = new ContractInteraction();
    }
    return ContractInteraction.instance;
  }

  // Create health record on blockchain
  public async createHealthRecord(params: CreateHealthRecordParams): Promise<{
    success: boolean;
    recordId?: number;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      // In production, this would use actual FHE encryption
      // For now, we'll simulate the encrypted data
      const encryptedAge = this.encryptValue(params.age);
      const encryptedWeight = this.encryptValue(params.weight);
      const encryptedHeight = this.encryptValue(params.height);
      const encryptedBloodPressure = this.encryptValue(params.bloodPressure);
      const encryptedHeartRate = this.encryptValue(params.heartRate);
      const encryptedTemperature = this.encryptValue(params.temperature);
      const encryptedHealthScore = this.encryptValue(params.healthScore);
      
      // Create input proof (in production, this would be a real FHE proof)
      const inputProof = this.generateInputProof([
        params.age,
        params.weight,
        params.height,
        params.bloodPressure,
        params.heartRate,
        params.temperature,
        params.healthScore
      ]);

      // Prepare contract call data
      const callData = encodeFunctionData({
        abi: HEALTH_SAFE_VAULT_ABI,
        functionName: 'createHealthRecord',
        args: [
          encryptedAge,
          encryptedWeight,
          encryptedHeight,
          encryptedBloodPressure,
          encryptedHeartRate,
          encryptedTemperature,
          encryptedHealthScore,
          params.diagnosis,
          params.treatment,
          params.medication,
          params.patient as `0x${string}`,
          inputProof
        ]
      });

      // In a real implementation, this would use wagmi hooks
      // For now, we'll simulate the transaction
      const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      const mockRecordId = Math.floor(Math.random() * 1000000);

      return {
        success: true,
        recordId: mockRecordId,
        transactionHash: mockTransactionHash
      };
    } catch (error) {
      console.error('Error creating health record:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Mint medical NFT
  public async mintMedicalNFT(params: MintNFTParams): Promise<{
    success: boolean;
    nftId?: number;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      // Encrypt mint price
      const encryptedMintPrice = this.encryptValue(parseFloat(params.mintPrice));
      
      // Generate input proof
      const inputProof = this.generateInputProof([parseFloat(params.mintPrice)]);

      // Prepare contract call data
      const callData = encodeFunctionData({
        abi: HEALTH_SAFE_VAULT_ABI,
        functionName: 'mintMedicalNFT',
        args: [
          BigInt(params.recordId),
          encryptedMintPrice,
          params.metadataHash,
          inputProof
        ]
      });

      // In a real implementation, this would use wagmi hooks
      // For now, we'll simulate the transaction
      const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      const mockNFTId = Math.floor(Math.random() * 1000000);

      return {
        success: true,
        nftId: mockNFTId,
        transactionHash: mockTransactionHash
      };
    } catch (error) {
      console.error('Error minting NFT:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Encrypt a value (mock implementation)
  private encryptValue(value: number): `0x${string}` {
    // In production, this would use actual FHE encryption
    // For now, we'll create a mock encrypted value
    const buffer = Buffer.from(value.toString(), 'utf8');
    return `0x${buffer.toString('hex').padStart(64, '0')}` as `0x${string}`;
  }

  // Generate input proof (mock implementation)
  private generateInputProof(values: number[]): `0x${string}` {
    // In production, this would generate a real FHE proof
    // For now, we'll create a mock proof
    const proofData = values.join(',');
    const buffer = Buffer.from(proofData, 'utf8');
    return `0x${buffer.toString('hex').padStart(128, '0')}` as `0x${string}`;
  }

  // Get contract address
  public getContractAddress(): string {
    return HEALTH_SAFE_VAULT_ADDRESS;
  }

  // Get contract ABI
  public getContractABI() {
    return HEALTH_SAFE_VAULT_ABI;
  }
}

// Hook for contract interactions
export function useContractInteraction() {
  const { address } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const contractInteraction = ContractInteraction.getInstance();

  const createHealthRecord = async (params: CreateHealthRecordParams) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    return await contractInteraction.createHealthRecord({
      ...params,
      patient: address
    });
  };

  const mintMedicalNFT = async (params: MintNFTParams) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    return await contractInteraction.mintMedicalNFT(params);
  };

  return {
    createHealthRecord,
    mintMedicalNFT,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash
  };
}

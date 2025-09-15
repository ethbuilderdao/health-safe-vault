// FHE Encryption utilities for health data
import { createPublicKey, createPrivateKey, publicEncrypt, privateDecrypt } from 'crypto';

// Mock FHE implementation - in production, this would use Zama FHE library
export class FHEEncryption {
  private static instance: FHEEncryption;
  private publicKey: string;
  private privateKey: string;

  private constructor() {
    // Generate key pair for FHE encryption
    const { publicKey, privateKey } = this.generateKeyPair();
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  public static getInstance(): FHEEncryption {
    if (!FHEEncryption.instance) {
      FHEEncryption.instance = new FHEEncryption();
    }
    return FHEEncryption.instance;
  }

  private generateKeyPair(): { publicKey: string; privateKey: string } {
    // In production, this would use proper FHE key generation
    // For now, we'll use RSA as a placeholder
    const { publicKey, privateKey } = require('crypto').generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
    
    return { publicKey, privateKey };
  }

  // Encrypt health data using FHE
  public encryptHealthData(data: any): string {
    try {
      const jsonData = JSON.stringify(data);
      const buffer = Buffer.from(jsonData, 'utf8');
      
      // In production, this would use FHE encryption
      // For now, we'll use RSA encryption as a placeholder
      const encrypted = publicEncrypt(this.publicKey, buffer);
      return encrypted.toString('base64');
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt health data');
    }
  }

  // Decrypt health data using FHE
  public decryptHealthData(encryptedData: string): any {
    try {
      const buffer = Buffer.from(encryptedData, 'base64');
      
      // In production, this would use FHE decryption
      // For now, we'll use RSA decryption as a placeholder
      const decrypted = privateDecrypt(this.privateKey, buffer);
      return JSON.parse(decrypted.toString('utf8'));
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt health data');
    }
  }

  // Convert data to FHE-compatible format
  public prepareDataForFHE(data: any): {
    encryptedData: string;
    metadata: {
      timestamp: number;
      dataHash: string;
      encryptionType: string;
    };
  } {
    const encryptedData = this.encryptHealthData(data);
    const dataHash = this.generateHash(JSON.stringify(data));
    
    return {
      encryptedData,
      metadata: {
        timestamp: Date.now(),
        dataHash,
        encryptionType: 'FHE-RSA-2048'
      }
    };
  }

  private generateHash(data: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Validate encrypted data integrity
  public validateDataIntegrity(encryptedData: string, expectedHash: string): boolean {
    try {
      const decryptedData = this.decryptHealthData(encryptedData);
      const actualHash = this.generateHash(JSON.stringify(decryptedData));
      return actualHash === expectedHash;
    } catch (error) {
      return false;
    }
  }
}

// Health data types for FHE encryption
export interface HealthData {
  patientName: string;
  recordType: string;
  dateOfBirth: string;
  bloodType: string;
  medicalHistory: string;
  emergencyContact: string;
  age?: number;
  weight?: number;
  height?: number;
  bloodPressure?: number;
  heartRate?: number;
  temperature?: number;
  healthScore?: number;
}

export interface EncryptedHealthRecord {
  encryptedData: string;
  metadata: {
    timestamp: number;
    dataHash: string;
    encryptionType: string;
  };
  recordId?: string;
  nftId?: string;
}

// Utility functions for health data processing
export class HealthDataProcessor {
  // Calculate age from date of birth
  public static calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Generate health score based on various factors
  public static generateHealthScore(data: HealthData): number {
    let score = 100; // Start with perfect score
    
    // Deduct points based on medical history complexity
    if (data.medicalHistory.length > 500) {
      score -= 10; // Complex medical history
    }
    
    // Age factor
    const age = this.calculateAge(data.dateOfBirth);
    if (age > 65) {
      score -= 15;
    } else if (age > 50) {
      score -= 10;
    } else if (age > 30) {
      score -= 5;
    }
    
    // Blood type factor (some blood types are rarer)
    const rareBloodTypes = ['ab-', 'b-'];
    if (rareBloodTypes.includes(data.bloodType.toLowerCase())) {
      score += 5; // Bonus for rare blood type
    }
    
    return Math.max(0, Math.min(100, score));
  }

  // Validate health data
  public static validateHealthData(data: HealthData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.patientName || data.patientName.length < 2) {
      errors.push('Patient name must be at least 2 characters');
    }
    
    if (!data.dateOfBirth) {
      errors.push('Date of birth is required');
    } else {
      const age = this.calculateAge(data.dateOfBirth);
      if (age < 0 || age > 150) {
        errors.push('Invalid date of birth');
      }
    }
    
    if (!data.bloodType) {
      errors.push('Blood type is required');
    }
    
    if (!data.medicalHistory || data.medicalHistory.length < 10) {
      errors.push('Medical history must be at least 10 characters');
    }
    
    if (!data.emergencyContact || data.emergencyContact.length < 5) {
      errors.push('Emergency contact information is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

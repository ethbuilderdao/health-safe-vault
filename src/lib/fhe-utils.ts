// FHE Encryption utilities for health data
// Browser-compatible encryption implementation

// Mock FHE implementation - in production, this would use Zama FHE library
export class FHEEncryption {
  private static instance: FHEEncryption;
  private encryptionKey: string;

  private constructor() {
    // Generate encryption key for FHE encryption
    this.encryptionKey = this.generateEncryptionKey();
  }

  public static getInstance(): FHEEncryption {
    if (!FHEEncryption.instance) {
      FHEEncryption.instance = new FHEEncryption();
    }
    return FHEEncryption.instance;
  }

  private generateEncryptionKey(): string {
    // Generate a random encryption key
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Encrypt health data using browser-compatible encryption
  public async encryptHealthData(data: any): Promise<string> {
    try {
      const jsonData = JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(jsonData);
      
      // Use Web Crypto API for encryption
      const key = await this.importKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        dataBuffer
      );
      
      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedBuffer), iv.length);
      
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt health data');
    }
  }

  // Decrypt health data using browser-compatible decryption
  public async decryptHealthData(encryptedData: string): Promise<any> {
    try {
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);
      
      const key = await this.importKey();
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encrypted
      );
      
      const decoder = new TextDecoder();
      const decryptedData = decoder.decode(decryptedBuffer);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt health data');
    }
  }

  private async importKey(): Promise<CryptoKey> {
    const keyBuffer = new Uint8Array(this.encryptionKey.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    return await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Convert data to FHE-compatible format
  public async prepareDataForFHE(data: any): Promise<{
    encryptedData: string;
    metadata: {
      timestamp: number;
      dataHash: string;
      encryptionType: string;
    };
  }> {
    const encryptedData = await this.encryptHealthData(data);
    const dataHash = await this.generateHash(JSON.stringify(data));
    
    return {
      encryptedData,
      metadata: {
        timestamp: Date.now(),
        dataHash,
        encryptionType: 'FHE-AES-GCM-256'
      }
    };
  }

  private async generateHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Validate encrypted data integrity
  public async validateDataIntegrity(encryptedData: string, expectedHash: string): Promise<boolean> {
    try {
      const decryptedData = await this.decryptHealthData(encryptedData);
      const actualHash = await this.generateHash(JSON.stringify(decryptedData));
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

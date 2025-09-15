// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract HealthSafeVault is SepoliaConfig {
    using FHE for *;
    
    struct HealthRecord {
        euint32 recordId;
        euint32 age;
        euint32 weight;
        euint32 height;
        euint32 bloodPressure;
        euint32 heartRate;
        euint32 temperature;
        euint8 healthScore;
        bool isActive;
        bool isVerified;
        string diagnosis;
        string treatment;
        string medication;
        address patient;
        address doctor;
        uint256 timestamp;
    }
    
    struct MedicalNFT {
        euint32 nftId;
        euint32 healthRecordId;
        euint32 mintPrice;
        bool isMinted;
        bool isTransferable;
        string metadataHash;
        address owner;
        address creator;
        uint256 mintTime;
    }
    
    struct DoctorProfile {
        euint32 doctorId;
        euint32 experience;
        euint32 rating;
        euint32 patientCount;
        bool isVerified;
        bool isActive;
        string name;
        string specialization;
        string license;
        address doctorAddress;
    }
    
    mapping(uint256 => HealthRecord) public healthRecords;
    mapping(uint256 => MedicalNFT) public medicalNFTs;
    mapping(address => DoctorProfile) public doctors;
    mapping(address => euint32[]) public patientRecords;
    mapping(address => euint32[]) public doctorRecords;
    mapping(address => euint32) public patientReputation;
    mapping(address => euint32) public doctorReputation;
    
    uint256 public recordCounter;
    uint256 public nftCounter;
    uint256 public doctorCounter;
    
    address public owner;
    address public verifier;
    
    event HealthRecordCreated(uint256 indexed recordId, address indexed patient, address indexed doctor);
    event MedicalNFTMinted(uint256 indexed nftId, uint256 indexed recordId, address indexed owner);
    event DoctorRegistered(uint256 indexed doctorId, address indexed doctor, string specialization);
    event RecordVerified(uint256 indexed recordId, bool isVerified);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function createHealthRecord(
        externalEuint32 age,
        externalEuint32 weight,
        externalEuint32 height,
        externalEuint32 bloodPressure,
        externalEuint32 heartRate,
        externalEuint32 temperature,
        externalEuint8 healthScore,
        string memory diagnosis,
        string memory treatment,
        string memory medication,
        address patient,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(patient != address(0), "Invalid patient address");
        require(bytes(diagnosis).length > 0, "Diagnosis cannot be empty");
        
        uint256 recordId = recordCounter++;
        
        // Convert external encrypted values to internal encrypted values
        euint32 internalAge = FHE.fromExternal(age, inputProof);
        euint32 internalWeight = FHE.fromExternal(weight, inputProof);
        euint32 internalHeight = FHE.fromExternal(height, inputProof);
        euint32 internalBloodPressure = FHE.fromExternal(bloodPressure, inputProof);
        euint32 internalHeartRate = FHE.fromExternal(heartRate, inputProof);
        euint32 internalTemperature = FHE.fromExternal(temperature, inputProof);
        euint8 internalHealthScore = FHE.fromExternal(healthScore, inputProof);
        
        healthRecords[recordId] = HealthRecord({
            recordId: FHE.asEuint32(0), // Will be set properly later
            age: internalAge,
            weight: internalWeight,
            height: internalHeight,
            bloodPressure: internalBloodPressure,
            heartRate: internalHeartRate,
            temperature: internalTemperature,
            healthScore: internalHealthScore,
            isActive: true,
            isVerified: false,
            diagnosis: diagnosis,
            treatment: treatment,
            medication: medication,
            patient: patient,
            doctor: msg.sender,
            timestamp: block.timestamp
        });
        
        // Add record to patient and doctor mappings
        patientRecords[patient].push(FHE.asEuint32(recordId));
        doctorRecords[msg.sender].push(FHE.asEuint32(recordId));
        
        emit HealthRecordCreated(recordId, patient, msg.sender);
        return recordId;
    }
    
    function mintMedicalNFT(
        uint256 recordId,
        externalEuint32 mintPrice,
        string memory metadataHash,
        bytes calldata inputProof
    ) public payable returns (uint256) {
        require(healthRecords[recordId].patient != address(0), "Health record does not exist");
        require(healthRecords[recordId].isActive, "Health record is not active");
        require(healthRecords[recordId].isVerified, "Health record must be verified");
        require(healthRecords[recordId].patient == msg.sender, "Only patient can mint NFT");
        
        uint256 nftId = nftCounter++;
        
        // Convert external encrypted price to internal encrypted value
        euint32 internalMintPrice = FHE.fromExternal(mintPrice, inputProof);
        
        medicalNFTs[nftId] = MedicalNFT({
            nftId: FHE.asEuint32(0), // Will be set properly later
            healthRecordId: FHE.asEuint32(recordId),
            mintPrice: internalMintPrice,
            isMinted: true,
            isTransferable: true,
            metadataHash: metadataHash,
            owner: msg.sender,
            creator: msg.sender,
            mintTime: block.timestamp
        });
        
        emit MedicalNFTMinted(nftId, recordId, msg.sender);
        return nftId;
    }
    
    function registerDoctor(
        string memory name,
        string memory specialization,
        string memory license,
        externalEuint32 experience,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(name).length > 0, "Doctor name cannot be empty");
        require(bytes(specialization).length > 0, "Specialization cannot be empty");
        require(bytes(license).length > 0, "License cannot be empty");
        require(doctors[msg.sender].doctorAddress == address(0), "Doctor already registered");
        
        uint256 doctorId = doctorCounter++;
        
        // Convert external encrypted experience to internal encrypted value
        euint32 internalExperience = FHE.fromExternal(experience, inputProof);
        
        doctors[msg.sender] = DoctorProfile({
            doctorId: FHE.asEuint32(doctorId),
            experience: internalExperience,
            rating: FHE.asEuint32(0),
            patientCount: FHE.asEuint32(0),
            isVerified: false,
            isActive: true,
            name: name,
            specialization: specialization,
            license: license,
            doctorAddress: msg.sender
        });
        
        emit DoctorRegistered(doctorId, msg.sender, specialization);
        return doctorId;
    }
    
    function verifyHealthRecord(uint256 recordId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify records");
        require(healthRecords[recordId].patient != address(0), "Health record does not exist");
        
        healthRecords[recordId].isVerified = isVerified;
        emit RecordVerified(recordId, isVerified);
    }
    
    function updateReputation(address user, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        // Determine if user is patient or doctor based on context
        if (healthRecords[recordCounter - 1].patient == user) {
            patientReputation[user] = reputation;
        } else {
            doctorReputation[user] = reputation;
        }
        
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function getHealthRecordInfo(uint256 recordId) public view returns (
        uint8 age,
        uint8 weight,
        uint8 height,
        uint8 bloodPressure,
        uint8 heartRate,
        uint8 temperature,
        uint8 healthScore,
        bool isActive,
        bool isVerified,
        string memory diagnosis,
        string memory treatment,
        string memory medication,
        address patient,
        address doctor,
        uint256 timestamp
    ) {
        HealthRecord storage record = healthRecords[recordId];
        return (
            0, // FHE.decrypt(record.age) - will be decrypted off-chain
            0, // FHE.decrypt(record.weight) - will be decrypted off-chain
            0, // FHE.decrypt(record.height) - will be decrypted off-chain
            0, // FHE.decrypt(record.bloodPressure) - will be decrypted off-chain
            0, // FHE.decrypt(record.heartRate) - will be decrypted off-chain
            0, // FHE.decrypt(record.temperature) - will be decrypted off-chain
            0, // FHE.decrypt(record.healthScore) - will be decrypted off-chain
            record.isActive,
            record.isVerified,
            record.diagnosis,
            record.treatment,
            record.medication,
            record.patient,
            record.doctor,
            record.timestamp
        );
    }
    
    function getMedicalNFTInfo(uint256 nftId) public view returns (
        uint8 healthRecordId,
        uint8 mintPrice,
        bool isMinted,
        bool isTransferable,
        string memory metadataHash,
        address owner,
        address creator,
        uint256 mintTime
    ) {
        MedicalNFT storage nft = medicalNFTs[nftId];
        return (
            0, // FHE.decrypt(nft.healthRecordId) - will be decrypted off-chain
            0, // FHE.decrypt(nft.mintPrice) - will be decrypted off-chain
            nft.isMinted,
            nft.isTransferable,
            nft.metadataHash,
            nft.owner,
            nft.creator,
            nft.mintTime
        );
    }
    
    function getDoctorInfo(address doctorAddress) public view returns (
        uint8 experience,
        uint8 rating,
        uint8 patientCount,
        bool isVerified,
        bool isActive,
        string memory name,
        string memory specialization,
        string memory license
    ) {
        DoctorProfile storage doctor = doctors[doctorAddress];
        return (
            0, // FHE.decrypt(doctor.experience) - will be decrypted off-chain
            0, // FHE.decrypt(doctor.rating) - will be decrypted off-chain
            0, // FHE.decrypt(doctor.patientCount) - will be decrypted off-chain
            doctor.isVerified,
            doctor.isActive,
            doctor.name,
            doctor.specialization,
            doctor.license
        );
    }
    
    function getPatientReputation(address patient) public view returns (uint8) {
        return 0; // FHE.decrypt(patientReputation[patient]) - will be decrypted off-chain
    }
    
    function getDoctorReputation(address doctor) public view returns (uint8) {
        return 0; // FHE.decrypt(doctorReputation[doctor]) - will be decrypted off-chain
    }
    
    function transferNFT(uint256 nftId, address to) public {
        require(medicalNFTs[nftId].owner == msg.sender, "Only owner can transfer");
        require(medicalNFTs[nftId].isTransferable, "NFT is not transferable");
        require(to != address(0), "Invalid recipient address");
        
        medicalNFTs[nftId].owner = to;
    }
    
    function revokeHealthRecord(uint256 recordId) public {
        require(healthRecords[recordId].patient == msg.sender, "Only patient can revoke");
        require(healthRecords[recordId].isActive, "Record is already inactive");
        
        healthRecords[recordId].isActive = false;
    }
}

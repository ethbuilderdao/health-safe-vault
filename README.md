# Health Safe Vault

A secure, privacy-preserving health record management system built with FHE (Fully Homomorphic Encryption) technology. This platform allows patients to create, store, and manage their medical records as NFTs while maintaining complete privacy through encrypted data storage.

## Features

- **FHE-Encrypted Health Records**: All sensitive medical data is encrypted using Fully Homomorphic Encryption
- **Medical NFT Minting**: Convert verified health records into transferable NFTs
- **Doctor Verification System**: Secure doctor registration and verification process
- **Privacy-Preserving Analytics**: Perform computations on encrypted data without decryption
- **Wallet Integration**: Seamless connection with popular Web3 wallets via RainbowKit
- **Reputation System**: Track patient and doctor reputation scores

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Wallet Integration**: RainbowKit, Wagmi, Viem
- **Smart Contracts**: Solidity with FHE support
- **Encryption**: Zama FHE Library

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ethbuilderdao/health-safe-vault.git
cd health-safe-vault
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Wallet Connect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID

# Infura Configuration
NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_API_KEY
```

## Smart Contract

The project includes a comprehensive FHE-enabled smart contract (`HealthSafeVault.sol`) that provides:

- Encrypted health record storage
- Medical NFT minting functionality
- Doctor registration and verification
- Reputation management
- Privacy-preserving data operations

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
# Deploy the dist folder to your preferred hosting service
```

## Security Features

- **FHE Encryption**: All sensitive data is encrypted using Fully Homomorphic Encryption
- **Zero-Knowledge Proofs**: Verify data integrity without revealing content
- **Access Control**: Role-based permissions for different user types
- **Audit Trail**: Complete transaction history for all operations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

## Roadmap

- [ ] Multi-chain support
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Integration with healthcare providers
- [ ] AI-powered health insights

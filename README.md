# 🏥 Health Safe Vault

> **Revolutionary Privacy-Preserving Medical Records Platform**

Transform your healthcare data into secure, encrypted NFTs while maintaining complete privacy through cutting-edge Fully Homomorphic Encryption (FHE) technology.

## 🚀 What Makes Us Different?

### 🔐 **Zero-Knowledge Medical Records**
- Your health data stays encrypted even during processing
- No one can see your medical information - not even the platform
- Complete privacy while maintaining full functionality

### 🎯 **NFT-Powered Health Management**
- Convert verified medical records into unique NFTs
- Own and control your health data completely
- Transfer medical records securely between providers

### 🏆 **Trust & Verification System**
- Verified doctor network with reputation scoring
- Patient trust metrics and health history tracking
- Transparent, blockchain-based verification

## 🛠️ Built With Modern Web3 Technology

| Category | Technology |
|----------|------------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Blockchain** | Ethereum Sepolia Testnet |
| **Wallets** | RainbowKit + Wagmi + Viem |
| **Encryption** | Zama FHE Library |
| **Smart Contracts** | Solidity with FHE Support |

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **Git**

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/ethbuilderdao/health-safe-vault.git
cd health-safe-vault

# 2. Install dependencies
npm install

# 3. Configure environment
cp env.example .env
# Edit .env with your settings

# 4. Start development server
npm run dev
```

### 🔧 Environment Configuration

Create your `.env` file with these essential variables:

```env
# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY

# Wallet Integration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_PROJECT_ID

# API Keys
NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_KEY
```

## 📋 Smart Contract Features

Our `HealthSafeVault.sol` contract provides:

- ✅ **Encrypted Health Record Storage**
- ✅ **Medical NFT Minting & Management**
- ✅ **Doctor Registration & Verification**
- ✅ **Reputation & Trust Scoring**
- ✅ **Privacy-Preserving Data Operations**

## 🌐 Deployment Options

### Vercel (Recommended)
```bash
# Automatic deployment via GitHub integration
# See VERCEL_DEPLOYMENT.md for detailed steps
```

### Manual Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

## 🔒 Security & Privacy

- **🔐 FHE Encryption**: Data encrypted at all times
- **🛡️ Zero-Knowledge Proofs**: Verify without revealing
- **👥 Role-Based Access**: Granular permission control
- **📊 Complete Audit Trail**: Full transaction history

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to your branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Community

- **Issues**: [GitHub Issues](https://github.com/ethbuilderdao/health-safe-vault/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ethbuilderdao/health-safe-vault/discussions)
- **Documentation**: [Project Wiki](https://github.com/ethbuilderdao/health-safe-vault/wiki)

## 🗺️ Future Roadmap

- [ ] **Multi-Chain Support** - Expand to other blockchains
- [ ] **Advanced Analytics** - AI-powered health insights
- [ ] **Mobile App** - iOS and Android applications
- [ ] **Provider Integration** - Connect with healthcare systems
- [ ] **Telemedicine** - Built-in consultation features

---

<div align="center">

**Built with ❤️ for a healthier, more private future**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ethbuilderdao/health-safe-vault)

</div>

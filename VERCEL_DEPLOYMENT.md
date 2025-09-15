# Vercel Deployment Guide for Health Safe Vault

This guide provides step-by-step instructions for deploying the Health Safe Vault application to Vercel.

## Prerequisites

- GitHub account with access to the repository
- Vercel account (free tier available)
- Environment variables configured

## Step-by-Step Deployment

### Step 1: Access Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click on "New Project" or "Add New..." → "Project"

### Step 2: Import GitHub Repository

1. In the "Import Git Repository" section, search for `ethbuilderdao/health-safe-vault`
2. Click on the repository when it appears
3. Click "Import" to proceed

### Step 3: Configure Project Settings

1. **Project Name**: `health-safe-vault` (or your preferred name)
2. **Framework Preset**: Select "Vite" from the dropdown
3. **Root Directory**: Leave as default (`.`)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### Step 4: Environment Variables Configuration

Click on "Environment Variables" and add the following variables:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
```

**Important**: Make sure to add these variables for all environments (Production, Preview, Development).

### Step 5: Advanced Configuration (Optional)

If you need to customize the build process, you can add a `vercel.json` file to the root of your project:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 6: Deploy

1. Click "Deploy" to start the deployment process
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, you'll receive a URL like `https://health-safe-vault-xxx.vercel.app`

### Step 7: Custom Domain (Optional)

1. In your Vercel dashboard, go to your project
2. Click on "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions
5. Wait for DNS propagation (up to 24 hours)

## Post-Deployment Configuration

### Step 8: Verify Deployment

1. Visit your deployed URL
2. Test wallet connection functionality
3. Verify that the application loads correctly
4. Check that all environment variables are working

### Step 9: Monitor and Maintain

1. Set up monitoring in Vercel dashboard
2. Configure automatic deployments from main branch
3. Set up error tracking if needed

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Verify build command is correct
   - Check for TypeScript errors

2. **Environment Variables Not Working**:
   - Ensure variables are added to all environments
   - Check variable names match exactly
   - Redeploy after adding new variables

3. **Wallet Connection Issues**:
   - Verify WalletConnect Project ID is correct
   - Check RPC URL is accessible
   - Ensure network configuration is correct

### Build Logs

To view build logs:
1. Go to your project in Vercel dashboard
2. Click on "Deployments" tab
3. Click on the specific deployment
4. View "Build Logs" for detailed information

## Environment-Specific Configurations

### Production Environment
- Use production RPC URLs
- Set up proper error tracking
- Configure analytics
- Set up monitoring

### Preview Environment
- Use testnet configurations
- Enable debug logging
- Test new features

### Development Environment
- Use local development settings
- Enable hot reloading
- Debug mode enabled

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to the repository
2. **HTTPS**: Vercel automatically provides HTTPS
3. **CORS**: Configure CORS settings if needed
4. **Rate Limiting**: Consider implementing rate limiting for API calls

## Performance Optimization

1. **Image Optimization**: Use Vercel's built-in image optimization
2. **Caching**: Configure appropriate cache headers
3. **CDN**: Vercel automatically provides global CDN
4. **Bundle Analysis**: Use build analysis tools to optimize bundle size

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [GitHub Integration](https://vercel.com/docs/concepts/git/vercel-for-github)

## Deployment Checklist

- [ ] Repository imported successfully
- [ ] Environment variables configured
- [ ] Build settings configured
- [ ] Deployment successful
- [ ] Application accessible via URL
- [ ] Wallet connection working
- [ ] All features functional
- [ ] Custom domain configured (if applicable)
- [ ] Monitoring set up
- [ ] Documentation updated

## Next Steps

After successful deployment:

1. Share the application URL with stakeholders
2. Set up continuous deployment
3. Monitor application performance
4. Plan for scaling if needed
5. Consider implementing additional features

---

**Note**: This deployment guide assumes you have the necessary permissions and access to the GitHub repository and Vercel account. Make sure to follow your organization's deployment policies and procedures.

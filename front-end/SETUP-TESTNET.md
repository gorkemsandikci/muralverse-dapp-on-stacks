# Testnet Setup Guide for Muralverse DApp

## 🚀 Quick Fix for Campaign Data Issues

### 1. Environment Configuration

Create a `.env.local` file in the `front-end/` directory with the following content:

```bash
# Stacks Network Configuration
NEXT_PUBLIC_STACKS_NETWORK=testnet

# Hiro Platform API Key (for devnet)
NEXT_PUBLIC_PLATFORM_HIRO_API_KEY=your-hiro-platform-api-key-here

# Contract Deployer Addresses
NEXT_PUBLIC_CONTRACT_DEPLOYER_TESTNET_ADDRESS=STC9JV90Q6FVYTBWSH4NEKM1AEZDV0TGXE81HMAV
NEXT_PUBLIC_CONTRACT_DEPLOYER_MAINNET_ADDRESS=STC9JV90Q6FVYTBWSH4NEKM1AEZDV0TGXE81HMAV

# Devnet Configuration
NEXT_PUBLIC_DEVNET_HOST=platform
```

### 2. Deploy Smart Contract to Testnet

#### Step 1: Get Test STX
1. Visit [Stacks Testnet Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
2. Request test STX (you'll need about 5-10 STX for deployment)
3. **IMPORTANT**: Use your wallet address: `STC9JV90Q6FVYTBWSH4NEKM1AEZDV0TGXE81HMAV`

#### Step 2: Deploy Contract
1. Use Clarinet to deploy `fundraising.clar` with your wallet
2. The contract will be deployed to: `STC9JV90Q6FVYTBWSH4NEKM1AEZDV0TGXE81HMAV.fundraising`
3. Update `NEXT_PUBLIC_CONTRACT_DEPLOYER_TESTNET_ADDRESS` in `.env.local`

#### Step 3: Initialize Campaign
After deployment, call the `initialize-campaign` function with:
- `goal`: Funding goal in USD (e.g., 10000 for $10,000)
- `duration`: Campaign duration in blocks (0 for default ~30 days)

### 3. Verify Configuration

Check that these files are properly configured:

- ✅ `.env.local` with testnet network setting
- ✅ Contract deployed to your wallet address: `ST3PPQB6NKX2TM4BK0CY8DXKJ1BKTC81MH202GSBA`
- ✅ Campaign initialized on testnet
- ✅ Testnet STX available for transactions

### 4. Common Issues & Solutions

#### Issue: "Campaign Data Unavailable"
**Cause**: Contract not deployed or wrong address
**Solution**: 
1. Verify contract deployment to your wallet address
2. Check `NEXT_PUBLIC_CONTRACT_DEPLOYER_TESTNET_ADDRESS`
3. Ensure campaign is initialized

#### Issue: "Hydration Error"
**Cause**: Theme rendering mismatch
**Solution**: ✅ Fixed in code - removed duplicate ColorModeScript

#### Issue: "Network Error"
**Cause**: Wrong API endpoint
**Solution**: 
1. Set `NEXT_PUBLIC_STACKS_NETWORK=testnet`
2. App will automatically use `https://api.testnet.hiro.so`

### 5. Testing Checklist

- [ ] Environment variables set correctly
- [ ] Contract deployed to your wallet: `ST3PPQB6NKX2TM4BK0CY8DXKJ1BKTC81MH202GSBA`
- [ ] Campaign initialized with goal and duration
- [ ] Frontend connects to testnet
- [ ] Campaign data loads without errors
- [ ] Donation functionality works
- [ ] Wallet connection successful

### 6. Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### 7. Network Configuration

The app automatically detects the network based on `NEXT_PUBLIC_STACKS_NETWORK`:

- `devnet` → Hiro Platform devnet
- `testnet` → Stacks testnet (https://api.testnet.hiro.so)
- `mainnet` → Stacks mainnet (https://api.mainnet.hiro.so)

### 8. Troubleshooting

#### Check Browser Console
Look for these error messages:
- "Contract address not configured"
- "Error fetching campaign info from blockchain"
- Network connection errors

#### Verify Contract State
Use [Hiro Explorer](https://explorer.hiro.so) to check:
- Contract deployment status at: `STC9JV90Q6FVYTBWSH4NEKM1AEZDV0TGXE81HMAV.fundraising`
- Function calls and responses
- Contract state variables

#### Test API Endpoints
Verify the API is accessible:
```bash
curl https://api.testnet.hiro.so/v2/info
```

### 9. Next Steps

After successful testnet deployment:
1. Test all functionality thoroughly
2. Get community feedback
3. Prepare for mainnet launch
4. Ensure sufficient STX for mainnet deployment

## 🎯 Success Indicators

- ✅ Campaign page loads without errors
- ✅ Campaign data displays correctly
- ✅ Donation modal opens and functions
- ✅ Wallet connection works
- ✅ No hydration errors in console
- ✅ All blockchain interactions successful

## 📞 Support

If you continue to experience issues:
1. Check browser console for detailed error messages
2. Verify all environment variables are set
3. Confirm contract deployment status to your wallet address
4. Test with a fresh browser session

## 🔑 **Your Contract Information**

- **Wallet Address**: `STC9JV90Q6FVYTBWSH4NEKM1AEZDV0TGXE81HMAV`
- **Contract ID**: `STC9JV90Q6FVYTBWSH4NEKM1AEZDV0TGXE81HMAV.fundraising`
- **Network**: Testnet
- **Deployment Status**: Pending (after you deploy)

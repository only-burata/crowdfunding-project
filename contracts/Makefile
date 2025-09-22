# Makefile for the smart contracts for Crowdfunding dApp

# Load environment variables from .env
include .env
export

# Deploy script
DEPLOY_SCRIPT := script/DeployManager.s.sol

.PHONY: all deploy-anvil deploy-sepolia

all: deploy-anvil

# Deploy to local Anvil
deploy-anvil:
	@echo "🚀 Deploying contracts to Anvil..."
	forge script $(DEPLOY_SCRIPT) \
		--rpc-url $(ANVIL_URL) \
		--private-key $(ANVIL_PRIVATE_KEY) \
		--broadcast \
		--verify false \
		-vvvv
	@echo "✅ Deployment to Anvil complete!"

# Deploy to Sepolia + verify on Etherscan
deploy-sepolia:
	@echo "🚀 Deploying contracts to Sepolia..."
	forge script $(DEPLOY_SCRIPT) \
		--rpc-url $(SEPOLIA_URL) \
		--account sepoliaPrivateKey \
		--verify ${ETHERSCAN_API_KEY} \
		--broadcast \
		-vvvv
	@echo "✅ Deployment & verification on Sepolia complete!"

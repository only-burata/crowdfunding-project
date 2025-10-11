# Makefile for the smart contracts for Crowdfunding dApp

# Load environment variables from .env
include .env
export

# Deploy script
DEPLOY_SCRIPT := script/DeployManager.s.sol
ABI_FOLDER := ../frontend/ABIs

.PHONY: all deploy-anvil deploy-sepolia

all: deploy-anvil

# Deploy to local Anvil
deploy-anvil:
	@echo "🚀 Deploying contracts to Anvil..."
	forge script $(DEPLOY_SCRIPT) \
		--rpc-url http://127.0.0.1:8545 \
		--private-key $(ANVIL_PRIVATE_KEY) \
		--broadcast \
		-vvvv
	@echo "✅ Deployment to Anvil complete!"
	@echo "🚀extracting ABIs"
	forge inspect Campaign abi --json > $(ABI_FOLDER)/Campaign_abi.json
	forge inspect CampaignManager abi --json > $(ABI_FOLDER)/CampaignManager_abi.json
	@echo "✅ ABIs extracted"

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
	@echo "🚀extracting ABIs"
	forge inspect Campaign abi --json > $(ABI_FOLDER)/Campaign_abi.json
	forge inspect CampaignManager abi --json > $(ABI_FOLDER)/CampaignManager_abi.json
	@echo "✅ ABIs extracted"

compile:
	@echo "🚀Compiling contracts"
	forge build
	@echo "🚀extracting ABIs"
	forge inspect Campaign abi --json > $(ABI_FOLDER)/Campaign_abi.json
	forge inspect CampaignManager abi --json > $(ABI_FOLDER)/CampaignManager_abi.json
	@echo "✅ ABIs extracted"

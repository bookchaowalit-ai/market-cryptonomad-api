import { ethers, upgrades } from "hardhat";
import { NomadCoin } from "../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Contract parameters
  const TOKEN_NAME = "Nomad Coin";
  const TOKEN_SYMBOL = "NOMAD";
  const ADMIN_ADDRESS = deployer.address;
  const MINTERS = [deployer.address]; // Admin is also a minter initially
  const PAUSERS = [deployer.address]; // Admin is also a pauser initially

  // Deploy the upgradeable contract
  console.log("Deploying NomadCoin...");
  const NomadCoinFactory = await ethers.getContractFactory("NomadCoin");
  
  const nomadCoin = await upgrades.deployProxy(
    NomadCoinFactory,
    [TOKEN_NAME, TOKEN_SYMBOL, ADMIN_ADDRESS, MINTERS, PAUSERS],
    {
      initializer: "initialize",
      kind: "uups",
    }
  ) as unknown as NomadCoin;

  await nomadCoin.waitForDeployment();
  const proxyAddress = await nomadCoin.getAddress();
  
  console.log("NomadCoin deployed to:", proxyAddress);
  
  // Get implementation address
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("Implementation deployed to:", implementationAddress);

  // Verify deployment
  console.log("Verifying deployment...");
  const name = await nomadCoin.name();
  const symbol = await nomadCoin.symbol();
  const decimals = await nomadCoin.decimals();
  const maxSupply = await nomadCoin.maxSupply();
  const totalSupply = await nomadCoin.totalSupply();
  
  console.log("Token Details:");
  console.log("- Name:", name);
  console.log("- Symbol:", symbol);
  console.log("- Decimals:", decimals);
  console.log("- Max Supply:", ethers.formatEther(maxSupply));
  console.log("- Total Supply:", ethers.formatEther(totalSupply));
  
  // Check roles
  const DEFAULT_ADMIN_ROLE = await nomadCoin.DEFAULT_ADMIN_ROLE();
  const MINTER_ROLE = await nomadCoin.MINTER_ROLE();
  const PAUSER_ROLE = await nomadCoin.PAUSER_ROLE();
  
  console.log("Role Assignments:");
  console.log("- Admin has DEFAULT_ADMIN_ROLE:", await nomadCoin.hasRole(DEFAULT_ADMIN_ROLE, ADMIN_ADDRESS));
  console.log("- Admin has MINTER_ROLE:", await nomadCoin.hasRole(MINTER_ROLE, ADMIN_ADDRESS));
  console.log("- Admin has PAUSER_ROLE:", await nomadCoin.hasRole(PAUSER_ROLE, ADMIN_ADDRESS));

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    proxyAddress,
    implementationAddress,
    deployer: deployer.address,
    blockNumber: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
    tokenDetails: {
      name,
      symbol,
      decimals,
      maxSupply: maxSupply.toString(),
      totalSupply: totalSupply.toString(),
    },
  };

  console.log("\nDeployment completed successfully!");
  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
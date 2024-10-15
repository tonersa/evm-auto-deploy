require('dotenv').config();
require('colors');
const {
  loadNetworkConfig,
  displayHeader,
  delay,
} = require('./src/utils');
const { deployContract } = require('./src/deploy');
const readline = require('readline-sync');

const nameCategories = {
  animals: [
    "Lion", "Tiger", "Bear", "Wolf", "Eagle", "Shark", "Dolphin", "Falcon", "Panda", "Giraffe",
    "Zebra", "Kangaroo", "Elephant", "Monkey", "Hippo", "Cheetah", "Leopard", "Rhino", "Octopus", "Koala"
  ],
  nature: [
    "Mountain", "Ocean", "Forest", "River", "Desert", "Glacier", "Volcano", "Canyon", "Prairie", "Tundra",
    "Island", "Reef", "Waterfall", "Cave", "Oasis", "Meadow", "Fjord", "Lagoon", "Geyser", "Dune"
  ],
  memes: [
    "Doge", "Pepe", "Wojak", "Stonks", "Rickroll", "Distracted", "Surprised", "ThisIsFine", "Kermit", "SpongeBob",
    "Keyboard", "Pikachu", "Drake", "Galaxy", "Moon", "Diamond", "Rocket", "Ape", "Hodl", "Lambo"
  ],
  crypto: [
    "Bitcoin", "Ethereum", "Blockchain", "DeFi", "NFT", "Metaverse", "Web3", "DAO", "Token", "Wallet",
    "Mining", "Staking", "Yield", "Liquidity", "Airdrop", "Fomo", "Shill", "Rekt", "Bullish", "Bearish"
  ]
};

function generateTokenName() {
  const category = Object.keys(nameCategories)[Math.floor(Math.random() * Object.keys(nameCategories).length)];
  const name = nameCategories[category][Math.floor(Math.random() * nameCategories[category].length)];
  return `${name}`;
}

function generateTokenSymbol(name) {
  // If name is one word, use first 3 letters. If more, use first letter of each word (up to 3).
  const words = name.split(/\s+/);
  if (words.length === 1) {
    return name.substring(0, 3).toUpperCase();
  } else {
    return words.slice(0, 3).map(word => word[0].toUpperCase()).join('');
  }
}

function generateTokenSupply() {
  return Math.floor(Math.random() * 1000000000) + 1000000; // 1 million to 1 billion
}

async function main() {
  displayHeader();
  console.log(`Please wait...\n`.yellow);
  await delay(3000);
  
  console.log('Welcome to EVM Auto Deploy!'.green.bold);
  const networkType = process.argv[2] || 'testnet';
  const networks = loadNetworkConfig(networkType);
  console.log(`Available networks:`.yellow);
  networks.forEach((network, index) => {
    console.log(`${index + 1}. ${network.name}`);
  });

  const networkIndex = parseInt(readline.question('\nSelect a network (enter number): '.cyan)) - 1;
  const selectedNetwork = networks[networkIndex];
  if (!selectedNetwork) {
    console.error('Invalid network selection'.red);
    process.exit(1);
  }

  const deploymentCount = parseInt(readline.question('Enter the number of deployments to perform: '.cyan));
  const delayBetweenDeployments = parseInt(readline.question('Enter the delay between deployments (in seconds): '.cyan)) * 1000;

  console.log(`\nPreparing to deploy ${deploymentCount} contracts on ${selectedNetwork.name}...`.yellow);
  await delay(2000);

  for (let i = 0; i < deploymentCount; i++) {
    console.log(`\nStarting deployment ${i + 1} of ${deploymentCount}...`.yellow);
    console.log(`Deploying contract to ${selectedNetwork.name}...`.cyan);

    const name = generateTokenName();
    const symbol = generateTokenSymbol(name);
    const supply = generateTokenSupply();

    try {
      const contractAddress = await deployContract(
        selectedNetwork,
        name,
        symbol,
        supply
      );

      console.log(`\nDeployment ${i + 1} completed!`.green.bold);
      console.log(`Token Name: ${name}`);
      console.log(`Token Symbol: ${symbol}`);
      console.log(`Token Supply: ${supply.toLocaleString()}`);
      console.log(`Contract Address: ${contractAddress}`);
    } catch (error) {
      console.error(`Error in deployment ${i + 1}:`.red, error.message);
    }

    if (i < deploymentCount - 1) {
      console.log(`\nWaiting for ${delayBetweenDeployments / 1000} seconds before next deployment...`.yellow);
      await delay(delayBetweenDeployments);
    }
  }

  console.log('\nAll deployments completed!'.green.bold);
}

main().catch((error) => {
  console.error('An error occurred:'.red, error);
  process.exit(1);
});

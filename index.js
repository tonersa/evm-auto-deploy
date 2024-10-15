require('dotenv').config();
require('colors');
const {
  loadNetworkConfig,
  displayHeader,
  delay,
} = require('./src/utils');
const { deployContract } = require('./src/deploy');
const readline = require('readline-sync');

const diverseNames = [
  // Tech and Crypto
  "Bitcoin", "Ethereum", "Blockchain", "NFT", "Metaverse",
  "AI", "Robot", "Cyber", "Digital", "Virtual",
  
  // Nature and Elements
  "Ocean", "Mountain", "Forest", "River", "Wind",
  "Fire", "Earth", "Thunder", "Storm", "Sunset",
  
  // Animals
  "Lion", "Eagle", "Shark", "Wolf", "Panda",
  "Phoenix", "Dragon", "Tiger", "Falcon", "Dolphin",
  
  // Mythical and Fantasy
  "Wizard", "Dragon", "Unicorn", "Elf", "Orc",
  "Mage", "Paladin", "Titan", "Kraken", "Siren",
  
  // Space and Sci-Fi
  "Galaxy", "Nebula", "Pulsar", "Quasar", "Asteroid",
  "Starship", "Alien", "Cosmic", "Lunar", "Solar",
  
  // Pop Culture
  "Meme", "Viral", "Trend", "Influencer", "Celebrity",
  "Hashtag", "Selfie", "Emoji", "Gif", "Stream",
  
  // Food and Drinks
  "Pizza", "Sushi", "Taco", "Burger", "Coffee",
  "Ramen", "Donut", "Smoothie", "Matcha", "Boba",
  
  // Emotions and Concepts
  "Joy", "Freedom", "Love", "Peace", "Hope",
  "Dream", "Harmony", "Unity", "Bliss", "Zen",
  
  // Colors
  "Crimson", "Azure", "Emerald", "Violet", "Gold",
  "Obsidian", "Sapphire", "Ruby", "Ivory", "Onyx",
  
  // Abstract and Artistic
  "Pixel", "Vector", "Quantum", "Fractal", "Neon",
  "Retro", "Synth", "Glitch", "Vaporwave", "Surreal"
];

const suffixes = ["", "X", "Pro", "Max", "Ultra", "Plus", "Prime", "Elite", "Hyper", "Mega"];

function generateTokenName() {
  const baseName = diverseNames[Math.floor(Math.random() * diverseNames.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${baseName}${suffix ? ' ' + suffix : ''}`;
}

function generateTokenSymbol(name) {
  // Mengambil 3 huruf pertama dari nama, menghilangkan spasi
  const nameWithoutSpaces = name.replace(/\s/g, '');
  return nameWithoutSpaces.substring(0, 3).toUpperCase();
}

function generateTokenSupply() {
  return Math.floor(Math.random() * 1000000000) + 1000000; // 1 juta hingga 1 miliar
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

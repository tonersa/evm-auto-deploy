require('dotenv').config();
require('colors');
const {
  loadNetworkConfig,
  displayHeader,
  delay,
} = require('./src/utils');
const { deployContract } = require('./src/deploy');
const readline = require('readline-sync');

const animalNames = [
  "Lion", "Tiger", "Bear", "Wolf", "Eagle",
  "Shark", "Dolphin", "Falcon", "Panda", "Giraffe",
  "Zebra", "Kangaroo", "Elephant", "Monkey", "Hippo",
  "Cheetah", "Leopard", "Rhino", "Octopus", "Koala",
  "Penguin", "Owl", "Parrot", "Swan", "Antelope",
  "Buffalo", "Bison", "Jaguar", "Whale", "Tortoise",
  "Sloth", "Squirrel", "Raccoon", "Bat", "Crab",
  "Hedgehog", "Ferret", "Gorilla", "Camel", "Crocodile",
  "Gecko", "Iguana", "Peacock", "Armadillo", "Pangolin"
];

function generateTokenName() {
  const randomAnimal = animalNames[Math.floor(Math.random() * animalNames.length)];
  return `${randomAnimal}Bonk`;
}

function generateTokenSymbol(animal) {
  return `${animal.substring(0, 2).toUpperCase()}K`;
}

function generateTokenSupply() {
  return Math.floor(Math.random() * 1000000) + 1;
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

    const animal = animalNames[Math.floor(Math.random() * animalNames.length)];
    const name = generateTokenName();
    const symbol = generateTokenSymbol(animal);
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
      console.log(`Token Supply: ${supply}`);
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

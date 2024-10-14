require('dotenv').config();
require('colors');
const {
  loadNetworkConfig,
  displayHeader,
  delay,
} = require('./src/utils');
const { deployContract } = require('./src/deploy');

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
  return `${animal.charAt(0)}${animal.charAt(1)}K`; // Contoh: "Lion" menjadi "LK"
}

function generateTokenSupply() {
  return Math.floor(Math.random() * 1000000) + 1;
}

async function deployTokens(selectedNetwork) {
  for (let i = 0; i < 50; i++) {
    const animal = animalNames[Math.floor(Math.random() * animalNames.length)];
    const name = generateTokenName();
    const symbol = generateTokenSymbol(animal);
    const supply = generateTokenSupply();

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

    await delay(10000); // Jeda 10 detik sebelum deploy berikutnya
  }
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

  const networkIndex =
    parseInt(require('readline-sync').question('\nSelect a network (enter number): '.cyan)) - 1;
  const selectedNetwork = networks[networkIndex];

  if (!selectedNetwork) {
    console.error('Invalid network selection'.red);
    process.exit(1);
  }

  await deployTokens(selectedNetwork);
  
  console.log('\n


main().catch((error) => {
  console.error(error);
  process.exit(1);
});

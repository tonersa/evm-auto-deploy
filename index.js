require('dotenv').config();
require('colors');
const {
  loadNetworkConfig,
  displayHeader,
  delay,
} = require('./src/utils');
const { deployContract } = require('./src/deploy');
const { ethers } = require('ethers'); // Pastikan ethers sudah terinstal

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

async function waitForTransaction(provider, txHash) {
  const receipt = await provider.waitForTransaction(txHash);
  return receipt;
}

async function deployTokens(selectedNetwork) {
  const provider = new ethers.providers.JsonRpcProvider(selectedNetwork.rpcUrl);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  for (let i = 0; i < 50; i++) {
    const animal = animalNames[Math.floor(Math.random() * animalNames.length)];
    const name = generateTokenName();
    const symbol = generateTokenSymbol(animal);
    const supply = generateTokenSupply();

    try {
      const txHash = await deployContract(
        selectedNetwork,
        name,
        symbol,
        supply
      );

      console.log(`\nDeployment ${i + 1} in progress...`.yellow);
      // Tunggu hingga transaksi selesai
      const receipt = await waitForTransaction(provider, txHash);
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);

      console.log(`\nDeployment ${i + 1} completed!`.green.bold);
      console.log(`Token Name: ${name}`);
      console.log(`Token Symbol: ${symbol}`);
      console.log(`Token Supply: ${supply}`);
      console.log(`Contract Address: ${receipt.contractAddress}`);

      await delay(10000); // Jeda 10 detik sebelum deploy berikutnya
    } catch (error) {
      console.error(`Error deploying contract: ${error.message}`.red);
      await delay(10000); // Tunggu sebelum mencoba lagi
    }
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
  
  console.log('\nAll tokens have been deployed! Exiting now...'.green);
}

main().catch(console.error);

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

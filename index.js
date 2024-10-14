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
  "Zebra", "Kangaroo", "Elephant", "Monkey", "Hippo"
];

function generateTokenName() {
  const randomAnimal = animalNames[Math.floor(Math.random() * animalNames.length)];
  return `${randomAnimal}Bonk`; // Contoh: LionBonk
}

function generateTokenSymbol() {
  return `BONK`; // Simbol tetap sama
}

function generateTokenSupply() {
  return Math.floor(Math.random() * 1000000) + 1; // Pasokan antara 1 hingga 1,000,000
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

  // Menghasilkan nama, simbol, dan pasokan token secara otomatis
  const name = generateTokenName();
  const symbol = generateTokenSymbol();
  const supply = generateTokenSupply();

  // Menambahkan jeda 10 detik sebelum deploy kontrak
  console.log(`Preparing to deploy token...`);
  await delay(10000); // Jeda 10 detik

  const contractAddress = await deployContract(
    selectedNetwork,
    name,
    symbol,
    supply
  );

  console.log(`\nDeployment completed!`.green.bold);
  console.log(`Token Name: ${name}`);
  console.log(`Token Symbol: ${symbol}`);
  console.log(`Token Supply: ${supply}`);
  console.log(`Contract Address: ${contractAddress}`);
}

main().catch(console.error);

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

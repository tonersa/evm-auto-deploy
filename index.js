require('dotenv').config();
require('colors');
const {
  loadNetworkConfig,
  displayHeader,
  delay,
} = require('./src/utils');
const { deployContract } = require('./src/deploy');
const readline = require('readline-sync');

const animeGirlNames = [
  "Mikasa", "Asuka", "Rei", "Misato", "Sakura",
  "Hinata", "Tsunade", "Winry", "Riza", "Erza",
  "Lucy", "Rukia", "Orihime", "Saber", "Rin",
  "Megumin", "Aqua", "Darkness", "Zero Two", "Ichigo",
  "Rem", "Ram", "Emilia", "Nezuko", "Nami",
  "Robin", "Boa", "Violet", "Kurisu", "Mio",
  "Yui", "Asuna", "Sinon", "Albedo", "Shaltear",
  "Tatsumaki", "Fubuki", "Ochaco", "Momo", "Tsuyu",
  "Tohru", "Kanna", "Chika", "Kaguya", "Hayasaka",
  "Marin", "Yor", "Anya", "Makima", "Power",
  "Akame", "Mine", "Esdeath", "Ryuko", "Satsuki",
  "Yuno", "Noelle", "Mimosa", "Nero", "Charlotte",
  "Hestia", "Ais", "Ryuu", "Freya", "Liliruca",
  "Raphtalia", "Filo", "Melty", "Malty", "Mirellia",
  "Yumeko", "Mary", "Kirari", "Sayaka", "Midari",
  "Hori", "Remi", "Yoruichi", "Rangiku", "Unohana",
  "Shinobu", "Mitsuri", "Kanao", "Aoi", "Daki",
  "Mai", "Nobara", "Maki", "Miwa", "Utahime",
  "Faye", "Julia", "Judy", "Revy", "Balalaika",
  "Motoko", "Faye Valentine", "Edward", "Integra", "Seras"
];

const suffixes = ["", "Bonk", "Hard", "Wife"];

function generateTokenName() {
  const baseName = animeGirlNames[Math.floor(Math.random() * animeGirlNames.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${baseName}${suffix ? ' ' + suffix : ''}`;
}

function generateTokenSymbol(name) {
  // Menggunakan huruf pertama dari setiap kata dalam nama, maksimal 4 huruf
  return name.split(' ').map(word => word[0].toUpperCase()).join('').substring(0, 4);
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

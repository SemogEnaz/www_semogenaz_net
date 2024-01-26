import CatalogueReader, { Item } from './reader';

export default function handler(req, res) {

  const colesCatalogue = getCuratedColes(2);
  const wooliesCatalogue = getCuratedWoolies(4);

  const date = () => {
    const date = new Date();

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const time = () => {
    const date = new Date();

    const hours = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    return `${hours}:${min}:${sec}`;
  }

  console.log(`${date()} ${time()} weaklyPrices: Getting catalogue summaries.`);

  res.status(200).json({
    summaries: {
      coles: colesCatalogue,
      woolworths: wooliesCatalogue
    }
  })
}

function getCuratedColes(itemsPerCatagory: number) {

  const catagories = [
    "Frozen",
    'Dairy, Eggs & Fridge',
    'Pantry',
    'Meat & Seafood',
  ];

  const dir = './src/scripts/weaklyPrices/coles_catalogue/';

  return getCuratedCatalogue(catagories, dir, itemsPerCatagory);
}

function getCuratedWoolies(itemsPerCatagory: number) {

  const catagories = [
    'Half Price',
    'Prices Dropped',
  ];

  const dir = './src/scripts/weaklyPrices/woolies_catalogue/'

  return getCuratedCatalogue(catagories, dir, itemsPerCatagory)
}

function getCuratedCatalogue(catagories: string[], dir: string, itemsPerCatagory: number) {

  let allItems: Item[] = [];

  const reader = new CatalogueReader();

  for (const catagory of catagories) {

    let items = reader.readCsv(dir, catagory);

    items = reader.getTopDrops(items, itemsPerCatagory);

    allItems.push(...items);
  }

  return allItems;
}
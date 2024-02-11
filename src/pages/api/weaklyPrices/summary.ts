import { NextApiRequest, NextApiResponse } from 'next';

import CatalogueReader, { Item } from './reader';

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  const { brand } = req.query;

  const catalogue = 
    brand == 'coles' ? getCuratedColes(2) : getCuratedWoolies(4);

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

  console.log(`${date()} ${time()} weaklyPrices: Sending ${brand} catalogue summary.`);

  res.status(200).json({ summary: catalogue })
}

function getCuratedColes(itemCount: number) {

  const catagories = [
    "Frozen",
    'Dairy, Eggs & Fridge',
    'Pantry',
    'Meat & Seafood',
  ];

  const dir = './src/scripts/weaklyPrices/coles_catalogue/';

  return getCuratedCatalogue(catagories, dir, itemCount);
}

function getCuratedWoolies(itemCount: number) {

  const catagories = [
    'Half Price',
    'Prices Dropped',
  ];

  const dir = './src/scripts/weaklyPrices/woolies_catalogue/'

  return getCuratedCatalogue(catagories, dir, itemCount)
}

function getCuratedCatalogue(catagories: string[], dir: string, itemCount: number) {

  let allItems: Item[] = [];
  const reader = new CatalogueReader();

  for (const catagory of catagories) {
    let items = reader.readCsv(dir, catagory);
    items = reader.getTopDrops(items, itemCount);
    allItems.push(...items);
  }

  return allItems;
}
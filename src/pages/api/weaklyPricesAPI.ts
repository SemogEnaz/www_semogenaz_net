// Run this api using http://localhost:3000/api/weaklyPricesAPI
import fs from 'fs';
import path from 'path';

interface Item {
  name: string;
  old_price: string;
  new_price: string;
}

function parseData(data: string): Item[] {

  let items = [];

  let lines = data.split('\r\n');

  for (let line of lines) {

      let substrings = line.split(',');

      const item: Item = {
          name: substrings[0],
          old_price: substrings[1],
          new_price: substrings[2]
      };

      items.push(item);
  }

  // Removing elements
  items.splice(0, 1)                  // First element, headings
  items.splice(items.length - 1, 1)   // Last element, empty

  return items;
}
 
export default function handler(req, res) {

  const { fileName } = req.query;

  if (!fileName) {
      res.status(400).json({ error: 'File name is required' });
      return;
  }

  const dir = path.join(process.cwd(), 'src/scripts/weaklyPrices/coles_catalogue/');
  const filePath = path.join(dir, fileName);

  try {
      const data = fs.readFileSync(filePath, 'utf8');
      const items = parseData(data);
      res.status(200).json(items);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read file' });
  }
}
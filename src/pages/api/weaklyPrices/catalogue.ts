import { execSync } from "child_process";
import CatalogueReader, {Item} from "./reader";

export default function handler(req, res) {

    const { brand } = req.query;
    const itemCount = 5;

    const catalogue = 
        brand == 'coles' ? 
        getCatalogueSummary(itemCount, 'coles_catalogue') :
        getCatalogueSummary(itemCount, 'woolies_catalogue');

    console.log(`Getting ${brand} catalogue`)
    res.status(200).json({ catalogue: catalogue });
}

function getCatalogueSummary(itemsPerCatagory: number, dir: string): 
    { id: number, name:string, items:Item[]; }[] {

    let catalogue = [];
    let id = 0;

    const reader = new CatalogueReader();
    const path = `./src/scripts/weaklyPrices/${dir}/`;
    const catagories = getCatagories(path);

    for (const catagory of catagories) {

        let items = reader.readCsv(path, catagory);

        items = reader.getTopDrops(items, itemsPerCatagory);

        let card = {
            id: id,
            name: catagory,
            items: items
        }

        catalogue.push(card);

        id++;
    }

    return catalogue;
}

function getCatagories(path: string): string[] {

    const files = execSync(`ls ${path}`)
    const fileNames = files.toString().replaceAll('.csv', '').split('\n');
    fileNames.pop();

    return fileNames;
}
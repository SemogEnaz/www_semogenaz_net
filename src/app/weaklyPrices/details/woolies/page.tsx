import CatalogueReader, { Item } from '@/app/weaklyPrices/catalogueReader'
import Display from '../display'

export default function Page() {
    const catalogue = getCatalogueSummary(5);

    return <Display catalogue={catalogue} />
}

function getCatalogueSummary(itemsPerCatagory: number): 
    { id: number, name:string, items:Item[]; }[] {

    let catalogue = [];
    let id = 0;

    const catagories = getCatagories();
    const reader = new CatalogueReader();
    const dir = 'src/scripts/weaklyPrices/woolies_catalogue/';

    for (const catagory of catagories) {

        let items = reader.readCsv(dir, catagory);

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

function getCatagories() {
    return [
        'Half Price',
        'Prices Dropped',
    ]
}
import fs from 'node:fs';

export type Item = {
    name: string;
    oldPrice: number;
    newPrice: number;
    link: string;
}

export default class CatalogueReader {

    readCsv(dir: string, fileName: string): Item[] {

        const extension = '.csv'
        const filePath = dir + fileName + extension;
        console.log(`Attempting to read from ${filePath}`);
    
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return this._parseData(data);
        } catch (err) {
            console.error(err);
        }
        return [];
    }
    
    _parseData(data: string): Item[] {
    
        let items = [];
    
        let lines = data.split('\r\n');
    
        for (let line of lines) {
    
            let substrings = line.split(',');
    
            const item: Item = {
                name: substrings[0],
                oldPrice: parseFloat(substrings[1]),
                newPrice: parseFloat(substrings[2]),
                link: substrings[3],
            };
    
            items.push(item);
        }
    
        // Removing elements
        items.splice(0, 1)                  // First element, headings
        items.splice(items.length - 1, 1)   // Last element, empty
    
        return items;
    }

    getTopDrops(items: Item[], itemCount: number): Item[] {
    
        let sortedItmes = items.sort((a: Item, b: Item) => {
            return (b.oldPrice - b.newPrice) - (a.oldPrice - a.newPrice)
        });
        
        return sortedItmes.slice(0, itemCount);
    }
}
import { NextApiRequest, NextApiResponse } from "next";
import { execSync } from "child_process";

import CatalogueReader, { Item } from "./reader";

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    const { brand, category: encodedCategory, itemCount, pageCount } = req.query;
    const category = 
        encodedCategory && !Array.isArray(encodedCategory) ? 
        decodeURIComponent(encodedCategory) : undefined;

    //console.log('\nCall to weaklyPrices/detailed api\n');

    // Error if url is not valid
    if (!brand) {
        res.status(400).json({ 
            error: `Include brand in request
                    eg:
                    \turl?brand=coles (returns catagories for coles)
                    \turl?brand=coles&catagory=[x] (returns items summary for x)
                    \turl?brand=coles&catagory=[x]&count=12 (top 12 price drops, decending)`
        });
        return;
    }
    const colesDir = `coles_catalogue`;
    const woolieDir = `woolies_catalogue`;

    // Return catagory list for catalogue
    // eg: url?brand=coles returns coles catagories
    if (brand && !category) {
        const files = 
            brand == 'coles' ?
            getCatagoryNames(colesDir) :
            getCatagoryNames(woolieDir)

        console.log(`Getting catagories for ${brand}:\n\t${files}\n`);
        res.status(200).json({ catagories: files});
        return;
    }

    // Return catagory array for catalogue
    // eg: url?brand=coles&catagory=x    
    if (!category || category == ' ') {
        console.log(`Catagory ${category} is invalid!`);
        res.status(400).end();
        return;
    }

    if (itemCount)
        try {
            const summary = getCatalogue(
                Number(itemCount), 
                brand == 'coles' ? colesDir : woolieDir, 
                category as string
            );

            console.log(`Getting ${brand} page for ${category}, ${itemCount} items`);
            res.status(200).json({ summary: summary });
            return;
        } catch (error) {
            console.log(`Catagory name ${category} is invlaid for ${brand}!`);
            res.status(500).end();
            return;
        }
    else if (pageCount)
        try {
            const summary = getCatagoryPage(
                Number(pageCount), 
                brand == 'coles' ? colesDir : woolieDir, 
                category as string
            );

            console.log(`Getting ${brand} page for ${category}, ${pageCount} pages`);
            res.status(200).json({ summary: summary });
            return;
        } catch (error) {
            console.log(`Catagory name ${category} is invlaid for ${brand}!`);
            res.status(500).end();
            return;
        }
}

// Reads a csv file and returns card object with name and items attribute
function getCatalogue(
    itemCount: number, brandDir: string, catagoryName: string): Item[] {

    const reader = new CatalogueReader();
    const path = `./src/scripts/weaklyPrices/${brandDir}/`;
    const allItems = reader.readCsv(path, catagoryName);
    return reader.getTopDrops(allItems, itemCount);
}

function getCatagoryPage(pageCount: number, brandDir: string, catagoryName: string): Item[] {

    const catagory = getCatalogue(pageCount*10, brandDir, catagoryName);

    return catagory.slice((pageCount-1)*10, pageCount*10);
}

/*  Returns catagories of catalogue

    param: 
        dir: directory holding catagory files eg: 'coles_dir'
    
    return: string array of catagory names, not file names. eg: Baby (not Baby.csv)
*/
function getCatagoryNames(dir: string): string[] {

    const path = `./src/scripts/weaklyPrices/${dir}/`;

    const files = execSync(`ls ${path}`)
    const fileNames = files.toString().replaceAll('.csv', '').split('\n');
    fileNames.pop();

    return fileNames;
}
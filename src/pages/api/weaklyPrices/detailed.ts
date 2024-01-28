import { NextApiRequest, NextApiResponse } from "next";
import { execSync } from "child_process";

import CatalogueReader, { Item } from "./reader";

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    const { brand, category: encodedCategory, count } = req.query;
    const category = 
        encodedCategory && !Array.isArray(encodedCategory) ? 
        decodeURIComponent(encodedCategory) : undefined;

    // Error if url is not valid
    if (!brand) 
    res.status(400).json({ 
        error: `Include brand in request
                eg:
                \turl?brand=coles (returns catagories for coles)
                \turl?brand=coles&catagory=[x] (returns items summary for x)
                \turl?brand=coles&catagory=[x]&count=12 (top 12 price drops, decending)`
    });

    const colesDir = `coles_catalogue`;
    const woolieDir = `woolies_catalogue`;

    // Return catagory list for catalogue
    // eg: url?brand=coles returns coles catagories
    if (brand && !category) 
        return res.status(200).json({ 
            catagories: brand == 'coles' ?
            getCatagoryNames(colesDir) :
            getCatagoryNames(woolieDir)
        });

    // Return catagory array for catalogue
    // eg: url?brand=coles&catagory=x    
    if (!category || category == ' ') 
        return res.status(400).json({ error: `Catagory ${category} is invalid!` });

    const itemCount = !count || isNaN(Number(count)) ? 10 : Number(count);

    try {
        const summary = getCatalogue(
            itemCount, 
            brand == 'coles' ? colesDir : woolieDir, 
            category as string
        );

        console.log(`Getting ${brand} page for ${category}`);
        res.status(200).json({ summary: summary });
    } catch (error) {
        console.log(`Catagory name ${category} is invlaid for ${brand}!`);
        res.status(500);
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
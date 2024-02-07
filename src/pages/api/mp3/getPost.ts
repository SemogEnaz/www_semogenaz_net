import { execSync } from 'child_process';
import https from 'https';
import fs from 'fs';
import { createSearchParamsBailoutProxy } from 'next/dist/client/components/searchparams-bailout-proxy';

export default async function handler(req, res) {

    const { url: encodedURL, downloadType } = req.query;
    const url = decodeURIComponent(encodedURL);
    console.log(url);

    const command = 
        `python src/scripts/mp3/IG_graphql_scraper/post_data.py ${url} no-d`;
    const linksJson = execSync(command, { encoding: 'utf8' });
    const links = JSON.parse(linksJson);

    const downloadAll = async (links: string[]) => (
        await Promise.all(links.map((link, index) => download(link, index)))
    );

    let fileNames = await downloadAll(links);
    if (downloadType == 'zip') fileNames = [compressFiles(fileNames)];
    console.log('IG post download complete!');
    res.status(200).send({ fileNames: fileNames });
}

function download(link: string, index: number): Promise<string> {

    const getTimeCode = (codeLen: number) =>  String(Date.now()).slice(codeLen);
    const codeLen = 8;
    const code = getTimeCode(codeLen * -1);

    const basePath = './public/mp3/downloads/' + code;

    return new Promise((resolve, reject) => {
        const fileName: string = `${basePath}-${index}.${link.includes('.mp4') ? 'mp4' : 'jpeg'}`;
        const file = fs.createWriteStream(fileName);

        https.get(link, response => {
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log(`\t${fileName}`);
                resolve(fileName.split('/').pop()!);
            });
        }).on('error', err => {
            console.error(`Error downloading ${fileName}: ${err.message}`);
            reject(err);
        });
    });
}

function compressFiles(fileNames: string[]): string {

    if (fileNames.length == 1) return '';

    console.log('zipping...');

    const getTimeCode = (codeLen: number) =>  String(Date.now()).slice(codeLen);
    const codeLen = 8;
    const code = getTimeCode(codeLen * -1);

    if (fileNames.length == 1) return fileNames.pop()!;

    const public_dir = './public/mp3/downloads/';
    const otherArgs = [
        '-m',   // delete zipped file
        //'-1',   // Faster zip
        '-9',
        '-j',   // Don't include the directory structure, just files
    ]

    const fileName = `${code}.zip`;

    const zip = [
        'zip',
        ...otherArgs,
        public_dir + fileName, 
        ...fileNames.map(
            fileName => `${public_dir}${fileName}`
        )
    ].join(' ');

    execSync(zip);

    // Need to delete non zipped files after zipping

    return fileName;
}
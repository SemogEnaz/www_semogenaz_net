import { exec } from "child_process";

export default function handler(req, res) {
    const { fileName } = req.query;

    const deleteCmd = `rm ./public/mp3/downloads/${fileName}`;
    exec(deleteCmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`Error deleting file: ${fileName}\n`, error);
            res.status(500);
        }
        console.log(`Deleted ${fileName}`);
        //res.status(200);
    })
    res.status(200);
}
import { execFile } from 'child_process';

export default function handler(req, res) {
    const { url } = req.query;

    if(!url) {
        return res.status(400).json({ error: 'URL is required'});
    }

    const command = 'yt-dlp';
    const args = ['--get-title', url];

    execFile(command, args, (error, stdout, stderr) => {
        if (error) {
            res.status(400).json(null);
        }
        const title = stdout.split('\n')[0];
        res.status(200).json({ 'title': title });
    });
    res.status(200);
}
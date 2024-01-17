import { execSync } from 'child_process';

export default function handler(req, res) {
    const { url, isAudio, options } = req.query;

    if(!url) return res.status(400).json(
        { error: 'URL is required'});

    const getTimeCode = (codeLen: number) =>  String(Date.now()).slice(codeLen);
    const addCode = (code: string) => ` -o "./public/mp3/downloads/${code}.%(ext)s"`;

    const codeLen = 8;
    const code = getTimeCode(codeLen * -1);

    const args = getArgs(isAudio, options) + addCode(code);
    const yt_dlp = `yt-dlp ${args} ${decodeURIComponent(url)}`;

    console.log(yt_dlp);
    execSync(yt_dlp);

    const fileNames = getFileName(code);
    const fileName = compressFiles(fileNames, code);

    console.log(`File Downloaded: ${fileName}`);
    res.status(200).json({ 'fileName': fileName });
}

function compressFiles(fileNames: string[], code: string): string {

    /*  Thoughts on zipping files...

        Should the file(s) always be zipped? Would be annoying
        if only 1 file is zipped.

        This is a seemingly good solution to handle multiple 
        file downloads.
    */

    if (fileNames.length == 1) return fileNames.pop()!;

    const public_dir = './public/mp3/downloads/';
    const otherArgs = [
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

function getFileName(code: string): string[] {
    const files = execSync('ls ./public/mp3/downloads/')

    return files.toString().split('\n')
        .filter(string => string.includes(code));
}

function getArgs(isAudio: string, options: string): string {
    if (isAudio == 'true')
        return getAudioArgs(decodeURIComponent(options));

    return getVideoArgs(decodeURIComponent(options));
}

function getAudioArgs(options: string) {

    const addFormat = (option: string) => {
        if (option == '') return '--skip-download';

        const format = `-f bestaudio${option == 'opus' ? '[ext=webm]' : ''} --audio-format ${option}`;
        return `-x ${format} --add-metadata`;
    };

    const addEmbed = (option: string) => option == '' ? '' : `--${option}-thumbnail`;
    const addDownload = (option: string) => option == '' ? '' : `--${option}-thumbnail --convert-thumbnails png`;

    const getValue = (args: string[], argName: string) => {
        const arg = args.find(arg => arg.startsWith(`${argName}:`))!;
        return arg.split(':').pop()!;
    }

    const args = options.split(';');

    const format = getValue(args, 'format');
    const embed = getValue(args, 'embed');
    const download = getValue(args, 'download');

    return `${addFormat(format)} ${addEmbed(embed)} ${addDownload(download)}`;
}

function getVideoArgs(options: string) {

    const format = (format: string) =>  `-f 'best[ext=${format}]'`;

    const embed = (option: string) => option == 'embed' ? option : '';
    const subs = (option: string) => `--${embed(option)}-subs`;
    const chapters = (option: string) => `--${embed(option)}-chapters`;

    const sponsor = (option: string) => `--sponsorblock-${option == 'mark all' ? 'mark' : 'remove all'}`;

    const args = options.split(';');
    const command = `${format(args[1])} ${args[3] == '' ? '' : subs(args[3])} ${args[5] == '' ? '' : chapters(args[5])} ${args[7] == '' ? '' : sponsor(args[7])} --embed-thumbnail --add-metadata`;
    return command;
}
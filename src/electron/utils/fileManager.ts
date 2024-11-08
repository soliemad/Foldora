import fs from 'fs';
import path from 'path';
import {exec} from 'child_process';

export function getFolderContents(folderPath: string): FileStats[] {
    const files = fs.readdirSync(folderPath, {withFileTypes: true});

    return files.map(file => {
        const filePath = path.join(folderPath, file.name);
        const stats = fs.statSync(filePath,);
        return {
            name: file.name,
            type: stats.isDirectory() ? 'folder' : file.name.split('.').slice(-1)[0],
            size: stats.size
        }
    })
}

export function openFile(filePath: string) {
    exec(`"${filePath}"`);
}
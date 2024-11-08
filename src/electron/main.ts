import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { getUIPath, ipcMainHandle, isDev } from './utils/util.js';
import { getStaticData, pollRessources } from './utils/ressourceManager.js';
import { getPreloadPath } from './pathResolver.js';
import { getFolderContents, openFile } from './utils/fileManager.js';

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
        }
    });
    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123/')
    } else {
        mainWindow.loadFile(getUIPath());
    }

    pollRessources(mainWindow);
    ipcMainHandle('getStaticData', () => {
        return getStaticData();
    })
    ipcMainHandle('getFolderContents', (event, folderPath) => {
        return getFolderContents(folderPath);
    })
    ipcMainHandle('openFile', (event, filePath) => {
        return openFile(filePath);
    })
});


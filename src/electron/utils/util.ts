import { app, ipcMain, WebContents, WebFrameMain } from "electron";
import path from 'path';
import { pathToFileURL } from 'url';

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}


export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
    key: Key,
    handler: (...args: any[]) => EventPayloadMapping[Key]
) {
    ipcMain.handle(key, (event, ...args) => {
        validateEventFrame(event.senderFrame);
        return handler(event, ...args)
    });
}


export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    webContents: WebContents,
    payload: EventPayloadMapping[Key]
) {
    webContents.send(key, payload)
}

export function getUIPath() {
    return path.join(app.getAppPath() + "/dist-react/index.html");
}

export function validateEventFrame(frame: WebFrameMain) {
    if (isDev() && new URL (frame.url).host === 'localhost:5123') {
        return;
    }
    if (frame.url !== pathToFileURL(getUIPath()).toString()) {
        throw new Error('Malicious Event')
    }
}
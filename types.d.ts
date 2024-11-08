type Statistics = {
    cpuUsage: number;
    ramUsage: number;
    storageUsage: number;
};

type StaticData = {
    totalStorage: number;
    cpuModel: string;
    totalMemoryGB: number;
};

type FileStats = {
    name: string;
    type: string;
    size: number;
}

type EventPayloadMapping = {
    statistics: Statistics,
    getStaticData: StaticData,
    getFolderContents: FileStats[]
    openFile: void
}

type EventParameters = {
    getFolderContents: [string]
}

type UnsubscribeFunction = () => void;

interface Window {
    electron: {
        subscribeStatistics: (callback: (statistics: Statistics) => void) => UnsubscribeFunction;
        getStaticData: () => Promise<StaticData>;
        getFolderContents: (folderPath: string) => Promise<FileStats[]>
        openFile: (filePath: string) => void
    }
}


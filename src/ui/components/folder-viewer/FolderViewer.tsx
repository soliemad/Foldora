import { ArrowUpward } from "@mui/icons-material";
import { Button, Grid2, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react"

interface FolderViewerProps {
    startingPath?: string
}

export default function FolderViewer({ startingPath }: FolderViewerProps) {

    const [files, setFiles] = useState<FileStats[]>([]),
        [path, setPath] = useState<string>(),
        [hasError, setHasError] = useState(false),
        [searchField, setSearchField] = useState<string>();
    const updatePath = (newPath: string) => {
        const prevPath = path;
        setPath(newPath);
        window.electron.getFolderContents(newPath).then((files) => {
            setFiles(files);
            setHasError(false);
        }).catch(() => {
            setHasError(true);
            setPath(prevPath);
        })
    }
    const getParentFolder = (path: string) => {
        return path.split('\\').slice(0, -1).join('\\');
    }

    useEffect(() => {
        if (startingPath) {
            updatePath(startingPath);
        }
    }, []);
    

    return (
        <Grid2 container spacing={2}>
            <Grid2 size={1} sx={{ display: 'flex', alignItems: 'center' }}>
                <Button onClick={() => path && updatePath(getParentFolder(path))}>
                    <ArrowUpward/>
                </Button>
            </Grid2>
            <Grid2 size={7}>
                <TextField value={path} onChange={(event) => updatePath(event.target.value)} error={hasError} fullWidth/>
            </Grid2>
            <Grid2 size={4}>
                <TextField placeholder="Search" fullWidth disabled={!path || files.length === 0} onChange={(event) => setSearchField(event.target.value)}/>
            </Grid2>
            <Grid2 size={12}>
                <DataGrid rows={files.filter((file) => !searchField || file.name.toLowerCase().includes(searchField.toLowerCase())).map((file, index) => ({
                    id: index,
                    name: file.name,
                    type: file.type,
                    size: file.size
                }))} columns={[
                    { field: 'name', headerName: 'Name', width: 200 },
                    { field: 'type', headerName: 'Type', width: 200 },
                    { field: 'size', headerName: 'Size', width: 200 },
                ]}
                    onRowDoubleClick={(event) => {
                        if (event.row.type === 'folder') {
                            updatePath(path + "\\" + event.row.name);
                        } else {
                            window.electron.openFile(path + "\\" + event.row.name);
                        }
                    }}
                />
            </Grid2>
        </Grid2>

    )
}
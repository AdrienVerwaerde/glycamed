import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { exportToCSV } from "../../lib/utils/csvExport";


export default function DownloadCSVButton({ data, period, disabled = false }) {
    const handleDownload = () => {

        if (!data) {
            console.warn("No data available for download");
            return;
        }

        exportToCSV(data, period);
    };

    if (!data) {
        return null;
    }

    return (
        <Tooltip title="Télécharger le rapport" arrow>
            <Button
                variant="download"
                onClick={handleDownload}
                disabled={disabled}
                size="small"
                sx={{mt:2, width: "100%"}}
            >
                <DownloadIcon />
                Télécharger le rapport
            </Button>
        </Tooltip>
    );
}
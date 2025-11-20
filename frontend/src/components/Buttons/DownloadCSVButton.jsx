import { IconButton, Tooltip } from "@mui/material";
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
        <Tooltip title="Télécharger en CSV" arrow>
            <IconButton
                onClick={handleDownload}
                disabled={disabled}
                size="small"
                sx={{
                    color: "var(--color-background)",
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                    "&:disabled": {
                        color: "rgba(0, 0, 0, 0.26)",
                    },
                }}
            >
                <DownloadIcon />
            </IconButton>
        </Tooltip>
    );
}
import ConsumptionRecap from '../components/ConsumptionsCards/ConsumptionRecap'
import { Box } from '@mui/material'

export default function ReportsPage() {
    return (
        <Box
            sx={{
                width: "100vw",
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                flexDirection: "column",
                justifyContent: "center",
                mt: 10,
                mb: 2,
            }}>
            <ConsumptionRecap />
        </Box>
    )
}

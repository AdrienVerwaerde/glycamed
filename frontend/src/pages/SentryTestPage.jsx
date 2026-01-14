import { Box, Typography } from "@mui/material";
import * as Sentry from "@sentry/react";

function ErrorButton() {
    return (
        <button
            onClick={() => {
                try {
                    throw new Error("This is your first error!");
                } catch (error) {
                    Sentry.captureException(error);
                    throw error;
                }
            }}
            style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#ff4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "20px"
            }}
        >
            Break the world
        </button>
    );
}

export default function SentryTestPage() {
    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                color: "white",
            }}
        >
            <Typography variant="h4">Test Intégration Sentry</Typography>
            <Typography variant="body1">
                Cliquez sur le bouton ci-dessous pour déclencher une erreur fictive qui sera capturée par Sentry.
            </Typography>
            <ErrorButton />
        </Box>
    );
}

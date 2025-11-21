import { createContext, useContext, useState } from "react";
import { Snackbar, Alert, Stack } from "@mui/material";

const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
    const [snackbars, setSnackbars] = useState([]);

    const showSnackbar = (message, severity = "info") => {
        const id = Date.now(); // Unique ID for each snackbar
        setSnackbars((prev) => [...prev, { id, message, severity, open: true }]);
    };

    const handleClose = (id) => {
        setSnackbars((prev) =>
            prev.map((snackbar) =>
                snackbar.id === id ? { ...snackbar, open: false } : snackbar
            )
        );

        // Remove from array after animation completes
        setTimeout(() => {
            setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id));
        }, 300);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}

            {/* Stack multiple snackbars vertically */}
            <Stack
                spacing={1}
                sx={{
                    position: "fixed",
                    top: 16,
                    right: 16,
                    zIndex: 9999,
                    maxWidth: 400,
                }}
            >
                {snackbars.map((snackbar) => (
                    <Snackbar
                        key={snackbar.id}
                        open={snackbar.open}
                        autoHideDuration={6000}
                        onClose={() => handleClose(snackbar.id)}
                        // Remove default positioning, use Stack instead
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        sx={{ position: "relative", top: 0, right: 0 }}
                    >
                        <Alert
                            onClose={() => handleClose(snackbar.id)}
                            severity={snackbar.severity}
                            variant="filled"
                            sx={{ width: "100%" }}
                        >
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                ))}
            </Stack>
        </SnackbarContext.Provider>
    );
}

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackbar must be used within SnackbarProvider");
    }
    return context;
};

"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Snackbar, Alert, type AlertColor } from "@mui/material";

interface AlertState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface AlertContextValue {
  showAlert: (message: string, severity?: AlertColor) => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showAlert = useCallback((message: string, severity: AlertColor = "success") => {
    setAlert({ open: true, message, severity });
  }, []);

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ zIndex: (theme) => theme.zIndex.tooltip + 1 }}
      >
        <Alert
          onClose={handleClose}
          severity={alert.severity}
          variant="filled"
          elevation={6}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}

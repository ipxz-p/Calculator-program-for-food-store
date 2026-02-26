"use client";

import { useEffect } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 2,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main" }} />
        <Typography variant="h5" fontWeight={700} color="text.primary">
          Error Occurred
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sorry, an error occurred that was not expected. Please try again.
        </Typography>
        <Button variant="contained" size="large" onClick={reset} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    </Container>
  );
}

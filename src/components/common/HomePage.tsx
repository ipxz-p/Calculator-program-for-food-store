"use client";

import { useState } from "react";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { CartPanel } from "@/features/cart/components/CartPanel";
import { MenuGrid } from "@/features/menu/components/MenuGrid";
import { Header } from "@/components/layout/Header";
import { Box, Container, Paper } from "@mui/material";

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Header onCartOpen={() => setCartOpen(true)} />

      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: { xs: 3, lg: 4 },
          display: "flex",
          gap: 3,
        }}
      >
        <Box component="main" sx={{ flexGrow: 1, pb: { xs: 10, lg: 0 } }}>
          <MenuGrid />
        </Box>

        <Box
          component="aside"
          sx={{
            display: { xs: "none", lg: "block" },
            width: 384,
            flexShrink: 0,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              position: "sticky",
              top: 88,
              height: "calc(100vh - 88px - 24px)",
              overflow: "hidden",
              borderRadius: 1,
              border: 1,
              borderColor: "divider",
            }}
          >
            <CartPanel />
          </Paper>
        </Box>
      </Container>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </Box>
  );
}

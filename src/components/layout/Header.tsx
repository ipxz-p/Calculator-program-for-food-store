"use client";

import { useCartStore, selectTotalItems } from "@/features/cart/store/useCartStore";
import {
  AppBar,
  Toolbar,
  Typography,
  Badge,
  IconButton,
  Box,
  Container,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

interface HeaderProps {
  onCartOpen: () => void;
}

export function Header({ onCartOpen }: HeaderProps) {
  const totalItems = useCartStore(selectTotalItems);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", py: 1 }}>
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="text.primary"
              sx={{ lineHeight: 1.2, letterSpacing: "-0.025em" }}
            >
              Calculator program for food store
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={onCartOpen}
              sx={{
                display: { lg: "none" },
                bgcolor: "grey.100",
                "&:hover": { bgcolor: "grey.200" },
              }}
            >
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCartOutlinedIcon color="action" />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

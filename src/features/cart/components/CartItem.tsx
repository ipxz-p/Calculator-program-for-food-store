"use client";

import { useMenu } from "@/features/menu/providers/MenuProvider";
import { useCartStore } from "../store/useCartStore";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { formatPrice } from "@/lib/format";

interface CartItemProps {
  menuItemId: string;
  quantity: number;
}

export function CartItemRow({ menuItemId, quantity }: CartItemProps) {
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const { itemsMap } = useMenu();
  const menuItem = itemsMap.get(menuItemId);

  if (!menuItem) return null;

  const lineTotal = menuItem.price * quantity;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
        p: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 40,
          width: 40,
          borderRadius: 1,
          overflow: "hidden",
          backgroundColor: 'grey.100',
        }}
      ></Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          fontWeight="bold"
          color="text.primary"
          noWrap
        >
          {menuItem.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatPrice(menuItem.price)} / set
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          size="small"
          onClick={() => removeItem(menuItemId)}
          color="default"
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" fontWeight="bold">
          {quantity}
        </Typography>
        <IconButton
          size="small"
          onClick={() => addItem(menuItemId)}
          color="primary"
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography
        variant="body2"
        fontWeight={700}
        color="text.primary"
        sx={{ minWidth: 50, textAlign: "right" }}
      >
        {formatPrice(lineTotal)}
      </Typography>
    </Box>
  );
}

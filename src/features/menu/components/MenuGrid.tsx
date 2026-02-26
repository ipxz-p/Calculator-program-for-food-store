"use client";

import { useMenu } from "../providers/MenuProvider";
import { MenuCard } from "./MenuCard";
import { Grid, Box } from "@mui/material";

export function MenuGrid() {
  const { items } = useMenu();

  return (
    <Box component="section">
      <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
        {items.map((item) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item.id}>
            <MenuCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

"use client";

import { useCartStore } from "../store/useCartStore";
import { Box, Typography } from "@mui/material";
import { formatPrice } from "@/lib/format";

function SkeletonLine({ wide = false }: { wide?: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
      <Box sx={{ height: 16, borderRadius: 1, bgcolor: 'grey.200', animation: 'pulse 1.5s ease-in-out infinite', width: wide ? 160 : 112 }} />
      <Box sx={{ height: 16, width: 64, borderRadius: 1, bgcolor: 'grey.200', animation: 'pulse 1.5s ease-in-out infinite' }} />
    </Box>
  );
}

export function CartSummary() {
  const priceBreakdown = useCartStore((s) => s.priceBreakdown);
  const isCalculating = useCartStore((s) => s.isCalculating);
  const { subtotal, discounts, total } = priceBreakdown;

  if (isCalculating) {
    return (
      <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 2 }}>
        <SkeletonLine />
        <SkeletonLine wide />
        <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 1.5, mt: 1.5 }}>
          <SkeletonLine wide />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary" fontWeight="medium">
          Subtotal
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight="medium">
          {formatPrice(subtotal)}
        </Typography>
      </Box>

      {discounts.map((discount) => (
        <Box key={discount.kind} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="error.dark" fontWeight="bold">
            {discount.name}
          </Typography>
          <Typography variant="body2" color="error.dark" fontWeight="bold">
            -{formatPrice(discount.amount)}
          </Typography>
        </Box>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: 1, borderColor: 'divider', pt: 1.5, mt: 0.5 }}>
        <Typography variant="h6" fontWeight="black" color="primary.dark">
          Total
        </Typography>
        <Typography variant="h6" fontWeight="black" color="primary.dark">
          {formatPrice(total)}
        </Typography>
      </Box>
    </Box>
  );
}

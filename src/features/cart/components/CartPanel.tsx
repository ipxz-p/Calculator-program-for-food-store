"use client";

import { useShallow } from "zustand/shallow";
import { useCartStore, selectTotalItems } from "../store/useCartStore";
import { CartItemRow } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { Box, Typography, Button, CircularProgress, FormControlLabel, Switch } from "@mui/material";
import { useAlert } from "@/providers/AlertProvider";
import { formatPrice } from "@/lib/format";

export function CartPanel() {
  const { items, isMember, priceBreakdown, isCalculating } = useCartStore(
    useShallow((s) => ({
      items: s.items,
      isMember: s.isMember,
      priceBreakdown: s.priceBreakdown,
      isCalculating: s.isCalculating,
    }))
  );
  const totalItems = useCartStore(selectTotalItems);
  const toggleMember = useCartStore((s) => s.toggleMember);
  const clearCart = useCartStore((s) => s.clearCart);
  const { showAlert } = useAlert();

  const handleCheckout = async () => {
    try {
      showAlert("Order placed successfully!", "success");
      clearCart();
    } catch (error) {
      console.error(error);
      showAlert("Failed to place order. Please try again.", "error");
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider', p: 2.5 }}>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Order Summary
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {totalItems} set
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
        {totalItems === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Add items from the menu to start your order
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((item) => (
              <CartItemRow
                key={item.menuItemId}
                menuItemId={item.menuItemId}
                quantity={item.quantity}
              />
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50', p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={<Switch checked={isMember} onChange={toggleMember} size="small" />}
          label="Use Member Card (10% off)"
        />

        {totalItems > 0 && (
          <>
            <CartSummary />

            {isCalculating ? (
              <Button
                variant="contained"
                disabled
                fullWidth
                sx={{ py: 1.5, borderRadius: 3, bgcolor: 'primary.light' }}
              >
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Calculating...
              </Button>
            ) : (
              <Button 
                variant="contained" 
                fullWidth 
                disableElevation
                onClick={handleCheckout}
                sx={{ py: 1.5, borderRadius: 3, fontSize: '1rem' }}
              >
                Checkout — {formatPrice(priceBreakdown.total)}
              </Button>
            )}
          </>
        )}
      </Box>

    </Box>
  );
}

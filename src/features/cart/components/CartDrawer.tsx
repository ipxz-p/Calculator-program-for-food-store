"use client";

import { useCartStore, selectTotalItems } from "../store/useCartStore";
import { CartPanel } from "./CartPanel";
import { Drawer, Box, IconButton, Typography, Button, CircularProgress } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { formatPrice } from "@/lib/format";

interface CartDrawerProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function CartDrawer({ open, onOpen, onClose }: CartDrawerProps) {
  const totalItems = useCartStore(selectTotalItems);
  const priceBreakdown = useCartStore((s) => s.priceBreakdown);
  const isCalculating = useCartStore((s) => s.isCalculating);

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { width: '100%', maxWidth: 400, bgcolor: 'background.paper' }
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            bgcolor: 'grey.100',
            '&:hover': { bgcolor: 'grey.200' }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <CartPanel />
      </Drawer>

      {!open && totalItems > 0 && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 30,
            display: { xs: 'block', lg: 'none' }
          }}
        >
          <Button
            onClick={onOpen}
            fullWidth
            variant="contained"
            disableElevation
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 3,
              py: 2,
              borderRadius: 0,
              bgcolor: 'primary.main',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  width: 28, 
                  height: 28, 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  borderRadius: '50%', 
                  bgcolor: 'white', 
                  color: 'primary.main', 
                  fontWeight: 'bold', 
                  fontSize: '0.875rem',
                }}
              >
                {totalItems}
              </Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ textTransform: 'none' }}>
                View Cart
              </Typography>
            </Box>
            
            {isCalculating ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                <Typography variant="subtitle1" fontWeight="bold">...</Typography>
              </Box>
            ) : (
              <Typography variant="h6" fontWeight="900" sx={{ lineHeight: 1 }}>
                {formatPrice(priceBreakdown.total)}
              </Typography>
            )}
          </Button>
        </Box>
      )}
    </>
  );
}

import { useCartStore, selectItemQuantity } from "@/features/cart/store/useCartStore";
import { MenuItem } from "../types";
import { Card, CardContent, Typography, Button, IconButton, Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { formatPrice } from "@/lib/format";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const quantity = useCartStore(selectItemQuantity(item.id));

  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        backgroundColor: 'white',
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 2.5 } }}>
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 160, 
            width: '100%', 
            borderRadius: 1, 
            overflow: 'hidden', 
            mb: 2,
            backgroundColor: 'grey.100',
          }}
        >
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" color="text.primary" noWrap>
            {item.name}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.description}
        </Typography>

        <Box sx={{ mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="h5" fontWeight="900" color="primary.dark" sx={{ mb: 1.5 }}>
            {formatPrice(item.price)}
          </Typography>

          <Box sx={{ height: 42 }}>
            {quantity > 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => removeItem(item.id)}
                  sx={{ border: 1, borderColor: 'primary.main' }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" fontWeight="bold" color="primary.dark">
                  {quantity}
                </Typography>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => addItem(item.id)}
                  sx={{ border: 1, borderColor: 'primary.main' }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="contained"
                fullWidth
                startIcon={<ShoppingCartIcon />}
                onClick={() => addItem(item.id)}
                disableElevation
                sx={{ height: '100%', borderRadius: 3 }}
              >
                Add to cart
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/lib/theme';
import { AlertProvider } from '@/providers/AlertProvider';
import { MenuProvider } from '@/features/menu/providers/MenuProvider';
import { getMenuItems } from '@/features/menu/actions';
import "./globals.css";

export const metadata: Metadata = {
  title: "Calculator program for food store",
  description:
    "Order from our 7 food sets",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems = await getMenuItems();

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AlertProvider>
              <MenuProvider items={menuItems}>
                {children}
              </MenuProvider>
            </AlertProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

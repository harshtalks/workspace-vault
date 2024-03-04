import "@ui/styles/globals.css";
import ThemeLayout from "./theme-layout";
import { ThemeProvider } from "@/app/theme-providers";
import StoreProvider from "./store-provider";
import NextTopLoader from "nextjs-toploader";
import QueryProvider from "./query-provider";
import { ClientSessionProvider } from "./session-provider";
import { validateRequest } from "@/lib/auth/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, session } = await validateRequest();

  return (
    <html lang="en" suppressContentEditableWarning>
      <ClientSessionProvider initialData={{ user, session }}>
        <head />
        <body>
          <NextTopLoader
            color="#91C499"
            initialPosition={0.08}
            crawlSpeed={200}
            height={5}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
          />
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ThemeLayout>
                <StoreProvider>{children}</StoreProvider>
              </ThemeLayout>
            </ThemeProvider>
          </QueryProvider>
        </body>
      </ClientSessionProvider>
    </html>
  );
}

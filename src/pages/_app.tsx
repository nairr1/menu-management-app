import { type AppType } from "next/app";

import { Provider as JotaiProvider } from "jotai";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";

import { api } from "~/utils/api";

import "~/styles/globals.css";


const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <JotaiProvider>
        <ThemeProvider enableSystem={true} attribute='class'>
          <Component {...pageProps} />
        </ThemeProvider>
      </JotaiProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

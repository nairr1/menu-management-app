import { type AppType } from "next/app";

import { Provider as JotaiProvider } from "jotai";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <JotaiProvider>
        <Component {...pageProps} />
      </JotaiProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

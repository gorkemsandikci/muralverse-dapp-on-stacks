"use client";

import theme from "@/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { DevnetWalletProvider } from "../DevnetWalletProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HiroWalletProvider } from "../HiroWalletProvider";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <HiroWalletProvider>
          <DevnetWalletProvider>{children}</DevnetWalletProvider>
        </HiroWalletProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

import { http, createConfig } from "wagmi";
import { polygonAmoy } from "wagmi/chains";

export const config = createConfig({
  chains: [polygonAmoy],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [polygonAmoy.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

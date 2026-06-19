import type { HikeProvider } from "../../types";
import { coordinateFirstHikeProvider } from "./coordinateFirstHikeProvider";
import { FallbackHikeProvider } from "./fallbackHikeProvider";
import { localHikeProvider } from "./localHikeProvider";
import { mockApiHikeProvider } from "./mockApiHikeProvider";

const providerWithFallback: HikeProvider = new FallbackHikeProvider(
  mockApiHikeProvider,
  localHikeProvider
);

export const defaultHikeProvider: HikeProvider = new FallbackHikeProvider(
  coordinateFirstHikeProvider,
  providerWithFallback
);

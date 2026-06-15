import type { HikeProvider } from "../../types";
import { FallbackHikeProvider } from "./fallbackHikeProvider";
import { localHikeProvider } from "./localHikeProvider";
import { mockApiHikeProvider } from "./mockApiHikeProvider";

export const defaultHikeProvider: HikeProvider = new FallbackHikeProvider(
  mockApiHikeProvider,
  localHikeProvider
);

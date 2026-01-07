import { ReactNode } from "react";
import { GameProvider } from "@/app/providers/GameProvider";

export default function IncrementalGameApp({ children }: { children?: ReactNode }) {
  return (
    <GameProvider>
      {children}
    </GameProvider>
  );
}
import type { Metadata } from "next";
import GameClient from "./game-client";

export const metadata: Metadata = {
  title: "Arcana RNG — Invocação Mística",
  description: "Colecione personagens arcanos, descubra raridades e expanda seu poder.",
};

export default function Home() {
  return <GameClient />;
}

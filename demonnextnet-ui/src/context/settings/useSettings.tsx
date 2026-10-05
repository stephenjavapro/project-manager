import { useContext } from "react";
import { SettingsContext } from "./SettingsContext";
import { SettingsContextType } from "./types";

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within a SettingsProvider");
  return context;
}
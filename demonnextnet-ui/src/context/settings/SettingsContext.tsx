"use client";

import { createContext, useEffect, useState } from "react";
import { UserSettings } from "@/types";
import { getUserSettings, updateUserSettings } from "@/lib/api";
import { SettingsContextType } from "./types";

export const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserSettings()
      .then(setSettings)
      .finally(() => setIsLoading(false));
  }, []);

  async function updateSettings(data: Omit<UserSettings, "id">) {
    const updated = await updateUserSettings(data);
    setSettings(updated);
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}
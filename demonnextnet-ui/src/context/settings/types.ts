import { UserSettings } from "@/types";

export interface SettingsContextType {
  settings: UserSettings | null;
  updateSettings: (data: Omit<UserSettings, "id">) => Promise<void>;
  isLoading: boolean;
}
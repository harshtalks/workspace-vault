import { atom } from "recoil";

export type DashboardTab = "overview" | "add-new-file" | "files" | "settings";

export const dashboardTab = atom<DashboardTab>({
  key: "dashboardTab", // unique ID (with respect to other atoms/selectors)
  default: "overview", // default value (aka initial value)
});

export const VIEW_DAY = "Day view";
export const VIEW_WEEK = "Week view";

export const VIEWS = [VIEW_DAY, VIEW_WEEK] as const;
export type ViewType = (typeof VIEWS)[number];

import {
  VIEW_WEEK,
  ViewType,
} from "@/components/common/timetable/timetableConstants";

export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

export const formatTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatDate = (date: Date, view: ViewType): string => {
  if (view === VIEW_WEEK) {
    return getYearAsText(date);
  }

  const [month, year] = getYearAsText(date).split(" ");
  return `${month} ${getDateNumber(date)}, ${year}`;
};

export const getYearAsText = (time: Date): string => {
  return time.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
};

export const getDayAsText = (time: Date): string => {
  return time.toLocaleDateString(undefined, {
    weekday: "long",
  });
};

export const getDateNumber = (time: Date): string => {
  return time.toLocaleDateString(undefined, {
    day: "2-digit",
  });
};

import {
  VIEW_WEEK,
  ViewType,
} from "@/components/common/timetable/timetableConstants";

export const timeToMinutes = (date: Date): number => {
  return date.getHours() * 60 + date.getMinutes();
};

export const formatTime = (date: Date): string => {
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

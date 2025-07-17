export const formatDateTo21May2025 = (date: Date | string) => {
  const processedDate = typeof date === "string" ? new Date(date) : date;

  return processedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateTo21May2025at = (date: Date | string) => {
  const processedDate = typeof date === "string" ? new Date(date) : date;

  return processedDate.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    month: "short",
    day: "numeric",
  });
};

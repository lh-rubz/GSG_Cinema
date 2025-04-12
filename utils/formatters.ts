import { Preferences } from "@/context/PreferencesContext";
export const formatCurrency = (amount: number, currency: Preferences['currency']) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });
  return formatter.format(amount);
};

export const formatTime = (
    timeString: string,
    format: "12-hour" | "24-hour" = "12-hour"
  ): string => {
    // Basic validation
    if (!timeString || !timeString.includes(":")) {
      return "Invalid time format";
    }
  
    // Return as-is for 24-hour format
    if (format === "24-hour") {
      return timeString;
    }
  
    // Convert to 12-hour format
    const [hoursStr, minutesStr, secondsStr] = timeString.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = minutesStr || "00";
  
    // Validate hours (0-23)
    if (hours < 0 || hours > 23 || isNaN(hours)) {
      return "Invalid time";
    }
  
    // Calculate 12-hour time
    const period = hours >= 12 ? "PM" : "AM";
    const twelveHour = hours % 12 || 12; // Convert 0 to 12
  
    // Format with optional seconds
    const timePart = `${twelveHour}:${minutes.padStart(2, "0")}`;
    const secondsPart = secondsStr ? `:${secondsStr.padStart(2, "0")}` : "";
  
    return `${timePart}${secondsPart} ${period}`;
  };
export const formatDuration = (duration: number, format: Preferences['durationFormat']) => {
  if (format === "hours") {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  }
  return `${duration} minutes`;
};
import { Preferences } from "@/context/PreferencesContext";
export const formatCurrency = (amount: number, currency: 'USD' | 'NIS'): string => {
    // Fixed exchange rate (NIS to USD)
    const EXCHANGE_RATE = 3.5;
    
    // Convert to USD if needed
    const displayAmount = currency === 'USD' 
      ? amount / EXCHANGE_RATE 
      : amount;
  
    // Round to 2 decimal places
    const roundedAmount = Math.round(displayAmount * 100) / 100;
    
    // Split into whole and decimal parts
    const [wholePart, decimalPart = '00'] = roundedAmount.toString().split('.');
    
    // Format with thousands separators and ensure 2 decimal places
    const formattedWhole = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formattedDecimal = decimalPart.padEnd(2, '0').slice(0, 2);
    
    // Add currency symbol
    return currency === 'USD' 
      ? `$${formattedWhole}.${formattedDecimal}`
      : `${formattedWhole}.${formattedDecimal}₪`;
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
  export const formatDuration = (duration: number, format: "MINUTES_ONLY" | "HOURS_AND_MINUTES"): string => {
    // First validate the duration is a positive number
    if (typeof duration !== 'number' || duration < 0) {
      console.warn(`Invalid duration value: ${duration}`);
      return 'Invalid duration';
    }
  
    // Handle hours and minutes format
    if (format === "HOURS_AND_MINUTES") {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      
      // Only show hours if they exist
      if (hours > 0) {
        // Don't show minutes if they're 0
        return minutes > 0 
          ? `${hours}h ${minutes}m` 
          : `${hours}h`;
      }
      // If no hours, just show minutes
      return `${minutes}m`;
    }
  
    // Default minutes-only format
    return `${duration} min`;
  };
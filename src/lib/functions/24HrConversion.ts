export function convertTimeTo24Hour(timeString: string) {
    const regex = /^(1[0-2]|[1-9]):([0-5][0-9])(AM|PM|am|pm)?$/i;
    const match = timeString.match(regex);
  
    if (!match) {
      return "Invalid time format"; // Handle invalid input
    }
  
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const period = match[3] ? match[3].toUpperCase() : null; // AM or PM
  
    if (period) {
      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0; // Midnight (12 AM) is 0 in 24-hour format
      }
    } else if (hours < 1 || hours > 12) {
      return "Invalid time format (hours out of range)";
    }
  
    // Pad hours with a leading zero if necessary
    const formattedHours = hours < 10 ? "0" + hours : String(hours);
  
    return `${formattedHours}:${minutes}`;
  }

  
export function convertTo24Hour(time: any) {
    const [timePart, modifier] = time.split(/(am|pm)/i);
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier.toLowerCase() === 'pm' && hours < 12) {
      hours += 12;
    }
    if (modifier.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}`;
  }

  
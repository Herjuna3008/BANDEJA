/**
 * Generate hourly time slot strings for a booking.
 * e.g. startTime="08:00", duration=2 → ["08:00", "09:00"]
 */
export function getBookingTimeSlots(startTime: string, duration: number): string[] {
  const [h, m] = startTime.split(":").map(Number);
  return Array.from({ length: duration }, (_, i) => {
    const hour = (h + i).toString().padStart(2, "0");
    return `${hour}:${m.toString().padStart(2, "0")}`;
  });
}

/**
 * Formats a date string or Date object to mm/dd/yyyy format
 * @param date - Date string or Date object
 * @returns Formatted date string in mm/dd/yyyy format
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: 'numeric' 
  })
}

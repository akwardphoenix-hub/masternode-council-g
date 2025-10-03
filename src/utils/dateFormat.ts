/**
 * Formats a date string or Date object to a human-readable format
 * Example: "Oct 3, 2025, 1:23 PM"
 * 
 * @param dateInput - ISO date string or Date object
 * @returns Formatted date string or "Invalid Date" if parsing fails
 */
export function formatDateTime(dateInput: string | Date): string {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }
    
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

/**
 * Formats a date string or Date object to just the date
 * Example: "Oct 3, 2025"
 * 
 * @param dateInput - ISO date string or Date object
 * @returns Formatted date string or "Invalid Date" if parsing fails
 */
export function formatDate(dateInput: string | Date): string {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

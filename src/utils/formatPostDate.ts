// Dates in front matter are calendar dates. Format them in UTC so the server
// and every visitor's browser show the same day.
export function formatPostDate(value: string | Date | undefined) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

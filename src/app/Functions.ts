// --------------------------------------------------------------
// For global functions
// --------------------------------------------------------------

export function parseDateFromString(dateString: string) {
    const formattedDateString = dateString.replace(
        /(\d+) (\w+) (\d+)/,
        '$2 $1, $3'
    )
    return new Date(formattedDateString)
}

export function formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }
    return new Intl.DateTimeFormat('en-GB', options).format(date)
}

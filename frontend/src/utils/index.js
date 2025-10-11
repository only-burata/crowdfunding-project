export function getDaysLeft({startDate, durationIndays}) {
    const daysLeft = Math.ceil(new Date(startDate)/(1000*60*60*24)) + durationIndays - Date.now()
   return Math.ceil(( new Date(startDate) - Date.now())/(1000*60*60*24)) + durationIndays
}

export function getBarPercentage(goal, raised){
    return ((raised/goal) * 100)
}
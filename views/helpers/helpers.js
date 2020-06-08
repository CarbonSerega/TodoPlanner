function dateConverter(date) {
    const now = new Date();
    const difference = now - date;
    const resultInSeconds = Math.round(difference / (10**3))
    if(resultInSeconds < 60) return resultInSeconds + ' sec'

    const resultInMinutes =  Math.round(difference / (60*(10**3)));
    if(resultInMinutes < 60) return resultInMinutes + ' min'

    const resultInHours =  Math.round(difference / (3600*(10**3)));
    if(resultInHours < 24) return resultInHours + ' hours'
}

function currentDay() {

    return new Date().toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

module.exports = {dateConverter, currentDay}
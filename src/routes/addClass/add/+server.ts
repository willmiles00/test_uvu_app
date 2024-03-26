import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
dotenv.config();
import clientPromise from '$lib/mongodb/mongodb.client'
import { addColor } from './backgroundColors'


// based on the frequency, it will convert the event into multiple objects
function convertToMultipleObjects(newEvent: any) {
    const frequencyMapping = {
        'MTWR': 4,
        'MWF': 3,
        'TR': 2,
        'MW': 2,
    }

    const numberOfDuplicates = frequencyMapping[newEvent.frequency]

    let events 
    if (numberOfDuplicates) {
        events = Array.from(newEvent.frequency).map(frequency => ({...newEvent, frequency, days: numberOfDuplicates}));
        
    }
    return events
}


// based on the semester and frequency it will be converted to start and end times
function convertTime(newObjects: any) {
    const year = new Date().getFullYear()

    let fall = [
		{M: `${year}-08-21`},
		{T: `${year}-08-22`},
		{W: `${year}-08-23`},
		{R: `${year}-08-24`},
		{F: `${year}-08-25`},
		// {MWF: `${year}-08-21,${year}-08-23,${year}-08-25`},
		// {MW: `${year}-08-21,${year}-08-23`},
		// {TR: `${year}-08-22,${year}-08-24`},
		// {MTWR: `${year}-08-21,${year}-08-22,${year}-08-23,${year}-08-24`},
	]
	
	let spring = [
		{M: `${year}-01-08`},
		{T: `${year}-01-09`},
		{W: `${year}-01-10`},
		{R: `${year}-01-11`},
		{F: `${year}-01-12`},
		// {MWF: `${year}-01-08,${year}-01-10,${year}-01-12`},
		// {MW: `${year}-01-08,${year}-01-10`},
		// {TR: `${year}-01-09,${year}-01-11`},
		// {MTWR: `${year}-01-08,${year}-01-09,${year}-01-10,${year}-01-11`},
	]
	
	let summer = [
		{M: `${year}-05-08`},
		{T: `${year}-05-09`},
		{W: `${year}-05-10`},
		{R: `${year}-05-11`},
		{F: `${year}-05-12`},
		// {MWF: `${year}-05-08,${year}-05-10,${year}-05-12`},
		// {MW: `${year}-05-08,${year}-05-10`},
		// {TR: `${year}-05-09,${year}-05-11`},
		// {MTWR: `${year}-05-08,${year}-05-09,${year}-05-10,${year}-05-11`},
	]

    newObjects = newObjects.map((obj: any) => {
        let semester: any

        if (obj.semester === 'Fall') {
            semester = fall;
        } else if (obj.semester === 'Spring') {
            semester = spring;
        } else if (obj.semester === 'Summer') {
            semester = summer;
        }

        const dateObj = semester.find((s: any) => Object.keys(s)[0] === obj.frequency);
        if (dateObj) {
            return {...obj, start: Object.values(dateObj)[0], end: Object.values(dateObj)[0]};
        }
        return obj;
    });
    

    addTime(newObjects)
    return newObjects
}

function addTime(newObjects: any) {
    
    let allTimes = newObjects.map((obj: any) => {
        let times = obj.time
        let [time, meridiem] = times.split(' ')
        let [hours, minutes] = time.split(':')
        // return time
        
        if (meridiem === 'pm' && hours === '12') {
            hours = 12
        } else if (meridiem === 'pm') {
            hours = parseInt(hours) + 12
        } else if (meridiem === 'am' && hours === '12') {
            hours = 0
        } else if (meridiem === 'am') {
            hours = parseInt(hours)
        }

        let isoStartH
        let isoStartM
        let isoEndH
        let isoEndM
        if (obj.days === 2) {
            isoStartH = hours
            isoStartM = parseInt(minutes)
            isoEndH = hours + 1
            isoEndM = parseInt(minutes) + 15
        } else if (obj.days === 3 || obj.days === 4) {
            isoStartH = hours
            isoStartM = parseInt(minutes)
            isoEndH = hours
            isoEndM = parseInt(minutes) + 50
        }
        
        // console.log(isoStartH, isoStartM, isoEndH, isoEndM)

        if (isoStartM < 10) {
            isoStartM = `0${isoStartM}`
        } 
        if (isoEndM < 10) {
            isoEndM = `0${isoEndM}`
        }
        if (isoStartH < 10) {
            isoStartH = `0${isoStartH}`
        }
        if (isoEndH < 10) {
            isoEndH = `0${isoEndH}`
        }
        obj.start = `${obj.start}T${isoStartH}:${isoStartM}:00`
        obj.end = `${obj.end}T${isoEndH}:${isoEndM}:00`
        
        // console.log(obj.time)
        // console.log(obj.start)
        // console.log(obj.end)
        // console.log(obj)
        // almost done, I just need to now add in conditioning if the ending time goes from am to pm
        return obj
    })
    // console.log(allTimes)
    newObjects = allTimes
    // console.log(newObjects)
    return newObjects
}

function cleanUpObjects(newObjects: any) {
    newObjects = newObjects.map((obj: any) => {
        obj = {
            title: {
                html: `<p>${obj.course}</p><p>${obj.className}</p><p>${obj.profName}<p><p>${obj.room}</p>`
            },
            instructor: obj.profName,
            course: obj.course,
            extendedProps: {
                building_room: obj.room
            },
            start: obj.start,
            end: obj.end,
            backgroundColor: obj.backgroundColor
        }
        return obj
    })
    // console.log(newObjects)
    return newObjects
}

export async function POST({request}) {
    const newEvent = await request.json()

    let newObjects = convertToMultipleObjects(newEvent)
    newObjects = convertTime(newObjects)

    newObjects = addColor(newObjects)

    newObjects = cleanUpObjects(newObjects)
    console.log(newObjects)
    
    // const client = await clientPromise
    // const db = client?.db('scheduleDB')
    // const collection = db?.collection('events')
    // await collection?.insertMany(newObjects)

    let message = {'success': "success"}
    return json(message)
}








    // console.log(newObjects)
    // console.log(convertedTime)

    
    // console.log(convertedTime)
    // let testData = [
    //     {
    //         className: "a",
    //         course: "DAGV 1300",
    //         days: 2,
    //         frequency: "T",
    //         profName: "a",
    //         room: "LIVE S",
    //         semester: "Spring",
    //         time: "9:00 pm",
    //         start: '2024-01-11',
    //         end: '2024-01-11'
    //     },
    //     {
    //         className: "a",
    //         course: "DAGV 1300",
    //         days: 2,
    //         frequency: "R",
    //         profName: "a",
    //         room: "LIVE S",
    //         semester: "Spring",
    //         time: "2:00 pm",
    //         start: '2024-01-11',
    //         end: '2024-01-11'
    //     }
    // ]



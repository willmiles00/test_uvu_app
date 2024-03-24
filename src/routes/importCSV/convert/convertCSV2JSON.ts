import csvParser from 'csv-parser';
// import { writeFile } from 'fs/promises';
import { format, parse } from 'date-fns';
import { Readable } from 'stream';

// const eventListPath = './data/FullEventList.json';
let yearSeason: string

type MyData = Record<string, any>;
const jsonArray: MyData[] = [];
let csvData: MyData[] = [];

let globalFileContents: Buffer | null = null

export async function convertCSV2JSON(fileContents: Buffer): Promise<void> {
  csvData.length = 0
//   console.log('Starting convertCSV2JSON...')

  await new Promise<void>((resolve, reject) => {
	const readStream = new Readable();
	readStream.push(fileContents); 
	readStream.push(null);
    readStream
      .pipe(csvParser())
      .on('data', (data) => jsonArray.push(data))
      .on('end', () => {
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });

  globalFileContents = fileContents
//   console.log('Finished convertCSV2JSON.')
}

async function writeJSON() {
  const modifiedArray: MyData[] = jsonArray.map((item) => {
    const modifiedObject: MyData = {};
    let counter = 1;
    for (const key in item) {
      modifiedObject[`_` + counter] = item[key];
      counter++;
    }
    return modifiedObject;
  });

  // Filter out objects with all empty property values
  const filteredArray = modifiedArray.filter((item) => {
    for (const key in item) {
      if (item[key] !== '') {
        return true;
      }
    }
    return false;
  });

  csvData = [...filteredArray]
//   console.log('csvData', csvData[0]._3)
	yearSeason = csvData[0]._3
}

export async function processFile(fileContents?: Buffer): Promise<Array<any>> {
//export async function processFile(fileContents?: Buffer): Promise<void> {
	const actualFileContents = fileContents || globalFileContents;
  
	if (actualFileContents) {
		await convertCSV2JSON(actualFileContents);
		await writeJSON();
	  
		const cleanedUpJson = cleanUpJSON();
		const theCleanedUpJSON = produceEventList(cleanedUpJson);

		const fullEventList = addColors(theCleanedUpJSON);
	  
		// await writeFile(eventListPath, JSON.stringify(fullEventList));
		// console.log("fulleventlist in processFile", fullEventList)

		// Clear the existing data
        jsonArray.length = 0;
        csvData.length = 0;
		
		return fullEventList
		
	} else {
		console.log('No file contents provided.');
		return []
	}
}

export async function simulateMain(fileContents?: Buffer): Promise<Array<any>> {
	process.env.MAIN = 'true'
	let fileResult = await processFile(fileContents)
	console.log('results in the simulateMain ', fileResult)
	const fileSeasonYear = yearSeason
	let result = [fileSeasonYear, fileResult]
    return result
}


function cleanUpJSON() {
	// console.log('Starting cleanUpJSON...')
  let currentCourseName = ''
  let currentCourseID = ''

  const cleanedData = csvData.flatMap((item, index) => {
      if (index > -1) {
        const keys: string[] = Object.keys(item)
        const values: string[] = Object.values(item)

        if (keys.length === 1 && values.length === 1) {
          currentCourseName = values[0];
          return;
        }

        const itemID = index;

        const newCourse = {
          id: itemID,
          courseID: currentCourseID,
          course_name: currentCourseName,
          course: item._8,
          instructor: item._16,
          section: replaceSpaceNParens(item._9),
          course_title: item._10,
          meeting_pattern: item._14,
          building_room: item._17.slice(0, 6),
        };
        return [newCourse];
      }
    })
    // .filter((item) => item !== undefined);
	// console.log('finishing cleanUpJSON...')
  return cleanedData;
}




function replaceSpaceNParens(str: string) {
	str = str.replace(/\s/g, ''); // remove all spaces
	str = str.replace(/\([^)]*\)/g, ''); // remove all contents between parens
	return str;
}



function produceEventList(data: any[]) {
	data.forEach((item, index) => {item.id = index})
	const eventList = data
		.flatMap((item) => {
			if (item.meeting_pattern === 'Does Not Meet') return
			const id = item.id
			const courseID = item.courseID
			// const title = {
			// 	html: `<p>${item.course}-${item.section}</p><p>${item.course_title}</p><p>${item.instructor}<p><p>${item.building_room}</p>`
			// }
			const title = {
				html: `<p>${item.course}</p><p>${item.course_title}</p><p>${item.instructor}<p><p>${item.building_room}</p>`
			}
			const instructor = item.instructor
			const section = item.section
			const course = item.course
			const extendedProps = { building_room: item.building_room };
			const { start } = convertTime(item.meeting_pattern);
			const { end } = convertTime(item.meeting_pattern);

			const multiDays = start.split(','); // check for multiple days
			const startTime = start.split('T')[1];
			const endTime = end.split('T')[1];
			//console.log(multiDays.length, startTime, endTime)

			let dayCounter = 0
			if (multiDays.length > 1) {
				//console.log(multiDays);
				const courseDays = multiDays.flatMap((day) => {
					const onlyTheDay = day.split('T')[0]
					const uniqueID = `${id}.${dayCounter}`
					dayCounter++
					const event = {
						id: uniqueID,
						courseID,
						title,
						instructor,
						section,
						course,
						extendedProps,
						start: onlyTheDay + 'T' + startTime,
						end: onlyTheDay + 'T' + endTime
					};
					return event;
				});
				return courseDays;
			} else {
				const event = {
					id,
					courseID,
					title,
					instructor,
					section,
					course,
					extendedProps,
					start,
					end
				}; 
				return event;
			}
		})
		.filter((item) => item !== undefined);
	return eventList;
	//console.log(eventList.filter((item) => item?.extendedProps?.building_room === 'CS 502'));
}


function convertTime(time: string) {
	const [year, season] = yearSeason.split(' ');
	const [days, startEndTimes] = time.split(' ');
	let semester: any
	// console.log(days)

	let fall = [
		{M: `${year}-08-21`},
		{T: `${year}-08-22`},
		{W: `${year}-08-23`},
		{R: `${year}-08-24`},
		{F: `${year}-08-25`},
		{MWF: `${year}-08-21,${year}-08-23,${year}-08-25`},
		{MW: `${year}-08-21,${year}-08-23`},
		{TR: `${year}-08-22,${year}-08-24`},
		{MTWR: `${year}-08-21,${year}-08-22,${year}-08-23,${year}-08-24`},
	]
	
	let spring = [
		{M: `${year}-01-08`},
		{T: `${year}-01-09`},
		{W: `${year}-01-10`},
		{R: `${year}-01-11`},
		{F: `${year}-01-12`},
		{MWF: `${year}-01-08,${year}-01-10,${year}-01-12`},
		{MW: `${year}-01-08,${year}-01-10`},
		{TR: `${year}-01-09,${year}-01-11`},
		{MTWR: `${year}-01-08,${year}-01-09,${year}-01-10,${year}-01-11`},
	]
	
	let summer = [
		{M: `${year}-05-08`},
		{T: `${year}-05-09`},
		{W: `${year}-05-10`},
		{R: `${year}-05-11`},
		{F: `${year}-05-12`},
		{MWF: `${year}-05-08,${year}-05-10,${year}-05-12`},
		{MW: `${year}-05-08,${year}-05-10`},
		{TR: `${year}-05-09,${year}-05-11`},
		{MTWR: `${year}-05-08,${year}-05-09,${year}-05-10,${year}-05-11`},
	]

	if (season === 'Fall') {
		semester = fall
	} else if (season === 'Spring') {
		semester = spring
	} else if (season === 'Summer') {
		semester = summer
	}

	// Find the object in the semester array that has the days key
    const dateObject = semester.find((obj) => obj.hasOwnProperty(days));

    // If the object exists, get the date
    let isoDate;
    if (dateObject) {
        isoDate = dateObject[days];
    }

	// let isoDate;

	// switch (days) {
	// 	case 'M':
	// 		isoDate = '2024-01-9'; // Monday
	// 		break;
	// 	case 'W':
	// 		isoDate = '2024-01-10'; // Wednesday
	// 		break;
	// 	case 'MW':
	// 		isoDate = '2024-01-08,2024-01-10'; // Monday and Wednesday
	// 		break;
	// 	case 'T':
	// 		isoDate = '2024-01-09'; // Tuesday
	// 		break;
	// 	case 'TR':
	// 		isoDate = '2024-01-09,2024-01-11'; // Tuesday and Thursday
	// 		break;
	// 	case 'R':
	// 		isoDate = '2024-01-11'; // Thursday
	// 		break;
	// 	case 'F':
	// 		isoDate = '2024-01-12'; // Friday
	// 		break;
	// 	case 'MTWR':
	// 		isoDate = '2024-01-08,2024-01-09,2024-01-10,2024-01-11'; // Monday, Tuesday, Wednesday, Thursday
	// 		break;
	// 	case 'MWF':
	// 		isoDate = '2024-01-08,2024-01-09,2024-01-10'; // Monday, Tuesday, Wednesday
	// 		break;
	// 	default:
	// 		isoDate = 'Invalid day'; // Invalid input
	// }

	const timeArray = startEndTimes.split('-');
	let startTime = convertHours(timeArray[0]);
	const start = `${isoDate}T${format(parse(startTime, 'h:mma', new Date()), 'HH:mm:ss')}`;

	let endTime = convertHours(timeArray[1]);
	const end = `${isoDate}T${format(parse(endTime, 'h:mma', new Date()), 'HH:mm:ss')}`;

	return { start, end};
}

function convertHours(timeStr: string) {
	timeStr = timeStr.toLowerCase().replace(/;$/, '');
	if (timeStr.includes('am') || timeStr.includes('pm')) {
		if (!timeStr.includes(':')) {
			// convert 1pm to 1:00pm for example
			timeStr = timeStr.replace('am', ':00am').replace('pm', ':00pm');
		}
	}
	return timeStr;
}


// once all the objects are created, add a random color to each object
function addColors(jsonList: any[]) {
	// console.log('Starting addColors...')
	const colors = [
		'#275D38',
		'#1e482c',
		'#00867d',
		'#095c8',
		'#595478',
		'#e15230',
		'#d45d00',
		'#095c8',
		'#00688c',
		'#004c48',
		'#4b3430',
		'#5b2924',
		'#b09747x'
	]

	return jsonList.map(obj => ({
        ...obj,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)]
    }));
}
		
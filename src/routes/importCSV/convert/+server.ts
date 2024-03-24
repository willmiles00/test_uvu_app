import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
dotenv.config();
import clientPromise from '$lib/mongodb/mongodb.client'
import { simulateMain } from './convertCSV2JSON'


export async function POST({request}) {
    const formData = await request.formData()


    const file = formData.get('file')
    if (file instanceof File) {
        const fileContents = await file.arrayBuffer()
        const buffer = Buffer.from(fileContents)
        let eventsYearSeason = await simulateMain(buffer)

        const [yearSeason, fullEventList] = eventsYearSeason
        const [year, season] = yearSeason.split(' ')
        const theYearAndSeason = {year: year, season: season}

        const client = await clientPromise
        const db = client?.db('scheduleDB')

        // const courseCollection = db?.collection('courseList')
        const eventsCollection = db?.collection('events')
        const yearSeasonCollection = db?.collection('yearSeason')

            // const courseListDocument = courseList
        const eventsDocument = fullEventList
        const yearSeasonDocument = theYearAndSeason

        await eventsCollection?.insertMany(eventsDocument)
        await yearSeasonCollection?.insertOne(yearSeasonDocument)
        // await courseCollection?.insertMany(courseListDocument)

        let message = {'success': "success"}
        return json(theYearAndSeason)
        // return json(fullEventList)
    } else {
        // Handle the case where file is not a File instance
        console.error('File is not a File instance')
    }
}













// const description = input.value;
// const response = await fetch('/todo', {
//     method: 'POST',
//     body: JSON.stringify({ description }),
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });

// export async function POST({ request, cookies }) {
// 	const { description } = await request.json();

// 	const userid = cookies.get('userid');
// 	const { id } = await database.createTodo({ userid, description });

// 	return json({ id }, { status: 201 });
// }
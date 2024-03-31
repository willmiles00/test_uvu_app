import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
dotenv.config();
import clientPromise from '$lib/mongodb/mongodb.client'


export async function POST({request}) {
    const newCourse = await request.json()

    const client = await clientPromise
    const db = client?.db('scheduleDB')
    const collection = db?.collection('courseList')
    await collection?.insertOne(newCourse)

    return json(newCourse)
}
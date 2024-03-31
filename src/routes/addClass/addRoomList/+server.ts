import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
dotenv.config();
import clientPromise from '$lib/mongodb/mongodb.client'


export async function POST({request}) {
    const newRoom = await request.json()

    const client = await clientPromise
    const db = client?.db('scheduleDB')
    const collection = db?.collection('roomsList')
    await collection?.insertOne(newRoom)

    return json(newRoom)
}
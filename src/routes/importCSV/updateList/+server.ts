import clientPromise from '$lib/mongodb/mongodb.client'
import { json } from '@sveltejs/kit'
import dotenv from 'dotenv'
dotenv.config()

export async function GET() {
    const client = await clientPromise
    const db = client?.db('scheduleDB')
    const collection = db?.collection('events')
    const result = await collection?.find().toArray()

    const message = 'This is the updateList endpoint'   
    return json(result)
    // return json(message)
}
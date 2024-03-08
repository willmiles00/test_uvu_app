import clientPromise from '$lib/mongodb/mongodb.client'
import { json } from '@sveltejs/kit'
import dotenv from 'dotenv'
dotenv.config()

export async function DELETE() {
    const client = await clientPromise
    const db = client?.db('scheduleDB')
    const collection = db?.collection('events')

    try {
        await collection?.deleteMany({})
        const message = { message: 'All events deleted' }
        return json(message)
    } catch (err) {
        return json({ message: err })
    }

}
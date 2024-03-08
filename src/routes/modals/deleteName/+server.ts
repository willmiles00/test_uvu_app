import clientPromise from '$lib/mongodb/mongodb.client'
import { json } from '@sveltejs/kit'
import dotenv from 'dotenv'
dotenv.config()

export async function DELETE() {
    const client = await clientPromise
    const db = client?.db('scheduleDB')
    const collection = db?.collection('fileName')

    try {
        await collection?.deleteMany({})
        const message = { message: 'file name deleted' }
        return json(message)
    } catch (err) {
        return json({ message: err })
    }

}
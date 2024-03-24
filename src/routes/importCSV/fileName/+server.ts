import clientPromise from '$lib/mongodb/mongodb.client'
import { json } from '@sveltejs/kit'
import dotenv from 'dotenv'
dotenv.config()

export async function POST({ request }) {
    const fileName = await request.json()

    const client = await clientPromise
    const db = client?.db('scheduleDB')
    const collection = db?.collection('fileName')
    const result = await collection?.insertOne( fileName )

    const message = 'success'

    return json({ message })
}
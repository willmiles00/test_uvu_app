import { MongoClient, ServerApiVersion } from "mongodb"

import dotenv from 'dotenv'
dotenv.config()

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
let clientPromise: Promise<MongoClient> | undefined

try {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true, deprecationErrors: true, 
        },
    })
    clientPromise = client.connect().then(() => {
        console.log('Successfully connected to MongoDB');
        return client;
    }).catch(e => {
        console.error('Failed to connect to MongoDB', e)
        throw e
    })
} catch (err) {
    console.error(err)
}

export default clientPromise
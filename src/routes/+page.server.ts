import clientPromise from '$lib/mongodb/mongodb.client'
import { ObjectId } from 'mongodb'

export async function load() {
    let client, events, name

    try {
        client = await clientPromise

        // grabs schedule database
        const db = client?.db("scheduleDB")

        // grabs the events collection and the fileName collection
        const collection = db?.collection("events")

        const collectionTwo = db?.collection("fileName")

        // grabs all the events from the events collection and converts it to an array
        const eventsArray = await collection?.find({}).toArray()

        // grabs the name from the fileName collection
        const nameGrab = await collectionTwo?.findOne({})

        // converts the object id to a string, and adds the image URL, and converts the bathrooms, price, security_deposit, extra_people, guests_included, and cleaning_fee to a float
        events = await Promise.all((eventsArray || []).map(async (event) => {
            return { 
                ...event, 
                _id: (event._id as ObjectId).toString()
            }
        }))

        name = nameGrab ? { ...nameGrab, _id: nameGrab._id.toString() } : null

    } catch(error) {
        console.log('failed to connect to MongoDB', error)
        
        // closes the client connection if there is an error and the client exists
        if (client) {
            await client.close()
        }
        return {
            status: 500,
            body: 'Failed to connect to MongoDB'
        }
    }

    return {
        // returns a 200 status code and the movie object
        status: 200,
        body: {
            events: events,
            name: name
        }
    }

}
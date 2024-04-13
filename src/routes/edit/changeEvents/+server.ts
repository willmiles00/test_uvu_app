import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
dotenv.config();
import clientPromise from '$lib/mongodb/mongodb.client'


export async function POST({request}) {
    const data = await request.json()

    const client = await clientPromise
    const db = client?.db('scheduleDB')
    const collection = db?.collection('events')

    let result

    if (data.type === 'className') {
        // const updatedClassNameProperties = await collection?.updateMany({className: data.oldName}, {$set: {className: data.newName}})

        const docs = await collection?.find({className: data.oldName}).toArray()

        for (const doc of docs) {
            doc.className = data.newName
            doc.title.html = doc.title.html.replace(`<p>${data.oldName}</p>`, `<p>${data.newName}</p>`)

            await collection?.updateOne({_id: doc._id}, {$set: doc})
        }
        result = await collection?.find({}).toArray()
    } 
    // if the edited section is the instructor name it will update all the events that have the old name with the new instructor name
    else if (data.type === 'instructor') {
        const docs = await collection?.find({instructor: data.oldName}).toArray()

        for (const doc of docs) {
            doc.instructor = data.newName
            doc.title.html = doc.title.html.replace(`<p>${data.oldName}<p>`, `<p>${data.newName}<p>`)
            await collection?.updateOne({_id: doc._id}, {$set: doc})
        }
        result = await collection?.find({}).toArray()
    } 
    // if the edited section is the course name it will update all the events that have the old name with the new course name
    else if (data.type === 'course') {
        const docs = await collection?.find({course: data.oldName}).toArray()

        for (const doc of docs) {
            doc.course = data.newName
            doc.title.html = doc.title.html.replace(`<p>${data.oldName}</p>`, `<p>${data.newName}</p>`)
            await collection?.updateOne({_id: doc._id}, {$set: doc})
        }
        result = await collection?.find({}).toArray()
    } 
    // if the edited section is the building name it will update all the events that have the old name with the new building name
    else if (data.type === 'room') {
        const docs = await collection?.find({'extendedProps.building_room': data.oldName}).toArray()

        for (const doc of docs) {
            doc.extendedProps.building_room = data.newName
            doc.title.html = doc.title.html.replace(`<p>${data.oldName}</p>`, `<p>${data.newName}</p>`)
            await collection?.updateOne({_id: doc._id}, {$set: doc})
        }
        result = await collection?.find({}).toArray()
    }
    // if the document contains all four property values it will be removed from the database
    else if (data.type === 'delete') {
        await collection?.deleteMany({
            $and: [
                {className: data.event.className},
                {instructor: data.event.instructor},
                {course: data.event.course},
                {'extendedProps.building_room': data.event.extendedProps.building_room}
            ]
        });
        result = await collection?.find({}).toArray()
        
        // result = data.event.className, data.event.instructor, data.event.course, data.event.extendedProps.building_room
    }

    return json(result)
}
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

    console.log(fileName)
    const message = 'success'

    return json({ message })
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
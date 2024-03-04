import { json } from '@sveltejs/kit'

export function GET() {
    const message = "Hello im a get request from the server!"

    return json(message)
}
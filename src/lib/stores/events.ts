import { writable } from 'svelte/store';

export const events = writable([
    {
        title: 'Event 1',
        start: '2024-11-07T01:00:00',
        end: '2024-11-07T02:00:00'
    },
]);
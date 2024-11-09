import { writable } from 'svelte/store';

export const events = writable([{
    title: 'event 2',
    start: '2024-11-08T04:00:00',
    end: '2024-11-08T06:00:00',
}]);
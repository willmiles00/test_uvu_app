import { writable } from 'svelte/store';
// type Course = {
//     name: string;
//     crn: string;
//     meetingTime: string;
//     instructor: string;
//     buildingRoom: string;
//   };
  


  export const events = writable<unknown[]>([]);
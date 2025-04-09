import { writable } from 'svelte/store';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    Instructor: string;
    Course: string;
    buildingAndRoom: string;
    days?: string[];
  };
}

export const events = writable<CalendarEvent[]>([]);
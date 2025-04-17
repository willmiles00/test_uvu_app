import { writable, derived } from 'svelte/store';
import { events, type CalendarEvent } from './events';

// Filter criteria stores
export const selectedInstructors = writable<string[]>([]);
export const selectedRooms = writable<string[]>([]);
export const selectedCourses = writable<string[]>([]);

// Create a derived store that automatically filters events based on criteria
export const filteredevents = derived(
  [events, selectedInstructors, selectedRooms, selectedCourses],
  ([$events, $selectedInstructors, $selectedRooms, $selectedCourses]) => {
    return $events.filter(event => {
      const matchesInstructor = $selectedInstructors.length === 0 || 
                               $selectedInstructors.includes(event.extendedProps.Instructor);
      const matchesRoom = $selectedRooms.length === 0 || 
                         $selectedRooms.includes(event.extendedProps.buildingAndRoom);
      const matchesCourse = $selectedCourses.length === 0 || 
                           $selectedCourses.includes(event.extendedProps.Course);
      
      return matchesInstructor && matchesRoom && matchesCourse;
    });
  }
);
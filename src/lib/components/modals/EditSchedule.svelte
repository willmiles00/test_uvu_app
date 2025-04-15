<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { events, type CalendarEvent } from '$lib/stores/events';

  export let isOpen = false;
  export let onClose: () => void;
  
  const dispatch = createEventDispatcher();

  // Track selected event for editing
  let selectedEvent: CalendarEvent | null = null;
  let editedEvent: CalendarEvent | null = null;
  // Group events by CRN
  let eventGroups: {[key: string]: CalendarEvent[]} = {};
  
  // Compute event groups when events store changes
  $: {
    eventGroups = {};
    $events.forEach(event => {
      const crn = event.extendedProps?.CRN || 'unknown';
      if (!eventGroups[crn]) {
        eventGroups[crn] = [];
      }
      eventGroups[crn].push(event);
    });
  }

  // Function to handle event selection by CRN
  function handleEventGroupSelect(crn: string) {
    // Get all events with this CRN
    const eventsInGroup = eventGroups[crn];
    if (eventsInGroup && eventsInGroup.length > 0) {
      // Use first event as the base for editing
      const baseEvent = { ...eventsInGroup[0] };
      
      // Create a combined event that contains info about all meeting days
      if (!baseEvent.extendedProps) baseEvent.extendedProps = {};
      baseEvent.extendedProps.days = eventsInGroup.map(event => {
        // Extract day name from the event's start date
        const date = new Date(event.start);
        const dayIndex = date.getDay();
        const days = ["SUN", "MON", "TUES", "WED", "THUR", "FRI", "SAT"];
        return days[dayIndex];
      });
      
      selectedEvent = baseEvent;
      editedEvent = { ...baseEvent };
    }
  }

  function handleEventChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    const crn = target.value;
    if (crn) handleEventGroupSelect(crn);
  }

  // Function to save changes
  function handleSave() {
    if (editedEvent) {
      // Apply changes to all events with the same CRN
      const crn = editedEvent.extendedProps?.CRN;
      events.update(currentEvents => {
        return currentEvents.map(event => {
          if (event.extendedProps?.CRN === crn) {
            // Update all events with this CRN
            const updatedEvent = { ...event };
            // Copy properties from editedEvent to each event with matching CRN
            updatedEvent.title = editedEvent.title;
            updatedEvent.extendedProps.Course = editedEvent.extendedProps.Course;
            updatedEvent.extendedProps.Instructor = editedEvent.extendedProps.Instructor;
            updatedEvent.extendedProps.buildingAndRoom = editedEvent.extendedProps.buildingAndRoom;
            
            // Time handling needs to maintain the specific day of each event
            // But update the hours and minutes
            if (typeof updatedEvent.start === 'string' && typeof editedEvent.start === 'string') {
              const originalDate = updatedEvent.start.split('T')[0];
              const newTime = editedEvent.start.split('T')[1];
              updatedEvent.start = `${originalDate}T${newTime}`;
            }
            
            if (typeof updatedEvent.end === 'string' && typeof editedEvent.end === 'string') {
              const originalDate = updatedEvent.end.split('T')[0];
              const newTime = editedEvent.end.split('T')[1];
              updatedEvent.end = `${originalDate}T${newTime}`;
            }
            
            return updatedEvent;
          }
          return event;
        });
      });
      onClose();
    }
  }

  // Function to delete event
  function handleDelete() {
    if (selectedEvent) {
      // Delete all events with the same CRN
      const crn = selectedEvent.extendedProps?.CRN;
      events.update(currentEvents => {
        return currentEvents.filter(event => event.extendedProps?.CRN !== crn);
      });
      selectedEvent = null;
      editedEvent = null;
      onClose();
    }
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
      <div class="bg-green-700 text-white p-4 text-center text-xl font-bold rounded-t-lg">
        EDIT SCHEDULE
      </div>
      
      <div class="p-6">
        <!-- Event Selection -->
        <div class="mb-6">
          <label class="block text-gray-700 font-medium mb-2">Select Event to Edit</label>
          <select 
            class="w-full border border-gray-300 rounded-md p-2"
            on:change={handleEventChange}
          >
            <option value="">Select a class...</option>
            {#each Object.entries(eventGroups) as [crn, eventsGroup]}
              <option value={crn}>
                {eventsGroup[0].extendedProps?.Course || 'Unknown'} (CRN: {crn})
              </option>
            {/each}
          </select>
        </div>

        {#if selectedEvent && editedEvent}
          <!-- Edit Form -->
          <form class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-medium">Title</label>
              <input
                type="text"
                bind:value={editedEvent.title}
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium">Instructor</label>
              <input
                type="text"
                bind:value={editedEvent.extendedProps.Instructor}
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium">Course</label>
              <input
                type="text"
                bind:value={editedEvent.extendedProps.Course}
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium">Room</label>
              <input
                type="text"
                bind:value={editedEvent.extendedProps.buildingAndRoom}
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

            <!-- Days Selection -->
            <div class="col-span-2">
              <label class="block text-gray-700 font-medium">Days</label>
              <div class="flex space-x-2 mt-1">
                {#each ["MON", "TUES", "WED", "THUR", "FRI", "SAT"] as day}
                <button
  type="button"
  class="px-4 py-2 rounded-md border {editedEvent.extendedProps.days?.includes(day) ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'}"
  on:click={() => {
    if (!editedEvent.extendedProps.days) editedEvent.extendedProps.days = [];
    const index = editedEvent.extendedProps.days.indexOf(day);
    if (index === -1) {
      // Create a new array with the day added
      editedEvent.extendedProps.days = [...editedEvent.extendedProps.days, day];
    } else {
      // Create a new array with the day removed
      editedEvent.extendedProps.days = editedEvent.extendedProps.days.filter(d => d !== day);
    }
  }}
>
  {day}
</button>
                {/each}
              </div>
            </div>

            <!-- Time Selection -->
            <div>
              <label class="block text-gray-700 font-medium">Start Time</label>
              <input
                type="time"
                bind:value={editedEvent.start}
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium">End Time</label>
              <input
                type="time"
                bind:value={editedEvent.end}
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

            <!-- Action Buttons -->
            <div class="col-span-2 flex justify-end space-x-4 mt-4">
              <button
                type="button"
                class="bg-red-600 text-white px-4 py-2 rounded-md"
                on:click={handleDelete}
              >
                Delete
              </button>
              <button
                type="button"
                class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                on:click={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                class="bg-green-700 text-white px-4 py-2 rounded-md"
                on:click={handleSave}
              >
                Save Changes
              </button>
            </div>
          </form>
        {/if}
      </div>
    </div>
  </div>
{/if}
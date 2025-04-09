<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { events, type CalendarEvent } from '$lib/stores/events';

  export let isOpen = false;
  export let onClose: () => void;
  
  const dispatch = createEventDispatcher();

  // Track selected event for editing
  let selectedEvent: CalendarEvent | null = null;
  let editedEvent: CalendarEvent | null = null;

  // Function to handle event selection
  function handleEventSelect(event: CalendarEvent) {
    selectedEvent = event;
    editedEvent = { ...event };
  }

  // Function to save changes
  function handleSave() {
    if (editedEvent) {
      events.update(currentEvents => {
        return currentEvents.map(event => 
          event.id === editedEvent!.id ? editedEvent! : event
        );
      });
      onClose();
    }
  }

  // Function to delete event
  function handleDelete() {
    if (selectedEvent) {
      events.update(currentEvents => {
        return currentEvents.filter(event => event.id !== selectedEvent!.id);
      });
      selectedEvent = null;
      editedEvent = null;
      onClose();
    }
  }

  function handleEventChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    const event = $events.find(ev => ev.id === target.value);
    if (event) handleEventSelect(event);
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
            <option value="">Select an event...</option>
            {#each $events as event}
              <option value={event.id}>{event.title}</option>
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
                        editedEvent.extendedProps.days.push(day);
                      } else {
                        editedEvent.extendedProps.days.splice(index, 1);
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
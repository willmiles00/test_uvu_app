<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { events, type CalendarEvent } from '$lib/stores/events';

  export let isOpen = false;
  export let onClose: () => void;
  
  const dispatch = createEventDispatcher();

  // Track selected event for editing
  let selectedEvent: CalendarEvent | null = null;
  let editedEvent: CalendarEvent | null = null;
  
  // Track view state - either 'table' or 'edit'
  let viewMode: 'table' | 'edit' = 'table';
  
  // Track which row is being hovered
  let hoveredRowId: string | null = null;
  
  // Function to get unique events based on CRN
  function getUniqueEvents(eventsList: CalendarEvent[]): CalendarEvent[] {
    const uniqueEvents: CalendarEvent[] = [];
    const crnSet = new Set();
    
    eventsList.forEach(event => {
      const crn = event.extendedProps.CRN;
      // If this CRN hasn't been added yet, or if it's a custom event without a CRN
      if (!crn || !crnSet.has(crn)) {
        if (crn) crnSet.add(crn);
        uniqueEvents.push(event);
      }
    });
    
    return uniqueEvents;
  }

  // Function to handle event selection
  function handleEventSelect(event: CalendarEvent) {
    selectedEvent = event;
    editedEvent = JSON.parse(JSON.stringify(event)); // Deep copy to avoid reference issues
    viewMode = 'edit';
  }

  // Function to save changes
  function handleSave() {
    if (editedEvent) {
      events.update(currentEvents => {
        return currentEvents.map(event => 
          event.id === editedEvent!.id ? editedEvent! : event
        );
      });
      resetAndClose();
    }
  }

  // Function to delete event
  function handleDelete() {
    if (selectedEvent) {
      events.update(currentEvents => {
        return currentEvents.filter(event => event.id !== selectedEvent!.id);
      });
      resetAndClose();
    }
  }
  
  // Reset state and close modal
  function resetAndClose() {
    selectedEvent = null;
    editedEvent = null;
    viewMode = 'table';
    onClose();
  }
  
  // Handle row hover
  function handleRowHover(id: string | null) {
    hoveredRowId = id;
  }
  
  // Handle back button click
  function handleBack() {
    viewMode = 'table';
    selectedEvent = null;
    editedEvent = null;
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-auto">
      <div class="bg-[#00843D] text-white p-4 pl-6 text-xl font-bold rounded-t-lg font-primary-semibold flex justify-between items-center">
        <span class="uppercase">
          {viewMode === 'table' ? 'EDIT SCHEDULE' : 'EDIT CLASS'}
        </span>
        {#if viewMode === 'edit'}
          <button 
            class="text-white hover:text-gray-200 text-sm"
            on:click={handleBack}
          >
            <i class="fa-solid fa-arrow-left mr-2"></i>Back to list
          </button>
        {/if}
      </div>
      
      <div class="p-6">
        {#if viewMode === 'table'}
          <!-- Table View -->
          {#if $events.length === 0}
            <div class="text-center py-8">
              <p class="text-gray-500 font-primary">No classes available. Please import a CSV or add custom classes first.</p>
            </div>
          {:else}
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-gray-100 border-b">
                    <th class="text-left p-3 font-primary-semibold text-[#275D38]">Class Name</th>
                    <th class="text-left p-3 font-primary-semibold text-[#275D38]">Instructor</th>
                    <th class="text-left p-3 font-primary-semibold text-[#275D38]">Room</th>
                    <th class="text-left p-3 font-primary-semibold text-[#275D38]">CRN</th>
                    <th class="text-center p-3 font-primary-semibold text-[#275D38]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {#each getUniqueEvents($events) as event}
                    <tr 
                      class="border-b hover:bg-gray-50 transition-colors"
                      on:mouseenter={() => handleRowHover(event.id)}
                      on:mouseleave={() => handleRowHover(null)}
                    >
                      <td class="p-3 font-lato">{event.title}</td>
                      <td class="p-3 font-lato">{event.extendedProps.Instructor}</td>
                      <td class="p-3 font-lato">{event.extendedProps.buildingAndRoom}</td>
                      <td class="p-3 font-lato">{event.extendedProps.CRN || 'N/A'}</td>
                      <td class="p-3 text-center">
                        <button 
                          class="bg-[#275D38] text-white px-3 py-1 rounded transition-opacity {hoveredRowId === event.id ? 'opacity-100' : 'opacity-0'}"
                          on:click={() => handleEventSelect(event)}
                        >
                          <i class="fa-solid fa-pen-to-square mr-1"></i> Edit
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
            
            <div class="flex justify-end mt-4">
              <button
                type="button"
                class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-primary"
                on:click={onClose}
              >
                Close
              </button>
            </div>
          {/if}
        {:else if viewMode === 'edit' && editedEvent}
          <!-- Edit Form -->
          <form class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-medium font-primary">Title</label>
              <input
                type="text"
                bind:value={editedEvent.title}
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium font-primary">Instructor</label>
              <input
                type="text"
                bind:value={editedEvent.extendedProps.Instructor}
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium font-primary">Course</label>
              <input
                type="text"
                bind:value={editedEvent.extendedProps.Course}
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium font-primary">Room</label>
              <input
                type="text"
                bind:value={editedEvent.extendedProps.buildingAndRoom}
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

            <!-- Days Selection -->
            <div class="col-span-2">
              <label class="block text-gray-700 font-medium font-primary">Days</label>
              <div class="flex space-x-2 mt-1">
                {#each ["MON", "TUES", "WED", "THUR", "FRI", "SAT"] as day}
                  <button
                    type="button"
                    class="px-4 py-2 rounded-md border {editedEvent.extendedProps.days?.includes(day) ? 'bg-[#275D38] text-white' : 'bg-gray-200 text-gray-700'}"
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
              <label class="block text-gray-700 font-medium font-primary">Start Time</label>
              <input
                type="time"
                bind:value={editedEvent.start}
                class="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium font-primary">End Time</label>
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
                class="bg-red-600 text-white px-4 py-2 rounded-md font-primary"
                on:click={handleDelete}
              >
                Delete
              </button>
              <button
                type="button"
                class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-primary"
                on:click={resetAndClose}
              >
                Cancel
              </button>
              <button
                type="button"
                class="bg-[#275D38] text-white px-4 py-2 rounded-md font-primary"
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
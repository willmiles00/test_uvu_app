<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { events, type CalendarEvent } from '$lib/stores/events';
  import { filteredevents, selectedInstructors, selectedRooms, selectedCourses } from '$lib/stores/filteredevents';

  export let isOpen = false;
  export let onClose: () => void;
  export let eventToEdit = null;
  
  
  const dispatch = createEventDispatcher();

  // Track selected event for editing
  let selectedEvent: CalendarEvent | null = null;
  let editedEvent: CalendarEvent | null = null;
  
  // Track view state - either 'table' or 'edit'
  let viewMode: 'table' | 'edit' = 'table';
  
  // Track which row is being hovered
  let hoveredRowId: string | null = null;

  // Parse time from ISO datetime
  function getTimeFromDateString(dateStr: string): string {
    try {
      // Handle different formats of dateStr
      if (!dateStr) return '';
      
      // If it's already in HH:MM format, return as is
      if (/^\d{2}:\d{2}$/.test(dateStr)) return dateStr;
      
      // If it contains a T delimiter, extract the time part
      if (dateStr.includes('T')) {
        const timePart = dateStr.split('T')[1];
        return timePart.substring(0, 5); // Get HH:MM from time part
      }
      
      return '';
    } catch (e) {
      console.error('Error parsing time from date string:', e);
      return '';
    }
  }

  // Format event time for display and editing
  function formatEventTime(event: CalendarEvent): CalendarEvent {
    const editableCopy = { ...event };
    
    // Extract only the time part for display in inputs
    if (editableCopy.start && typeof editableCopy.start === 'string') {
      editableCopy.start = getTimeFromDateString(editableCopy.start);
    }
    
    if (editableCopy.end && typeof editableCopy.end === 'string') {
      editableCopy.end = getTimeFromDateString(editableCopy.end);
    }
    
    return editableCopy;
  }
  
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
    editedEvent = formatEventTime(JSON.parse(JSON.stringify(event))); // Deep copy and format for editing
    
    // Reset the days selection every time we edit an event
    // This forces users to select days explicitly each time
    if (editedEvent && editedEvent.extendedProps) {
      editedEvent.extendedProps.days = [];
    }
    
    viewMode = 'edit';
  }

  // Stores original date parts for reconstructing the datetime later
  let originalStartDatePart = '';
  let originalEndDatePart = '';

  // Function to save changes
  function handleSave() {
    if (editedEvent && selectedEvent) {
      // Validate that at least one day is selected
      if (!editedEvent.extendedProps.days || editedEvent.extendedProps.days.length === 0) {
        alert('Please select at least one day for this event');
        return;
      }
      
      // Store original event to handle multi-day events
      const originalEvent = JSON.parse(JSON.stringify(selectedEvent));
      
      // Preserve the original date part
      if (!originalStartDatePart && selectedEvent.start.includes('T')) {
        originalStartDatePart = selectedEvent.start.split('T')[0];
      }
      
      if (!originalEndDatePart && selectedEvent.end.includes('T')) {
        originalEndDatePart = selectedEvent.end.split('T')[0];
      }
      
      // For multi-day events, we need to handle differently
      if (editedEvent.extendedProps.days && editedEvent.extendedProps.days.length > 0) {
        // Day mapping
        const dayMapping = {
          "MON": "2024-07-01",
          "TUES": "2024-07-02",
          "WED": "2024-07-03",
          "THUR": "2024-07-04",
          "FRI": "2024-07-05",
          "SAT": "2024-07-06"
        };
        
        // We'll create or update one event per selected day
        const updatedEvents: CalendarEvent[] = [];
        
        // Extract time parts from edited event
        const startTime = editedEvent.start || getTimeFromDateString(originalEvent.start);
        const endTime = editedEvent.end || getTimeFromDateString(originalEvent.end);
        
        // First, delete all existing events with this ID
        events.update(currentEvents => {
          return currentEvents.filter(event => event.id !== originalEvent.id);
        });
        
        // Then create one event for each selected day
        editedEvent.extendedProps.days.forEach((day, index) => {
          if (dayMapping[day as keyof typeof dayMapping]) {
            const datePart = dayMapping[day as keyof typeof dayMapping];
            
            // Create a new event for this day
            const newEvent: CalendarEvent = {
              ...JSON.parse(JSON.stringify(editedEvent)),
              id: index === 0 ? originalEvent.id : `${originalEvent.id}-${day}`,
              start: `${datePart}T${startTime}:00`,
              end: `${datePart}T${endTime}:00`
            };
            
            // Update format for time display
            newEvent.extendedProps.meetingTime = [startTime, endTime];
            newEvent.extendedProps.formattedTime = `${startTime} - ${endTime}`;
            newEvent.extendedProps.meetingDays = editedEvent.extendedProps.days.map(
              d => dayMapping[d as keyof typeof dayMapping] + 'T'
            );
            
            updatedEvents.push(newEvent);
          }
        });
        
        // Add all new events to the store
        events.update(currentEvents => {
          return [...currentEvents, ...updatedEvents];
        });
      } else {
        // For single day events, use the original approach
        const updatedEvent = { ...editedEvent };
        
        // Only update if we have both parts
        if (originalStartDatePart && editedEvent.start) {
          updatedEvent.start = `${originalStartDatePart}T${editedEvent.start}:00`;
        }
        
        if (originalEndDatePart && editedEvent.end) {
          updatedEvent.end = `${originalEndDatePart}T${editedEvent.end}:00`;
        }
        
        // Update format for time display
        if (updatedEvent.extendedProps.meetingTime) {
          updatedEvent.extendedProps.meetingTime = [
            getTimeFromDateString(updatedEvent.start),
            getTimeFromDateString(updatedEvent.end)
          ];
          updatedEvent.extendedProps.formattedTime = `${updatedEvent.extendedProps.meetingTime[0]} - ${updatedEvent.extendedProps.meetingTime[1]}`;
        }
        
        // Update the events store
        events.update(currentEvents => {
          return currentEvents.map(event => 
            event.id === selectedEvent!.id ? updatedEvent : event
          );
        });
      }
      
      // Reset values
      originalStartDatePart = '';
      originalEndDatePart = '';
      
      // Dispatch a custom event to notify the parent component that an edit was saved
      dispatch('editSaved');
      
      resetAndClose();
    }
  }

  // Function to delete event
  function handleDelete() {
    if (selectedEvent) {
      events.update(currentEvents => {
        return currentEvents.filter(event => event.id !== selectedEvent!.id);
      });
      
      // Dispatch event to notify that an event was deleted
      dispatch('editSaved');
      
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

  $: if (eventToEdit && isOpen) {
  selectedEvent = eventToEdit;
  editedEvent = formatEventTime(JSON.parse(JSON.stringify(eventToEdit)));
  viewMode = 'edit';
}
</script>

{#if isOpen}
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg shadow-lg w-[1000px] max-h-[80vh] overflow-auto">
      <div class="bg-[#00843D] text-white p-4 pl-6 text-xl rounded-t-lg font-primary-semibold flex justify-between items-center h-[55px] relative">
        <span class="font-light text-[24px]">
          {viewMode === 'table' ? 'Edit Schedules' : 'EDIT CLASS'}
        </span>
        {#if viewMode === 'edit'}
          <button 
            class="text-white hover:text-gray-200 text-sm"
            on:click={handleBack}
          >
   
          </button>
        {/if}
        
        <!-- New X Close Button -->
        <button 
          class="absolute top-[16px] right-[16px] text-white hover:text-gray-200"
          on:click={resetAndClose}
          aria-label="Close modal"
        >
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>
      
      <div class="p-6">
        {#if viewMode === 'table'}
          <!-- Table View -->
          {#if $events.length === 0}
            <div class="text-center py-8 w-[936px]">
              <p class="text-gray-500 font-primary">No classes available. Please import a CSV or add custom classes first.</p>
            </div>
          {:else}
            <div class="overflow-x-auto w-[936px]">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-gray-100 border-b">
                    <th class="text-left p-3 font-primary-semibold text-[#275D38] w-[172px]">Class Name</th>
                    <th class="text-left p-3 font-primary-semibold text-[#275D38] w-[189px]">Instructor</th>
                    <th class="text-left p-3 font-primary-semibold text-[#275D38] w-[189px]">Room</th>
                    <th class="text-left p-3 font-primary-semibold text-[#275D38] w-[189px]">CRN</th>
                    <th class="text-center p-3 font-primary-semibold text-[#275D38]"></th>
                  </tr>
                </thead>
                <tbody>
                  {#each getUniqueEvents($events) as event}
                    <tr 
                      class="border-b hover:bg-gray-50 transition-colors"
                      on:mouseenter={() => handleRowHover(event.id)}
                      on:mouseleave={() => handleRowHover(null)}
                    >
                      <td class="p-3 font-lato text-[12px]">{event.title}</td>
                      <td class="p-3 font-lato text-[12px]">{event.extendedProps.Instructor}</td>
                      <td class="p-3 font-lato text-[12px]">{event.extendedProps.buildingAndRoom}</td>
                      <td class="p-3 font-lato text-[12px]">{event.extendedProps.CRN || 'N/A'}</td>
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
              <label class="block text-gray-700 font-medium font-primary">Days (Required)</label>
              <p class="text-sm text-gray-500 mb-2">Please select at least one day for this event</p>
              <div class="flex space-x-2 mt-1">
                {#each ["MON", "TUES", "WED", "THUR", "FRI", "SAT"] as day}
                  <button
                    type="button"
                    class="px-4 py-2 rounded-md border {editedEvent.extendedProps.days?.includes(day) ? 'bg-[#275D38] text-white' : 'bg-gray-200 text-gray-700'}"
                    on:click={() => {
                      // Initialize days array if it doesn't exist
                      if (!editedEvent.extendedProps.days) {
                        editedEvent.extendedProps.days = [];
                      }
                      
                      // Make a copy of the days array for proper reactivity
                      const updatedDays = [...editedEvent.extendedProps.days];
                      
                      // Toggle the day
                      const index = updatedDays.indexOf(day);
                      if (index === -1) {
                        updatedDays.push(day);
                      } else {
                        updatedDays.splice(index, 1);
                      }
                      
                      // Update the days array
                      editedEvent.extendedProps.days = updatedDays;
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
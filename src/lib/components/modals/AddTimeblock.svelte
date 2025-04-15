<script lang="ts">
    import { onMount } from 'svelte';
    import { events } from '$lib/stores/events';
    import { convertTo24Hour } from '$lib/functions/24HrConversion';
    import { filteredevents } from '$lib/stores/filteredevents';
    
    // Expose the modal state to parent
    export let isOpen = false;
    export let onClose = () => { isOpen = false; };
    
    // Form data
    let timeblockName = '';
    let roomNumber = '';
    let profLastName = '';
    let startTime = '';
    let endTime = ''; 
    
    // Days selection
    let days = [
      { name: "MON", value: "2024-07-01T", selected: false },
      { name: "TUES", value: "2024-07-02T", selected: false },
      { name: "WED", value: "2024-07-03T", selected: false },
      { name: "THUR", value: "2024-07-04T", selected: false },
      { name: "FRI", value: "2024-07-05T", selected: false }
    ];
    
    // Toggle day selection
    function toggleDay(index: number) {
      days[index].selected = !days[index].selected;
    }
    
    // Calculate end time based on start time and class length
    function calculateEndTime(start: string, lengthMinutes: number): string {
      if (!start) return '';
      
      // Convert startTime from HH:MM to Date object
      const [hours, minutes] = start.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);
      
      // Add class length
      const endDate = new Date(startDate.getTime() + lengthMinutes * 60000);
      
      // Format end time as HH:MM
      return `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
    }
    
    // Handle form submission
   // ...existing code...
function handleSubmit() {
  // Validate form
  if (!timeblockName || !startTime || !endTime) {
    alert('Please fill in all required fields');
    return;
  }
  
  const selectedDays = days.filter(day => day.selected);
  if (selectedDays.length === 0) {
    alert('Please select at least one day');
    return;
  }
  
  // Create new events for each selected day
  selectedDays.forEach(day => {
    const newEvent = {
      title: `${timeblockName}`,
      start: `${day.value}${startTime}:00`,
      end: `${day.value}${endTime}:00`,
      buildingAndRoom: 'Custom Location',
      CRN: 'CUSTOM',
      Course: timeblockName,
      Instructor: `${roomNumber} ${profLastName}`,
      meetingDays: [day.value],
      meetingTime: [startTime, endTime],
      extendedProps: {
        Course: timeblockName,
        timeblockName: timeblockName,
        roomNumber: roomNumber,
        Instructor: `Custom Timeblock`,
        buildingAndRoom: roomNumber,
        startTime: startTime,
        endTime: endTime,
        days: selectedDays.map(d => d.name)
      }
    };
    
    // Add to events store
    filteredevents.update(value => [...value, newEvent]);
    events.update(value => [...value, newEvent]);
  });
  
  // Reset form and close modal
  resetForm();
  onClose();
}

function resetForm() {
  timeblockName = '';
  roomNumber = '';
  profLastName = '';
  startTime = '';
  endTime = '';  // Update here too
  days.forEach(day => day.selected = false);
}
// ...existing code...
    
 
  </script>
  
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg shadow-lg max-w-3xl h-[598px] w-[900px]">
      <div class="bg-[#00843D] text-white p-4 pl-6 text-xl font-bold rounded-t-lg font-primary-semibold uppercase">
        Add Custom Timeblock
      </div>
      <div class="p-6">
        <form class="grid grid-cols-2 gap-4" on:submit|preventDefault={handleSubmit}>
         
          <div>
            <label for="timeblockTitle" class="block text-gray-700 font-medium font-primary">Timeblock Title</label>
            <input
            id="timeblockTitle"
              type="text"
              bind:value={timeblockName}
              placeholder="Type Class Name"
              class="w-full border border-gray-300 rounded-md p-2 mt-1"
              required
            />
          </div>
  
      
          <div>
            <label for="roomNumber" class="block text-gray-700 font-medium font-primary">Room Number (Optional)</label>
            <input
            id="roomNumber"
              type="text"
              bind:value={roomNumber}
              placeholder="Type First Name"
              class="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>
  
          
  
          <!-- Select Days -->
          <div class="col-span-2">
            <label for="selectDays" class="block text-gray-700 font-medium font-primary">Select Days:*</label>
            <div id="selectDays" class="flex space-x-2 mt-1">
              {#each days as day, i}
                <button
                  type="button"
                  class="px-4 py-2 rounded-md border {day.selected ? 'bg-[#275D38] text-white' : 'bg-[#DDDDDD] text-[#275D38]'} w-[126px] h-[63px] font-rajdhani font-semibold"
                  on:click={() => toggleDay(i)}
                >
                  {day.name}
                </button>
              {/each}
            </div>
          </div>
  
          <!-- Start Time -->
          <div>
            <label for="startTime" class="block text-gray-700 font-medium font-primary">Select Start Time*</label>
            <input
            id="startTime"
              type="time"
              bind:value={startTime}
              class="border border-gray-300 rounded-md p-2 mt-1 w-full"
              required
            />
          </div>
  
          <!-- End Time -->
          <div>
            <label for="endTime" class="block text-gray-700 font-medium font-primary">Select End Time*</label>
            <input
            id="endTime"
              type="time"
              bind:value={endTime}
              class="border border-gray-300 rounded-md p-2 mt-1 w-full"
              required
            />
          </div>

          

    
          <!-- Preview -->
          {#if startTime && endTime}
          <div class="col-span-2 bg-gray-100 p-3 rounded mt-2">
            <p class="font-primary">Preview: Class will run from <span class="font-semibold">{startTime}</span> to <span class="font-semibold">{endTime}</span></p>
          </div>
        {/if}
  
          <!-- Buttons -->
          <div class="col-span-2 flex justify-end space-x-4 mt-4">
            <button
              type="button"
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-primary"
              on:click={() => { resetForm(); onClose(); }}
            >
              Cancel
            </button>
            <button type="submit" class="bg-[#275D38] text-white px-4 py-2 rounded-md font-primary">
              Add Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
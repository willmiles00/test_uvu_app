<script lang="ts">
  import { onMount } from 'svelte';
  import { events } from '$lib/stores/events';
  import { convertTo24Hour } from '$lib/functions/24HrConversion';
	import { filteredevents } from '$lib/stores/filteredevents';
  import ColorSelector from '$lib/components/ColorSelector.svelte';


  
  // Expose the modal state to parent
  export let isOpen = false;
  export let onClose = () => { isOpen = false; };

  // Colors stuff, may make into component
  let selectedColor = '';
  let pairingColor = '';

  
  // Form data
  let className = '';
  let profFirstName = '';
  let profLastName = '';
  let startTime = '';
  let classLength = '';
  let courseNumber = '';
  let roomNumber = '';
  
  // Days selection
  let days = [
    { name: "MON", value: "2024-07-01T", selected: false },
    { name: "TUES", value: "2024-07-02T", selected: false },
    { name: "WED", value: "2024-07-03T", selected: false },
    { name: "THUR", value: "2024-07-04T", selected: false },
    { name: "FRI", value: "2024-07-05T", selected: false },
    { name: "SAT", value: "2024-07-05T", selected: false }
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
  function handleSubmit() {
    // Validate form
    if (!className || !startTime || !classLength) {
      alert('Please fill in all required fields');
      return;
    }
    
    const selectedDays = days.filter(day => day.selected);
    if (selectedDays.length === 0) {
      alert('Please select at least one day');
      return;
    }
    
    // Calculate end time
    const endTime = calculateEndTime(startTime, parseInt(classLength));
    
    // Create new events for each selected day
    selectedDays.forEach(day => {
      const newEvent = {
        title: `${className}`,
        start: `${day.value}${startTime}:00`,
        end: `${day.value}${endTime}:00`,
        buildingAndRoom: 'Custom Location',
        CRN: 'CUSTOM',
        Course: className,
        Instructor: `${profFirstName} ${profLastName}`,
        meetingDays: [day.value],
        meetingTime: [startTime, endTime],
        color: selectedColor,
        extendedProps: {
          Course: className,
          Instructor: `${profFirstName} ${profLastName}`,
          profFirstName,
          profLastName,
          startTime,
          classLength,
          courseNumber,
          buildingAndRoom: roomNumber,
          color: selectedColor,
          pairingColor: pairingColor,
          selectedDays: selectedDays.map(d => d.name)
        }
      };
      
      // Add to events store
      events.update(value => [...value, newEvent]);
      filteredevents.update(value => [...value, newEvent]);
    });
    
    // Reset form and close modal
    selectedColor = '';
    pairingColor = '';
    resetForm();
    onClose();
  }
  
  // Reset form
  function resetForm() {
    className = '';
    profFirstName = '';
    profLastName = '';
    startTime = '';
    classLength = '';
    days.forEach(day => day.selected = false);
  }
</script>

<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <div class="bg-white rounded-lg shadow-lg max-w-3xl w-full">
    <div class="bg-[#275D38] text-white p-4 text-left text-xl font-bold rounded-t-lg font-primary-semibold">
      ADD CUSTOM SCHEDULE
    </div>
    <div class="p-6">
      <form class="grid grid-cols-2 gap-4" on:submit|preventDefault={handleSubmit}>
        <!-- Class Name -->
        <div>
          <label class="block text-[#275D38] font-medium font-primary">Class Name*</label>
          <input
            type="text"
            bind:value={className}
            placeholder="Type Class Name"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
            required
          />
        </div>

        <!-- Professor Name -->
        <div>
          <label class="block text-[#275D38] font-medium font-primary">Prof First Name</label>
          <input
            type="text"
            bind:value={profFirstName}
            placeholder="Type First Name"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
        </div>

        <div>
          <label class="block text-[#275D38] font-medium font-primary">Prof Last Name</label>
          <input
            type="text"
            bind:value={profLastName}
            placeholder="Type Last Name"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
        </div>

        <!-- course number -->
        <div>
          <label class="block text-[#275D38] font-medium font-primary">Course Number</label>
          <input
            type="text"
            bind:value={courseNumber}
            placeholder="Type Course Number"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
        </div>

        <!-- Room Number -->
        <div>
          <label class="block text-[#275D38] font-medium font-primary">Room Number</label>
          <input
            type="text"
            bind:value={roomNumber}
            placeholder="Type Room Number"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
        </div>

        <!-- Select Days -->
        <div class="col-span-2">
          <label class="block text-[#275D38] font-medium font-primary">Select Days:*</label>
          <div class="space-x-2 mt-1 flex justify-evenly w-full">
            {#each days as day, i}
              <button
                type="button"
                class="flex-1 px-6 py-4 rounded-md border {day.selected ? 'bg-[#275D38] text-white' : 'bg-gray-200 text-[#275D38]'}"
                on:click={() => toggleDay(i)}
              >
                {day.name}
              </button>
            {/each}
          </div>
        </div>

        <!-- Start Time -->
        <div>
          <label class="block text-[#275D38] font-medium font-primary">Select Start Time*</label>
          <input
            type="time"
            bind:value={startTime}
            class="border border-gray-300 rounded-md p-2 mt-1 w-full"
            required
          />
        </div>

        <!-- Class Length -->
        <div>
          <label class="block text-[#275D38] font-medium font-primary">Class Length*</label>
          <select 
            bind:value={classLength} 
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
            required
          >
            <option value="">Select Class Length</option>
            <option value="30">30 mins</option>
            <option value="50">50 mins</option>
            <option value="60">1 hour</option>
            <option value="75">1 hour 15 mins</option>
            <option value="90">1 hour 30 mins</option>
            <option value="120">2 hours</option>
            <option value="180">3 hours</option>
          </select>
        </div>

        <!-- colors -->
        <ColorSelector bind:selectedColor={selectedColor} bind:pairingColor={pairingColor} />

        <!-- Preview -->
        {#if startTime && classLength}
          <div class="col-span-2 bg-gray-100 p-3 rounded mt-2">
            <p class="font-primary">Preview: Class will run from <span class="font-semibold">{startTime}</span> to <span class="font-semibold">{calculateEndTime(startTime, parseInt(classLength))}</span></p>
          </div>
        {/if}

        <!-- Buttons -->
        <div class="col-span-2 flex justify-end space-x-4 mt-4">
          <button
            type="button"
            class="bg-gray-300 text-[#275D38] px-4 py-2 rounded-md font-primary"
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
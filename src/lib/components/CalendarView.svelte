<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import Calendar from '@event-calendar/core';
    //I was able to remove an error about declaration by running 'npm install --save-dev @types/event-calendar__time-grid'
    import TimeGrid from '@event-calendar/time-grid';
    import { events } from "$lib/stores/events";
    import { filteredevents, selectedInstructors, selectedRooms, selectedCourses } from "$lib/stores/filteredevents";
    import { eventstobedeleted } from "$lib/stores/eventstobedeleted";
    import { onMount, onDestroy, afterUpdate } from 'svelte';

    // since we are using a static date, we need to define the days of the week. This week of July is easy to work with
    let Monday = '2024-07-01';
    let Tuesday = '2024-07-02';
    let Wednesday = '2024-07-03';
    let Thursday = '2024-07-04';
    let Friday = '2024-07-05';


           
    onMount(() => {
           // this is needed to define ec
           ec.refetchEvents()


    });

    let previousEvents: any = [];

    afterUpdate(() => {
        if ($eventstobedeleted.length > 0) {
            $eventstobedeleted.forEach((event: any) => {
                ec.removeEventById(event.id);
            });
            eventstobedeleted.set([]);
        }
        
        // Check if at least one filter is selected
        const hasActiveFilters = $selectedInstructors.length > 0 || 
                               $selectedRooms.length > 0 || 
                               $selectedCourses.length > 0;
        
        // Only show events if at least one filter is active
        if (hasActiveFilters) {
            ec.setOption('events', $filteredevents);
        } else {
            // No filters selected, show empty calendar
            ec.setOption('events', []);
        }
        ec.refetchEvents();
    });
    


   

    // annoying required type definitions
    type CalendarOptions = {
        view: string;
        events: any[];
        slotDuration?: string;
    };

    let ec: any; 
    let plugins = [TimeGrid];

    let openDropdownCRN: string | null = null;
    
    let options: CalendarOptions = {
  
        // sets the date to July 1. All calendar events will fall on this week unless we implement a 'view by semester' feature down the line
 
        date: '2024-07-01',
        view: 'timeGridWeek',
        events: $filteredevents,

        // sets the time slots to 15 minutes, min time to 6:30am, max time to 10:30pm
        slotDuration: '00:30:00',
        slotMinTime: '07:00:00',
        slotMaxTime: '21:00:00',
        // hides weekends
        hiddenDays: [0],
        titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
       headerToolbar:{start: '', center: '', end: ''},
    //    gets rid of specific day of the week in header. We will be adding all events to the same 'week' to avoid events falling off the face of the earth
       dayHeaderFormat: { weekday: 'long' },
       slotHeight: 30,
       slotEventOverlap: false,
       eventContent: function(info) {
  return {
    html: `
      <div data-crn='${info.event.extendedProps.CRN}' class='event-container flex flex-row wrap w-full h-full py-[4px] text-black relative z-10'>
        <span class='color-span h-full w-[4px] mr-[4px] rounded-2xl' style='background-color:${info.event.extendedProps.pairingColor};'>
        </span>
        <div class='info-container flex flex-col w-full h-full'>
          <div class="event-title font-lato font-bold text-[12px] h-fit w-full">${info.event.title}
          </div>
          <div class='event-room font-lato text-[10px] h-fit w-full'> ${info.event.extendedProps.buildingAndRoom || ''}
          </div>
          <div class='time-container font-lato text-[10px] flex flex-row w-full h-fit'> ${info.event.extendedProps.formattedTime || ''}
          </div>
          <div class='details-button absolute top-0 right-0 bg-opaque-white w-[24px] h-[24px] rounded-full flex flex-wrap justify-center items-center'>
            <button class='h-fit'><i class="fa-solid fa-ellipsis-vertical"></i></button>
          </div>
          </div>
          
          <div data-event-id='${info.event.id}' class='event-popup hidden absolute right-0 top-[24px] bg-white border border-gray-200 rounded-md shadow-md z-[9999]'>
            <ul class='py-1'>
              <li class='edit-event px-4 py-2 hover:bg-gray-100 cursor-pointer font-lato text-[12px] flex items-center'>
                <i class="fa-solid fa-pen-to-square mr-2"></i> Edit
              </li>
              <li class='delete-event px-4 py-2 hover:bg-gray-100 cursor-pointer font-lato text-[12px] text-red-600 flex items-center'>
                <i class="fa-solid fa-trash mr-2"></i> Delete
              </li>
            </ul>
          </div>
        </div>
      
    `
  };
},
       
  


eventClick: function(info) {
  // Check if the click was on the details button
  const target = info.jsEvent.target;
  if (target.classList.contains('fa-ellipsis-vertical') || 
      target.closest('.details-button')) {
    // Get the popup element
    const eventContainer = target.closest('.event-container');
    const popup = eventContainer.querySelector('.event-popup');
    
    // Toggle popup visibility
    document.querySelectorAll('.event-popup').forEach(popup => {
      if (popup !== eventContainer.querySelector('.event-popup')) {
        popup.classList.add('hidden');
      }
    });
    
    popup.classList.toggle('hidden');
    info.jsEvent.preventDefault(); // Prevent default calendar behavior
  } else if (target.closest('.edit-event')) {
    // Edit event action
    const eventId = target.closest('.event-popup').getAttribute('data-event-id');
    const event = info.event;
    
    // Find the event in the events store
    const foundEvent = $events.find((e) => e.id === eventId);
    if (foundEvent) {
      // Open edit modal with this event
      dispatch('edit', { event: foundEvent });
    }
    
    // Hide the popup
    target.closest('.event-popup').classList.add('hidden');
    info.jsEvent.preventDefault();
  } else if (target.closest('.delete-event')) {
  // Delete event action
  const eventId = target.closest('.event-popup').getAttribute('data-event-id');
  
  // Add the event to the delete queue
  const eventToDelete = $events.find((e) => e.id === eventId);
  if (eventToDelete) {
    eventstobedeleted.update(value => [...value, eventToDelete]);
    
    // Also remove from the main events store
    events.update(value => value.filter(e => e.id !== eventId));
  }
  
  // Hide the popup
  target.closest('.event-popup').classList.add('hidden');
  info.jsEvent.preventDefault();
} else {
    // Hide any open popups when clicking elsewhere
    document.querySelectorAll('.event-popup').forEach(popup => {
      popup.classList.add('hidden');
    });
  }
},
    };


    function updateOptions() {
        options.slotDuration = '01:00';
    }

   
</script>

<!-- html -->
<div class="relative">
<Calendar bind:this={ec} {plugins} {options} />

{#if $events.length === 0}
    <div class="absolute top-0 left-0 w-full h-full bg-[#E8E8E8]">

        <div class="flex flex-col items-center h-full justify-center">
            <div class="w-[164px] h-[164px] mb-2">
            <img src='/importcsv.svg' class="w-full h-auto" alt="import csv" />
        </div>
            <p class="text-[24px] font-rajdhani font-semibold text-[#00843D] mb-2">IMPORT .CSV FILE</p>
            <p class="font-lato w-[317px] text-center">Upload .CSV File or add custom schedule to display calendar </p>
           
        </div>

    </div>
{/if}
</div>

<style lang="postcss">
  .font-rajdhani {
    font-family: 'Rajdhani', sans-serif;
  }

  .font-lato {
    font-family: 'Lato', sans-serif;
  }

  .event-popup {
    min-width: 120px;
    /* Add these properties */
    position: absolute;
    z-index: 9999;
    /* This fixes potential parent stacking context issues */
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.1));
  }

  .hidden {
    display: none;
  }

  .bg-opaque-white {
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>
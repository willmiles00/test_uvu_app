
<script lang="ts">
    import Calendar from '@event-calendar/core';
    //I was able to remove an error about declaration by running 'npm install --save-dev @types/event-calendar__time-grid'
    import TimeGrid from '@event-calendar/time-grid';
    import { events } from "$lib/stores/events";
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
        // when the events store updates, we want to add the new events to the calendar
        events.subscribe(value => {
            const newEvents = value.filter(event => !previousEvents.includes(event));
            newEvents.forEach(event => {
                ec.addEvent(event);
                console.log(event);
            });
            previousEvents = value;
            ec.refetchEvents();
            ec.getEvents();
            console.log('here is the current state of events:',value);
        });
        
    
    });
    

     


    // annoying required type definitions
    type CalendarOptions = {
        view: string;
        events: any[];
        slotDuration?: string;
    };

    let ec: any; 
    let plugins = [TimeGrid];
    
    let options: CalendarOptions = {
  
        // sets the date to July 1. All calendar events will fall on this week unless we implement a 'view by semester' feature down the line
 
        date: '2024-07-01',
        view: 'timeGridWeek',
        events: $events,

        // sets the time slots to 15 minutes, min time to 6:30am, max time to 10:30pm
        slotDuration: '00:30:00',
        slotMinTime: '07:00:00',
        slotMaxTime: '21:00:00',
        // hides weekends
        hiddenDays: [0, 6],
        titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
       headerToolbar:{start: '', center: '', end: ''},
    //    gets rid of specific day of the week in header. We will be adding all events to the same 'week' to avoid events falling off the face of the earth
       dayHeaderFormat: { weekday: 'long' },
       slotHeight: 30,
       slotEventOverlap: false,
       
  


       eventClick: function(info) {
    console.log('Event clicked:', info.event);
    // Handle event click
},
    };


    function updateOptions() {
        options.slotDuration = '01:00';
    }

   
</script>

<div class="relative">
<Calendar bind:this={ec} {plugins} {options} />

<!-- {#if $events.length === 0}
    <div class="absolute top-0 left-0 w-full h-full bg-[#E8E8E8]">

        <div class="flex flex-col items-center h-full justify-center">
            <img src='/importcsv.svg' class="w-1/4" alt="import csv" />
            <p class="text-2xl font-bold text-gray-500">IMPORT .CSV FILE</p>
            <p>Upload .CSV File or add custom schedule to display calendar </p>
           
        </div>

    </div>
{/if} -->
</div>
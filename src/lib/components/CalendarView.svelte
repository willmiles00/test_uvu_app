
<script lang="ts">
    import Calendar from '@event-calendar/core';
    //I was able to remove an error about declaration by running 'npm install --save-dev @types/event-calendar__time-grid'
    import TimeGrid from '@event-calendar/time-grid';
    import { events } from "$lib/stores/events";
    import { onMount, afterUpdate } from 'svelte';

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
        events.subscribe(value => {
            const newEvents = value.filter(event => !previousEvents.includes(event));
            newEvents.forEach(event => {
                ec.addEvent(event);
                console.log(event);
            });
            previousEvents = value;
            ec.refetchEvents();
            ec.getEvents();
            console.log(value);
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
        slotDuration: '00:15:00',
        slotMinTime: '06:30:00',
        slotMaxTime: '22:30:00',
        // hides weekends
        hiddenDays: [0, 6],
        titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
       headerToolbar:{start: '', center: '', end: ''},
    //    gets rid of specific day of the week in header. We will be adding all events to the same 'week' to avoid events falling off the face of the earth
       dayHeaderFormat: { weekday: 'long' },
       slotHeight: 40,
       slotEventOverlap: false,
    };


    function updateOptions() {
        options.slotDuration = '01:00';
    }

//functional event adder


</script>


<Calendar bind:this={ec} {plugins} {options} />


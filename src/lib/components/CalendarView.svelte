
<script lang="ts">
    import Calendar from '@event-calendar/core';
    //I was able to remove an error about declaration by running 'npm install --save-dev @types/event-calendar__time-grid'
    import TimeGrid from '@event-calendar/time-grid';
    import { events } from "$lib/stores/events";

    // annoying required type definitions
    type CalendarOptions = {
        view: string;
        events: any[];
        slotDuration?: string;
    };

    let ec: any; 
    let plugins = [TimeGrid];
    let options: CalendarOptions = {
        view: 'timeGridWeek',
        events: $events,
    };


    function updateOptions() {
        options.slotDuration = '01:00';
    }

//functional event adder
export function addEvent() {
    ec.addEvent(
        {
            title: 'New Event',
            start: '2024-11-20T12:00:00',
            end: '2024-11-21T13:00:00',
        }
    )
  
    ec.refetchEvents()
    ec.getEvents()
}
</script>

<button class="btn variant-filled" on:click={addEvent}>Add event</button>

<Calendar bind:this={ec} {plugins} {options} />



<script lang="ts">
    import Calendar from '@event-calendar/core';
    //I was able to remove an error about declaration by running 'npm install --save-dev @types/event-calendar__time-grid'
    import TimeGrid from '@event-calendar/time-grid';
    import { events } from "$lib/stores/events";

    let plugins = [TimeGrid];
    let options = {
        view: 'timeGridWeek',
        events: $events,
    };


</script>

<Calendar {plugins} {options} />



<script lang="ts">
    //I was able to remove an error about declaration by running 'npm install --save-dev @types/event-calendar__core'
    import Calendar from '@event-calendar/core';

    //I was able to remove an error about declaration by running 'npm install --save-dev @types/event-calendar__time-grid'
    import TimeGrid from '@event-calendar/time-grid';

    let plugins = [TimeGrid];
    let options = {
        view: 'timeGridWeek',
        events: [
            {
                title: 'Event 1',
                start: '2024-11-07T01:00:00',
                end: '2024-11-07T02:00:00'
            },
        ]
    };
</script>

<Calendar {plugins} {options} />

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
      
            <div class='event-container flex flex-row wrap w-full h-full py-[4px] text-black'>
            
                <span class='color-span h-full w-[4px] mr-[4px] rounded-2xl' style='background-color:${info.event.extendedProps.pairingColor};'></span>
                <div class='info-container flex flex-col w-full h-full'>
                <div class="event-title font-lato font-bold text-[12px] h-fit w-full">${info.event.title}</div>
                <div class='event-room font-lato text-[10px] h-fit w-full'> ${info.event.extendedProps.buildingAndRoom || ''}</div>
                <div class='time-container font-lato text-[10px] flex flex-row w-full h-fit'> ${info.event.extendedProps.formattedTime} </div>
                </div>
              
            </div>
            `






            // html: `
            // <div class='event-container flex w-full h-full'>
            //     <span class='color-span h-full w-[3px] bg-red-50'></span>
            //     <div class="event-title">${info.event.title}</div>
            //     <div class="event-instructor">${info.event.extendedProps.Instructor || ''}</div>
            //     <div class="event-room">Room:${info.event.extendedProps.buildingAndRoom || ''}</div>
            //     <div class="event-crn">CRN: ${info.event.extendedProps.CRN || ''}</div>
           
            //     <div>&hellip;</div>
            // </div>
            // `
        };
    },
       
  


       eventClick: function(info) {
    console.log('Event clicked:', info.event);
    // Handle event click
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
</style>
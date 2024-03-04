<script lang="ts">
    import Calendar from '@event-calendar/core'
	import TimeGrid from '@event-calendar/time-grid'
	// import ResourceTimeGrid from '@event-calendar/resource-time-grid'
	import Filter from '../filter/+page.svelte'

	// the listData that was passed down from the parent component

	let eventList: any[] = []

    let ec
	let plugins = [TimeGrid]
	let options = {
		date: new Date('2024-01-08'),
		datesAboveResources: true,
		view: 'timeGridWeek',
		allDaySlot: false,
		hiddenDays: [0, 7],
		slotDuration: '00:30:00',
		slotMinTime: '06:00:00',
		slotMaxTime: '22:00:00',
		slotHeight: 128,
        height: '70%',
		titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
        eventBackgroundColor: '#275D38',
        headerToolbar: {start: '', center: '', end: ''},
		dayHeaderFormat: { weekday: 'long' },
		eventSources: [
			{
				events: function () {
					return eventList
				}
			}
		]
        
	}

	// filter to only professor specified
	function filterTheData(event) {
		eventList = event.detail.filteredData

		console.log(eventList)

		ec.refetchEvents()
	}
	
</script>


<div class="px-4 mt-8 md:flex md:justify-between">
	<div class="md:basis-4/12 mt-4">
		<!-- the ListData prop again gets passed down to the filter component -->
		<Filter on:filteredData={filterTheData} />
		<!-- <Filter {data}/> -->
	</div>
	
	<div class="md:basis-8/12 md:ml-4">
		<Calendar bind:this={ec} {plugins} {options} />
	</div>
</div>



<style>
	.ec {
		--ec-bg-color: #22272e;
	}
</style>
	
	
<!-- /* [{
    id: "1505",
    title: { html: "<p>DAGV 1300-001</p><p>Animation Essentials</p><p>MW 9am-9:50am</p>" },
    extendedProps: { building_room: "CS 502" },
    start: "2024-01-08T09:00:00",
    end: "2024-01-08T09:50:00"
}] */ -->




<!-- // 	let tempEventList = {
	// 		id: "1",
	// 		title: "Welcome to the UVU Scheduler, please add data to the calendar to get started!",
	// 		start: "2024-01-08T16:30:00", 
	// 		end:"2024-01-08T17:45:00",
	// 	}
	// 	eventList = [...eventList, tempEventList]
	// 	console.log(eventList)

	// events: [
	// 		{ 
	// 		id: "1",
	// 		title: "hello Mr.Rager",
	// 		start: "2024-01-08T16:30:00", 
	// 		end:"2024-01-08T17:45:00",
	// 		display: 'auto'
	// 	}
	// ] -->




	<!-- // beforeUpdate(() => {
	// 	let tempEventList = fullEventList.filter(
	// 		(item: any) => item?.extendedProps?.building_room === 'CS 509'
	// 	)

	// 	tempEventList.forEach((item: any) => {
	// 		let tempEvent = {
	// 			id: item.id,
	// 			title: item.title,
	// 			start: item.start,
	// 			end: item.end
    //             //We might add eventBackgroundColor: soon
	// 		}
	// 		eventList = [...eventList, tempEvent]
	// 	})

	// }) -->
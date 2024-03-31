<script lang="ts">
    import Calendar from '@event-calendar/core'
	import TimeGrid from '@event-calendar/time-grid'
	// import ResourceTimeGrid from '@event-calendar/resource-time-grid'
	import Filter from '../filter/+page.svelte'
	import {yearAndSeason} from '../mongodbData.js'
	import {filteredModal} from '../modals/messageModal.js'
	let width = "translate-x-[-110%]"
	let height = "translate-y-[100%]"

	
	
	let eventList: any[] = []

	// grabs the 'yearAndSeason' object from the mongodbData.js file and based on the data will configure the scheduler to show that date range and if there is no data it will default to the current date
	let year = $yearAndSeason.year
	let season = $yearAndSeason.season
	let semester: any
	if (season === 'Spring') {
		semester = `${year}-01-08`
	} else if (season === 'Summer') {
		semester = `${year}-05-08`
	} else if (season === 'Fall') {
		semester = `${year}-08-21`
	} else if (season === 'default') {
		semester = new Date().toISOString().slice(0, 10)
	}

    let ec: any
	let plugins = [TimeGrid]
	let options = {
		date: semester,
		datesAboveResources: true,
		view: 'timeGridWeek',
		allDaySlot: false,
		hiddenDays: [0, 7],
		slotDuration: '00:10:00',
		slotMinTime: '06:00:00',
		slotMaxTime: '22:00:00',
        // height: '80%',
		titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
        // eventBackgroundColor: '#275D38',
        headerToolbar: {start: '', center: '', end: ''},
		dayHeaderFormat: { weekday: 'long' },
		eventSources: [
			{
				events: function () {
					return eventList
				}
			}
		]

		// events: [
		// 	{
		// 		title: 'event 1',
		// 		start: '2024-01-08T13:00:00',
		// 		end: '2024-01-08T14:50:00',
		// 		backgroundColor: '#275D38'
		// 	},
		// 	{
		// 		title: 'event 2',
		// 		start: '2024-01-10T13:00:00',
		// 		end: '2024-01-10T14:50:00',
		// 		backgroundColor: 'red'
		// 	}
		// ]
        
	}


	// filter to only professor specified
	function filterTheData(event) {
		eventList = event.detail.filteredData
		console.log(eventList)
		filteredModal.set(false)
		ec.refetchEvents()
	}

	$: if ($filteredModal) {
		width = "translate-x-[0%]"
		height = "translate-y-[9%]"
	} else {
		width = "translate-x-[-110%]"
		height = "translate-y-[100%]"
	}
	
</script>


<div class="z-10 absolute top-22 w-96 bg-white p-4 shadow-md rounded-r-lg border border-l-0 border-primary {width} transition-all duration-300 hidden md:block">
	<Filter on:filteredData={filterTheData} />
</div>

<div class="z-10 fixed bottom-0 h-full w-full bg-white p-4 shadow-md rounded-t-lg border border-primary {height} transition-all duration-300 md:hidden">
	<Filter on:filteredData={filterTheData} />
</div>

<div class="">
	<div class="pb-20 px-4 md:pb-4">
		<Calendar bind:this={ec} {plugins} {options} />
	</div>
</div>
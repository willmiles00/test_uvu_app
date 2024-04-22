<script lang="ts">
    import { messageModal, titleModal, showModal, showOneOption, showTwoOptions, deleteProgressModal, deleteProgressBarModal, deleteProgressBarFinished, deleteProgress, file } from './messageModal.js'
    import {dataStore, yearAndSeason} from '../mongodbData.js'

    // import fullEventList from '../data/FullEventList.json'

    function closeModal() {
        showModal.set(false)
    }

    async function removeSchedules() {
        if ($dataStore.length === 0) {
            messageModal.set('There are no schedules to delete')
            titleModal.set('Error')
            showOneOption.set(true)
        } else {
            showModal.set(false)
            deleteProgressModal.set(true)
            deleteProgressBarModal.set(true)
            deleteProgress.set(0)

            const response = await fetch('./modals/delete', {
                method: 'DELETE'
            })
            return response.json()

            .then(() => {
                yearAndSeason.set({year: 'default', season: 'default'})
                file.set({fileName: 'No File'})
                deleteProgress.set(1)
            })

            .then(() => {
                dataStore.set([])
                console.log($dataStore)
                setTimeout(() => {
                    deleteProgressBarModal.set(false)
                    deleteProgressBarFinished.set(true)
                    deleteProgress.set(0)
                }, 1000)
            })

            .then(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    removeName().then(resolve);
                }, 1000)
            });
        })
        }

    }

    async function removeName() {
        const response = await fetch('./modals/deleteName', {
            method: 'DELETE',
        })
        return response.json()

        .then(() => {
            console.log('file name was changed to No File')
        })
        
    }
  
</script>

<!-- reuseable modal that will appear given the circumstances -->

{#if $showModal} 
    {#if $showOneOption}
        <!-- <div class="fixed flex justify-center z-50 w-full"> -->
        <div class="fixed z-30 w-full h-full flex justify-center items-center">
            <div class="bg-white border border-gray-300 rounded-md shadow-gray-400 shadow-md w-7/12 md:w-6/12 lg:w-5/12 border-l-8 border-l-primary">
                <div class="flex justify-start py-4 border-b border-gray-300 mx-4 gap-4 items-center">
                    <i class="fa-solid fa-circle-exclamation text-primary text-xl"></i>
                    <h1 class="font-bold text-primary text-xl font-raj">{$titleModal}</h1>
                </div>

                <p class="mx-4 my-6 text-black">{$messageModal}</p>

                <div class="flex justify-start bg-gray-100 rounded-b-md py-2 ml-4">
                    <button on:click={closeModal} class="py-2 px-6 text-white rounded-md bg-primary hover:bg-primaryDark font-raj uppercase font-semibold">Close</button>
                </div>
            </div>
        </div>
    {:else if $showTwoOptions}

        <!-- <div class="fixed flex justify-center z-50 w-full"> -->
        <div class="fixed z-30 w-full h-full flex justify-center items-center">
            <div class="bg-white border border-gray-300 rounded-md shadow-gray-400 shadow-md  w-7/12 md:w-6/12 lg:w-5/12 border-l-8 border-l-red-600">
                <div class="flex justify-start py-4 border-b border-gray-300 mx-4 items-center gap-4">
                    <i class="fa-solid fa-triangle-exclamation text-red-600 text-xl"></i>
                    <h1 class="font-bold text-red-600 text-xl font-raj">{$titleModal}</h1>
                </div>

                <p class="mx-4 my-6 text-black">{$messageModal}</p>

                <div class="flex justify-start bg-gray-100 rounded-b-md py-2 gap-4 pr-4 ml-4">
                    <div class="flex justify-center">
                        <button on:click={removeSchedules} class="py-2 px-6 text-white rounded-md bg-primary hover:bg-primaryDark uppercase font-raj font-semibold">Remove Schedules</button>
                        <!-- <button on:click={removeName}>DELETE ME</button> -->
                    </div>

                    <div class="flex justify-center">
                        <button on:click={closeModal} class="py-2 px-6 bg-third text-primary hover:text-white hover:bg-primary  uppercase font-raj font-semibold rounded-md">cancel</button>
                    </div>
                    
                </div>
            </div>
        </div>
    {/if}
{/if}


<script lang="ts">
    import Calendar from '$lib/components/Calendar.svelte'
    import { createEventDispatcher } from 'svelte'
    import { messageModal, titleModal, progressBarModal, progress, progressBarFinished, progressModal, showImportModal, file } from '../modals/messageModal.js'
    import Message from '../modals/modal.svelte'
    import ImportModal from '../modals/importModal.svelte'
    import {dataStore} from '../mongodbData.js'
    // import { simulateMain } from './convertCSV2JSON'
//testing merge
    const dispatch = createEventDispatcher()
    let selectedFile = {}
    let emptyFile = true
    let existingfile = false
    
    // closes the import modal
    function closeCSVModal() {
        dispatch('closeCSVModal')
    }

    function openFiles() {
        // creates an input element to trigger the file picker that also triggers the handleFileChange function
        const input = document.createElement('input')
        input.type = 'file'
        input.onchange = handleFileChange
        input.click()
    }

    function handleFileChange(event) {
        // console.log('event:', event)
        // we take the selectedFile variable and set it to the first file in the event target
        selectedFile = event.target.files[0] 
        // switches the shown text to the file name
        emptyFile = false
        existingfile = true
        // console.log('selected file:', selectedFile)
        // selectedFile = {...selectedFile}
       
    }

    // Takes the file that is uploaded and sends it to server 1 (server.ts) to be converted to JSON
async function insertFileToFilters() {
    try {
        if (selectedFile && selectedFile.name) {
            if ($file.fileName == 'No File') {
                titleModal.set('File Already Exists')
                messageModal.set('There is already a file uploaded. Please delete the current file and try again.')
                showImportModal.set(true)
                emptyFile = true
                selectedFile = {}
            }
            else if (selectedFile.name.toLowerCase().endsWith('.csv')) {
                const formData = new FormData()
                formData.append('file', selectedFile)
                
                file.set({fileName: selectedFile.name})
                progressModal.set(true)
                progressBarModal.set(true)
                progress.set(0)


                const response = await fetch ('./importCSV/convert', {
                    method: 'POST',
                    body: formData,
                })
                const data = await response.json()
                // console.log(data)

                .then(() => {
                    emptyFile = true
                    selectedFile = {}
                    return new Promise((resolve) => {
                        progress.set(1)
                        setTimeout(() => {
                            updateLists().then(resolve)
                        }, 500)
                    })
                })

                .then(() => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            updateFileName().then(resolve)
                        }, 500)
                    });
                })
                .then(() => {
                    progress.set(0)
                    progressBarModal.set(false)
                    progressBarFinished.set(true)
                })

            } else {
                titleModal.set('Invalid File Type')
                messageModal.set('The file you uploaded is not a CSV file. Please upload a CSV file and try again.')
                showImportModal.set(true)
                emptyFile = true
                selectedFile = {}
            }
        } else {
            titleModal.set('No File Selected')
            messageModal.set('No file was detected at import. Please try again.')
            showImportModal.set(true)
        }
    } catch (error) {
        console.error('Error:', error)
       
    }
}

// updates the datastore list of events 
async function updateLists() {
    const response = await fetch('./importCSV/updateList')
    const data = await response.json()
    dataStore.set(data)
}

// adds the filename to the database
async function updateFileName() {
    const response = await fetch ('./importCSV/fileName', {
        method: 'POST',
        body: JSON.stringify($file),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.json()
}

</script>


<Message />
<ImportModal />

<div class="w-full h-full flex items-center justify-center">

    <div class=" border border-gray-300 bg-white rounded-md shadow-md shadow-gray-400 h-4/6 w-4/6">
        
        <div class="h-1/6 relative bg-secondary rounded-t-md">
            <div class="absolute z-10 right-4 w-full h-full flex justify-end items-center">
                <button on:click={closeCSVModal} class="fa-solid fa-circle-xmark text-xl text-third hover:text-white"></button>
            </div>
            <div class="h-full flex items-center justify-center py-4">
                <h1 class="text-4xl text-white text-center font-raj">Import CSV </h1>
            </div>
        </div>
        

        <div class="h-4/6 flex justify-center items-center">
            <div>
                <div class="basis-full flex justify-center">
                    <button class="fa-solid fa-upload bg-primary rounded-full text-white text-4xl text-center p-6 hover:shadow-md hover:shadow-gray-400 hover:translate-y-[-4px] hover:bg-primaryDark transition-all duration-300" on:click={openFiles}></button>
                </div>

                <div class="basis-full flex justify-center mt-4">
                    {#if emptyFile}
                        <p class="font-bold font-raj">Click to upload CSV file</p>
                    {:else if existingfile && selectedFile.name.toLowerCase().endsWith('.csv')}
                        <p class="filename font-bold text-gray-500">{selectedFile.name}</p>
                    {:else if existingfile}
                        <p class="font-bold text-red-600">Unable to process this type of file</p>
                    {/if}
                </div>
            </div>
        </div>

        <div class="h-1/6 flex justify-center items-end">
            <div class="mb-8">
                <button class="bg-primary text-white hover:bg-primaryDark px-10 py-2 rounded-md mr-8 font-medium font-raj uppercase text-sm " on:click={insertFileToFilters}>Import</button>
                <button class="bg-third text-primary px-10 py-2 rounded-md hover:bg-primary hover:text-white font-medium font-raj uppercase text-sm " on:click={closeCSVModal}>Cancel</button>
            </div>
        </div>
    </div>


</div>
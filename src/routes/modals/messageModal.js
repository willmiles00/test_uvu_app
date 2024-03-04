/* writable stores for our modal */

import { writable } from 'svelte/store'

// shows the title of the modal
export const titleModal = writable('')
// shows the message of the modal
export const messageModal = writable('')
// unhides the modal to show the modal
export const showModal = writable(false)
// shows the first type of modal with one button
export const showOneOption = writable(false)

// shows the second type of modal with two buttons and different styled title
export const showTwoOptions = writable(false)

// stores for the progress bar and its modal
export const progress = writable('0')
export const progressBarModal = writable(false)
export const progressBarFinished = writable(false)
export const progressModal = writable(false)

// store for the importCSV modals (invalid file)
export const showImportModal = writable(false)

// store for the "remove all Schedules" button and its modal
export const deleteProgress = writable('0')
export const deleteProgressBarModal = writable(false)
export const deleteProgressBarFinished = writable(false)
export const deleteProgressModal = writable(false)


// store for the file that gets uploaded
export const file = writable({})
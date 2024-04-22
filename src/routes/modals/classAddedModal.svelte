<script>
    import { createEventDispatcher } from 'svelte'
    let dispatch = createEventDispatcher()

    function closeModal() {
        dispatch('closeAddedClassModal')
    }
</script>



<div class="w-full flex justify-center">
    <div class="bg-white border border-gray-300 rounded-md w-9/12 md:w-8/12 lg:w-7/12 m-4 shadow-gray-400 shadow-md">
        <div class="flex justify-start py-4 border-b border-gray-300 mx-4">
            <h1 class="font-bold text-primary font-raj text-xl">Class Added</h1>
        </div>
    
        <p class="m-4 text-black">Your new class has been added successfully</p>
    
        <div class="flex justify-start bg-gray-100 rounded-b-md py-2 pl-4">
            <button on:click={closeModal} class="py-2 px-6 bg-primary text-white rounded-md hover:bg-primaryDark uppercase font-raj font-semibold">Close</button>
        </div>
    </div>
</div>


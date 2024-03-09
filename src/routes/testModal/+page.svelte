<script>
    import {progress } from '../modals/messageModal.js'

</script>

<div class="h-screen bg-white flex items-center justify-center">
    <div class="w-6/12 h-3/6 border text-black ">
        <div class="bg-red-400 p-4">
            <!-- <div class="border bg-gray-500 w-full h-[8px] rounded-full "> -->
                <progress class=" h-[12px] rounded-full bg-red-800 progress-bar bg-white border border-gray-200" value={$progress}></progress>
            <!-- </div> -->
        </div>
    
        <button on:click={() => progress.set(0)}>
            0%
        </button>
    
        <button on:click={() => progress.set(0.25)}>
            25%
        </button>
    
        <button on:click={() => progress.set(1)}>
            100%
        </button>
    </div>
</div>

<style>
    .progress-bar::-webkit-progress-bar {
      @apply bg-white;
    }
    
    .progress-bar::-webkit-progress-value {
      @apply bg-primary;
    }
    
    .progress-bar::-moz-progress-bar {
      @apply bg-primary;
    }
    </style>
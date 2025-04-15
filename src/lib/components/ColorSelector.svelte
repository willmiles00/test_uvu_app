<script lang="ts">
export let selectedColor = '';
export let pairingColor = '';
 const colors = [
    { mainColor: '#B7DAB2', complementColor: '#000000' },
    { mainColor: '#71BF44', complementColor: '#000000' },
    { mainColor: '#86C8BC', complementColor: '#000000' },
    { mainColor: '#99D5E9', complementColor: '#000000' },
    { mainColor: '#FBD865', complementColor: '#000000' },
    { mainColor: '#8B87A1', complementColor: '#000000' },
    { mainColor: '#E18E4D', complementColor: '#000000' },
    { mainColor: '#EA866E', complementColor: '#000000' },
    { mainColor: '#DCDCDD', complementColor: '#000000' }
  ];

   function selectColorHandler(color: string, complementColor: string) {
    selectedColor = color;
    pairingColor = complementColor;
  }
</script>

<div class="color-selector">
    <label class="block text-[#275D38] font-medium font-primary">Color</label>
   
    <div class="color-options w-[836px]">
      {#each colors as color}
        <button
          class="color-option w-[24px] h-[24px] rounded-full mx-[4px]"
          style="background-color: {color.mainColor};"
          type="button"
          on:click={() => selectColorHandler(color.mainColor, color.complementColor)}
        > {#if color.mainColor == selectedColor}
        <span class="checkmark">✓</span>
      {/if}
      </button>
      {/each}
    </div>
  </div>
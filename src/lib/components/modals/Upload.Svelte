<script lang="ts">
let doNothing = () => {};
</script>

<div class="bg-black bg-opacity-50 w-full h-fit fixed top-0 left-0 min-h-full flex justify-center">
	<div class="relative">
		<div
			class="flex flex-wrap bg-white m-10 rounded-[8px] w-fit md:min-w-[620px] max-w-[620px] h-fit max-h-[600px] overflow-auto shadow-xl custom-scrollbar upload-modal min-h-[226px]"
		>
			<p
				class="w-full text-white uppercase bg-[#00843D] text-[31px] flex items-center px-[24px] py-[12px] font-primary-semibold"
			>
				Import .CSV
			</p>
			<form class="w-full" on:submit|preventDefault={doNothing}>
				<div class="flex flex-wrap justify-center items-center">
					<label
						for="file-upload"
						class="custom-file-upload flex flex-wrap justify-start items-center mt-2 w-[438px] rounded-[8px]"
					>
						<p
							class="flex flex-wrap justify-center items-center btn bg-uvu-green text-white p-2 uppercase rounded-[8px]"
						>
							Choose File
						</p>
			
							<p class="text-[#DDDDDD] border-[#DDDDDD] border-2 rounded-[8px] p-[6px] border-l-0">
								{doNothing}
							</p>
					
							<p class="border-[#DDDDDD] border-2 rounded-[8px] h-full p-[6px] border-l-0">
								{doNothing}
							</p>
					
					</label>
				</div>

				<input
					class="my-3 input text-black max-w-[620px] rounded-none bg-white border-2 !border-black"
					type="file"
					accept=".csv"
					name="fileUpload"
					id="file-upload"
					 on:change={doNothing}
				/>
				<div class=" flex m-2 justify-end">
					<button
						class=" bg-[#DDDDDD] p-2 rounded-md flex flex-col justify-center items-center text-uvu-green mr-2 uppercase text-sm"
						on:click={doNothing}>Cancel</button
					>
					<button
						class=" bg-[#DDDDDD] p-2 rounded-md flex flex-col justify-center items-center text-uvu-green uppercase text-sm"
						type="submit">Upload</button
					>
				</div>
			</form>
		</div>
	</div>
</div>


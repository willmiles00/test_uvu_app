
# UVU Scheduling App (V.0.0.1)


## Live Site: https://test-uvu-app.vercel.app/


## Things for Developers to Know:

- This is a SvelteKit based app. It is built using the Skeleton.dev library.
- The calendar functionality comes from a Github repo, "Calendar" by Vkurko: https://github.com/vkurko/calendar The documentation is a little robust, but I'll do my best to summarize the functionalties we use here
- CSV parsing comes from the PapaParse NPM Package: https://www.papaparse.com/
- Stale site: https://test-uvu-app-stale.vercel.app/ this is a snapshot of the progress of the capstone as of the Fall 2024 semester.
- Special CSS classes can be found in the PostCSS file
- Importing CSV's is a pain in the butt. I did my best to document it, but to sum it up: 
    - use the file <input> function to allow a user to upload their document. Make sure this is in a form for easy event submission
    -  on form submission, pass the CSV data into a function that uses papaparse to turn the data into readable information (there are a good amount of videos on YouTube that show how papaparse works. I believe in you.)
    - turn parsed data into calendar events that display on the Vkurko calendar (the documentation isn't great so I recommend reading the notes I left. I also recommend reading the 'discussion' tab on the vkruko repo, as a lot of the problems I had were ansered there.)

    2/8/25
    -Timeblock interface! Use this to model all timeblocks. Can be found at: $lib/types/Timeblock.ts
    -parseCSV became async
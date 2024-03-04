<script>
    import { createEventDispatcher } from 'svelte'
    let dispatch = createEventDispatcher()

    function closeModal() {
      dispatch('closeModal')
    }
</script>

<div class="addClassComponent p-4 bg-white rounded-md shadow-lg">
  <h1 class="">Section Information</h1>

  <input type="text" placeholder="Title">

  <input type="number" placeholder="Section">

  <input type="number" placeholder="Credit Hours">

  <select>
      <option value="">Status</option>
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
  </select>

  <select>
      <option value="">Special Approval</option>
      <option value="Active">None Assigned</option>
      <option value="Inactive">Department Approval Required</option>
      <option value="Inactive">Contact Internship Coordinator</option>
  </select>

  <select>
      <option value="">Grade Mode</option>
      <option value="Active">Standard Letter</option>
      <option value="Inactive">Credit/No Credit</option>
  </select>

  <select>
      <option value="">Final Exam</option>
      <option value=""></option>
      <option value=""></option>
  </select>

  <select>
      <option value="">Cross-list With</option>
      <option value=""></option>
      <option value=""></option>
  </select>

  <select>
      <option value="">Part of Term</option>
      <option value=""></option>
      <option value=""></option>
  </select>

  <select>
      <option value="">Campus</option>
      <option value=""></option>
      <option value=""></option>
  </select>

  <select>
      <option value="">Instructional Method</option>
      <option value=""></option>
      <option value=""></option>
  </select>

  <select>
      <option value="">Visible</option>
      <option value=""></option>
      <option value=""></option>
  </select>

  <select>
      <option value="">Schedule Type</option>
      <option value=""></option>
      <option value=""></option>
  </select>

  <input type="text" placeholder="URL">

  <select>
      <option value="">Session</option>
      <option value=""></option>
      <option value=""></option>
  </select>

  <input type="text" placeholder="Restrictions">


  <h1>Section Attributes</h1>
  <textarea placeholder="HY - Hybrid Delivery"></textarea>


  <h1>Course Attributes</h1>
  <textarea placeholder="Lab Access fee of $45 applies"></textarea>


  <h1>Instructor</h1>
  <input type="text" placeholder="Instructor Name">


  <h1>Building and Room</h1>
  <input type="text" placeholder="CS 509">


  <h1>Meeting Pattern</h1>
  <select>
      <option value="">Session</option>
      <option value="MTWR">MTWR 50 Min</option>
      <option value="MWF">MWF 75 Min (50 Min Friday)</option>
      <option value="TRF">TRF 75 Min (50 Min Friday)</option>
      <option value="MW">MW 100 Min</option>
      <option value="Custom">Custom</option>
  </select>


  <h1>Enrollment</h1>
  <input type="number" placeholder="Maximum">
  <input type="number" placeholder="Waitlist Maximum">


  <h1>Section Text - Visible in student views</h1>
  <textarea placeholder="Description"></textarea>


  <h1>Comments</h1>
  <textarea placeholder="Details for ASO and/or Justifications for Dean/FM approvals. e.g. Animation Cohort"></textarea>


  <div class="flex justify-end">
      <button class="closeModalBTN mr-10" on:click={closeModal}>Close</button>
      <button class="saveClass">Save</button>
  </div>
</div>



<style>
  .addClassComponent {
      border: 1px solid #275D38;
  }
</style>
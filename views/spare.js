<!-- TASK MODALS SECTION  -->

<!--Edit Task Modal -->
<div class="modal fade" id="editTaskModal<%=task.id%>" tabindex="-1" aria-labelledby="editTaskModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <form class="" action="" method="">
        <input type="hidden" id="editTaskId<%=task.id%>" name="id" value="" />
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Edit Task</h5>
        </div>
        <div class="modal-body">
          <div class="input-group">
            <input autocomplete="off" id="editTaskDescription<%=task.id%>" pattern="[a-zA-Z0-9-_. ]{1,25} " title="Please enter 1 to 25 characters" name="taskDescription" class="form-control" required>
          </div>
          <div class="input-group">
            <input data-toggle="tooltip" data-placement="bottom" title="Must be later than today" id="deadLineEntry<%=task.id%>" type="date" name="" value="" class="form-control">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="submit" id="confirmEditTask<%=task.id%>" class="confirmEditTask btn btn-primary">Edit Task</button>
        </div>
      </form>
    </div>
  </div>
</div>

<!--Delete Task Modal -->
<div class="modal fade" id="deleteTaskModal<%=task.id%>" tabindex="-1" aria-labelledby="exampleformModal" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <form class="" action="" method="">
        <div class="modal-header">
        </div>
        <div class="modal-body">
          <h3>Do you want to delete this task?</h3>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          <button type="button" id="confirmDeleteTask<%=task.id%>" class="confirmDeleteTask btn btn-danger ">Delete Task</button>
        </div>
      </form>
    </div>
  </div>
</div>



<%})%>


<!-- PROJECT MODALS SECTION  -->
<!--Edit Project Title Modal -->
<div class="modal fade" id="editProjectTitleModal<%=project.id%>" tabindex="-1" aria-labelledby="exampleformModal" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <form class="" action="" method="">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Edit Title</h5>
        </div>
        <div class="modal-body">
          <div class="input-group">
            <input id="editProjectNameInput<%=project.id%>" autocomplete="off" pattern="[a-zA-Z0-9 ].{1,25}" title="1 to 25 characters" class="form-control" aria-label="With textarea" placeholder="Enter new title" required></input>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="submit" id="confirmEditProjectName<%=project.id%>" class="btn btn-primary">Save changes</button>
        </div>
      </form>
    </div>
  </div>
</div>
</div>

<!--Delete Project Modal -->
<div class="modal fade" id="deleteProjectModal<%=project.id%>" tabindex="-1" aria-labelledby="deleteProjectModal" aria-hidden="true">
<div class="modal-dialog">
  <div class="modal-content">
    <form class="" action="index.html" method="post">
      <div class="modal-body">
        <h3>Do you want to delete this project?</h3>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" id="confirmDeleteProject<%=project.id%>" class="btn btn-primary">Delete</button>
      </div>
    </form>
  </div>
</div>
</div>


<!--Enter Dead Line Modal -->
<div class="modal fade" id="editDeadLineModal<%=project.id%>" tabindex="-1" aria-labelledby="exampleformModal" aria-hidden="true">
<div class="modal-dialog modal-sm">
  <div class="modal-content">
    <form class="" action="" method="">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Enter Deadline</h5>
      </div>
      <div class="modal-body">
        <input id="deadLineInput<%=project.id%>" type="date" name="" value="" required>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button id="confirmEditDeadline<%=project.id%>" type="button" class="btn btn-primary">Edit Deadline</button>
      </div>
    </form>
  </div>
</div>
</div>

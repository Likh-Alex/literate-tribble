$(document).ready(function() {
  // Initialize tooltips
  $('[data-toggle="tooltip"]').tooltip()
  // Delegate tooltips to body
  $("body").tooltip({
    selector: '[data-toggle="tooltip"]'
  });



  // Add new TODO list
  $("body").delegate("#addNewProjectBtn", "click", function() {
    $(this).off()
    $("#newProjectModal").on('show.bs.modal', function() {
      $(this).off()
      var url = '/addNewList';

      $(".confirmNewList").on("click", function(event) {
        $(".confirmNewList").off();
        var newListTitle = $("#newListNameInput").val()
        if (newListTitle.length < 1) {
          alert("Please enter the list name")
        } else {
          if (newListTitle.length >= 1 && newListTitle.length <= 25) {
            event.preventDefault();
            // Send ajax to server
            $.post({
              url: url,
              data: {
                listName: newListTitle
              },
              success: function(result) {
                $("#newProjectModal").modal('hide')
                $("#newListNameInput").val('');

                // If Success - append new List into DOM
                var id = result.data.id
                var name = result.data.name
                var newProject = "<div class='project col-4' id='project" + id + "'> <div class='projectHeader'> <div class='projectTitle'> <span> <a data-toggle='modal' data-target='#editDeadLineModal'> <i data-id='" + id + "' class='projectDeadline far fa-calendar-alt fa-2x' data-toggle='tooltip' data-placement='top' title='Set Deadline'></i>   </a> </span> <h5 class='projectName " + id + "'>" + name + "</h5> <div class='projectButtons'> <span data-toggle='tooltip' data-placement='top' title='Edit Project Title'> <a data-toggle='modal' data-target='#editProjectTitleModal'> <i id='editProjectName' class='editProject fas fa-pencil-alt' data-name='" + name + "' data-id='" + id + "'></i> </a> </span> <i class='separatorDash fas fa-minus'></i> <span data-toggle='tooltip' data-placement='top' title='Delete Project'> <a data-toggle='modal' data-target='#deleteProjectModal'> <i id='deleteProject>' class='deleteProject far fa-trash-alt' data-id='" + id + "'></i> </a> </span> </div> </div> </div> <form class='' action='' method=''>  <div class='inputTab'>    <div class='plusButton fas fa-plus'></div>    <input id='inputNewTask" + id + "' data-toggle='tooltip' data-placement='top' title='Please enter 1 to 50 characters' data-description='data-description' class='inputField' minlength='1' maxlength='50' pattern='[A-Za-z].{1-50}'      autocomplete='off' name='taskDescription' value='' type='text' placeholder='  Start typing here to create a task...' required>    <button id='addButton " + id + "' data-id='" + id + "' class='addButton' type='submit' value='Submit'><p>Add task</p></button></div></form><div class='taskList " + id + "' id='taskList" + id + "'></div>"
                $('.projects').append(newProject)
                var projectTitle = document.getElementsByClassName('projectName ' + id)[0]
                projectTitle.setAttribute("data-toggle", "tooltip", "data-placement", 'top', 'title', '', 'data-original-title', '')
              },
              // If not - give error
              error: function(err) {
                // $("#newProjectModal").on();
                console.log(err);
              }
            })
          }
        }
      })
    })
  })


  // Set Deadline for Project
  $("body").delegate(".projectDeadline", "click", function() {
    var today = new Date()
    url = '/setProjectDeadline'
    var projectId = $(this).attr('data-id')
    var projectName = $(this).attr('data-name')
    $("#confirmEditDeadline").on("click", function(event) {
      $(this).off();
      event.preventDefault();
      // Grab value entered in deadline input
      var deadline = new Date($("#deadLineInput").val())
      // If deadline is valid make post request
      if (deadline > today) {
        $.post({
          url: url,
          data: {
            projectDeadline: deadline.toISOString(),
            projectID: projectId
          },
          success: function(result) {
            // On success - Insert into Project Name tooltip new value of Deadline entered
            $("#editDeadLineModal").modal('hide')
            // Clear input when modal hidden
            $('#editDeadLineModal').on('hidden.bs.modal', function() {
              $(this).find('form').trigger('reset');
            })
            var title = document.getElementsByClassName('projectName ' + projectId)
            title[0].setAttribute('data-original-title', 'Deadline: ' + deadline.toDateString())
            console.log("setting project Deadline for Project");
          },
          error: function(err) {
            console.log(err);
          }
        })
        // If no entry give alert and Hide modal
      } else {
        alert("Deadline must be later than today")
        $("#editDeadLineModal").modal('hide')
      }
    })
  })


  // Edit Project Title by ID
  $("body").delegate(".editProject", "click", function() {
    // Grab project's ID
    var editProjectId = $(this).attr('data-id');
    // Fill current title into the modal input field
    var currentTitle = document.getElementsByClassName('projectName ' + editProjectId)[0].innerText;
    $("#editProjectNameInput").val(currentTitle)
    var url = '/editProjectName';
    $('#confirmEditProjectName').on("click", function(event) {
      $(this).off();
      var newTitle = $("#editProjectNameInput").val();
      // If title are same - give alert
      if (currentTitle === newTitle) {
        event.preventDefault();
        alert("New Title should be different")
      }
      // If length requirement is satisfied - send post request
      if (newTitle.length > 1 && newTitle.length <= 25) {
        event.preventDefault();
        $.post({
          url: url,
          data: {
            projectName: newTitle,
            projectID: editProjectId
          },
          success: function(result) {
            // On success - hide modal and Change Project element name to new value
            $("#editProjectTitleModal").modal('hide')
            document.getElementsByClassName('projectName ' + editProjectId)[0].innerText = newTitle;
          },
          error: function(err) {
            console.log(err);
          }
        })
      } else {
        // If length requirement is not satisfied - give alert
        alert("List name must be 1-25 characters")
      }
    })
  })




  // Delete Project by ID
  $("body").delegate(".deleteProject", "click", function() {
    $(this).off();
    // Grab ID
    var deleteProjectId = $(this).attr('data-id');
    var url = '/deleteProject';
    // alert(deleteProjectId)
    $("#deleteProjectModal").on('show.bs.modal', function() {
      $(this).off();
      // alert("i'm modal")
      $("#confirmDeleteProject").on("click", function(event) {
        $("#confirmDeleteProject").off();
        // alert("i'm clicked")
        event.preventDefault();
        $.post({
          url: url,
          data: {
            id: deleteProjectId
          },
          success: function() {
            // On success hide modal and remove element from DOM
            $('#project' + deleteProjectId).remove();
            $("#deleteProjectModal").modal('hide');
            console.log("deleting project");
          },
          error: function(err) {
            console.log(err);
          }
        })
      })
    });
  })



  //Add new task
  $("body").delegate(".addButton", "click", function(event) {
    event.preventDefault()
    // Grab Project ID and Value of IT's particular inputField
    var thisProjectId = $(this).attr("data-id");
    var newTask = $("#inputNewTask" + thisProjectId).val()
    var url = '/submitTask';
    // Validate length
    $(".addButton").off();
    if (newTask.length >= 1 && newTask.length <= 50) {

      $.post({
        url: url,
        data: {
          name: newTask,
          id: thisProjectId
        },
        success: function(results) {
          // On success - Clear new task input Field
          $("#inputNewTask" + thisProjectId).val('')
          // Assign results to new variable

          var id = results.data.id
          var name = results.data.name
          var status = results.data.status
          var project_id = results.data.project_id
          var deadline = results.data.deadline
          var priority = results.data.priority
          var completed = results.data.completed
          // Create element with Task data
          var newTask = "<div class='taskRow' id='taskRow" + id + "' data-toggle='tooltip' data-placement='bottom' title=''> <div class='doneMark'> <span> <input id='doneMark " + id + "' data-priority='" + priority + "' type='checkbox' data-id='" + id + "' data-completion='" + completed + "' name='doneTaskMark'>      </span> </div>    <div class='separator'></div>    <div class='taskDescription " + id + "' id='taskDescription" + id + "'> <span id='task" + id + "'>" + name + "</span> </div>    <div class='taskOptions'> <span data-toggle='tooltip' data-placement='left' title='Set Priority'> <a class='dropdown' id='dropdownMenuButton" + id + "' data-id='" + id + "' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'> <i class='setTaskPriority fas fa-sort' data-id='" + id + "' data-priority='" + priority + "'></i>  <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'> <a class='dropdown-item priority" + id + "' style='color: red;' data-value='4'>Urgent</a> <a class='dropdown-item priority" + id + "' style='color: orange;' data-value='3'>High</a> <a class='dropdown-item priority" + id + "' style='color: blue;' data-value='2'>Normal</a> <a class='dropdown-item priority" + id + "' style='color: grey;' data-value='1'>Low</a> </div> </a> </span> <i class='separatorDash fas fa-minus'></i> <span data-toggle='tooltip' data-placement='left' title='Edit task'> <i id='editTask " + id + "' class='editTask fas fa-pencil-alt' data-id='" + id + "' data-description='" + name + "' data-toggle='modal' data-target='#editTaskModal'></i></span> <i class='separatorDash fas fa-minus'></i> <span data-toggle='tooltip' data-placement='left' title='Delete task'> <a data-toggle='modal' data-target='#deleteTaskModal'> <i class='deleteTask fas fa-trash-alt' data-id='" + id + "'></i> </a> </span> </div> </div>"
          // Prepend element to Task list of it's project
          $('#taskList' + project_id).prepend(newTask)
          console.log("Task " + name + " added with ID " + id);
        },
        error: function(err) {
          console.log(err);
        }
      })
      // If length not validated give alert
    } else {
      alert("Please match requested format")
    }
  })


  // Mark task as DONE/UNDONE
  $("body").delegate('input[type="checkbox"]', "click", function() {
    // Grab all data of checbox of certain task
    var taskCompletion = true;
    var taskStatus = "Completed"
    var markTaskId = $(this).attr("data-id")
    var priority = $(this).attr("data-priority")
    var url = '/markdone';
    // If checked Done - change taskCompletion value to true
    if ($(this).prop("checked") === true) {
      taskCompletion = true
      // Else do the opposite
    } else if ($(this).prop("checked") === false) {
      taskCompletion = false
      taskStatus = "In progress"
    }
    $(this).off()
    // Send post request
    $.post({
      url: url,
      data: {
        id: markTaskId,
        priority: priority,
        completion: taskCompletion,
        status: taskStatus
      },
      success: function(results) {
        console.log("Check done/undone " + markTaskId);
        // Check if task has priority image
        var imageSpan = document.getElementById('imgSpan' + markTaskId)
        // task description field
        var parent = document.getElementById('taskDescription' + markTaskId)

        // If checked as Done
        if (taskCompletion === true) {
          // Add class "done"
          parent.classList.add('done')
          // Disable priority button
          $('#dropdownMenuButton' + markTaskId).prop('disabled', true);
          // Disable tooltips
          $('#taskRow' + markTaskId).tooltip('disable')
          // If element has an priority image - hide image
          if (imageSpan) {
            imageSpan.classList.add('hidden')
          }
          // Else do opposite
        } else if (taskCompletion === false) {
          // Remove class done
          parent.classList.remove('done')
          // Enable priority button
          $('#dropdownMenuButton' + markTaskId).prop('disabled', false);
          // Enable tooltips
          $('#taskRow' + markTaskId).tooltip('enable')
          // If has image - show image
          if (imageSpan) {
            imageSpan.classList.remove('hidden')
          }
        }
      },
      error: function(err) {
        console.log(err);
      }
    })
  });


  // Set priority for Task
  $("body").delegate(".setTaskPriority", "click", function() {
    var priorityTaskId = $(this).attr("data-id");
    console.log(priorityTaskId);
    var url = '/editPriority'
    // check if element has class "done"
    var element = $('#taskDescription' + priorityTaskId)
    $(this).off();
    // If has - disable button and alert
    if (element.hasClass("done")) {
      $('#dropdownMenuButton' + priorityTaskId).prop('disabled', true);
      alert("Task is complete")
    }
    $(".priority" + priorityTaskId).on("click", function() {
      var newPriority = $(this).attr("data-value");
      // Validate entry
      if (newPriority >= 1 && newPriority <= 4) {
        $.post({
          url: url,
          data: {
            priority: newPriority,
            id: priorityTaskId
          },
          success: function(result) {
            // On success - target element with priority Image
            var oldImg = document.getElementById("imgSpan" + priorityTaskId)
            // If element has image - change priority
            if (oldImg) {
              oldImg.setAttribute('src', 'images/priority' + newPriority + '.png')
              // Else prepend image into Task description
            } else {
              newImg = '<img id="imgSpan' + priorityTaskId + '" class="imgSpan" src="images/priority' + newPriority + '.png" alt="Img">'
              $('#taskDescription' + priorityTaskId).prepend(newImg)
            }
          },
          error: function(err) {
            console.log(err);
          }
        })
        // If not validated - give alert
      } else {
        alert("Wrong priority")
      }
    })

  })

  //Edit existing task by ID
  $("body").delegate(".editTask", "click", function() {
    // Grab task data
    var editTaskId = $(this).attr("data-id");
    $(this).off();
    $("#editTaskId").val($(this).attr("data-id"));
    // Fill input field with current task description
    $("#editTaskDescription").val(document.getElementById('task' + editTaskId).innerText);
    var url = '/edit';
    $("#confirmEditTask").on("click", function(event) {
      $(this).off();
      event.preventDefault()
      // Check newTask for requirements
      var newTask = $("#editTaskDescription").val();
      if (newTask.length < 1 || newTask.length > 50) {
        // If no match - alert and hide modal
        alert("Please match requested format")
        $("#editTaskModal").modal('hide')
      } else {
        // If match - check if Deadline entered
        var today = new Date()
        var deadline = new Date($("#deadLineEntry").val())
        if (today >= deadline) {
          // Check if deadline is valid
          alert("Deadline must be later than today")
        } else {
          // If all valid make post request
          $.post({
            url: url,
            data: {
              task: newTask,
              deadline: deadline.toLocaleString(),
              id: editTaskId
            },
            success: function(result) {
              // On success hide modal and replace task text with new value
              $("#editTaskModal").modal('hide')
              // Clear input when modal hidden
              $('#editTaskModal').on('hidden.bs.modal', function() {
                $(this).find('form').trigger('reset');
              })
              $('#task' + editTaskId).text(newTask)
              // If deadline is valid Set TaskRow tooltip with Deadline value
              if (result.deadline !== 'Invalid Date') {
                document.getElementById('taskRow' + editTaskId).attributes[5].value = "Deadline " + deadline.toDateString();
              }
            },
            error: function(err) {
              console.log(err);
            }
          })
        }
      }
    })
  })


  //Delete Task by ID
  $("body").delegate(".deleteTask", "click", function() {
    $('.deleteTask').off();
    // Grab task ID
    var delTaskId = $(this).attr("data-id");
    $("#deleteTaskModal").on('show.bs.modal', function() {
      var url = '/deletetask'
      // On confirming deleting task - send post request
      $("#confirmDeleteTask").on("click", function(event) {
        $("#confirmDeleteTask").off();
        event.preventDefault();
        $.post({
          url: url,
          data: {
            id: delTaskId
          },
          success: function(result) {
            // On success - hide modal and remove task from DOM
            $("#deleteTaskModal").modal('hide');
            $('#taskRow' + delTaskId).remove();
          },
          error: function(err) {
            console.log(err);
          }
        });
      })
    });
  });


});

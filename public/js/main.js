$(document).ready(function() {

  $('[data-toggle="tooltip"]').tooltip()
  $("body").tooltip({
    selector: '[data-toggle="tooltip"]'
  });

  // Add new TODO list
  $("body").delegate("#addNewProjectBtn", "click", function() {
    // $("#addNewProjectBtn").off();
    // alert('Ok')
    $("#newProjectModal").on('show.bs.modal', function() {
      $(this).off();
      // alert("modal")
      var url = '/addNewList';
      $(".confirmNewList").on("click", function(event) {
        $(".confirmNewList").off();
        var newListTitle = $("#newListNameInput").val()
        // alert(newListTitle)
        if (newListTitle.length < 1) {
          alert("Please enter the list name")
        } else {
          if (newListTitle.length >= 1 && newListTitle.length <= 15) {
            event.preventDefault();
            $.post({
              url: url,
              data: {
                listName: newListTitle
              },
              success: function(result) {
                $("#newProjectModal").modal('hide')
                $("#newListNameInput").val('');
                // window.location.href = '/tasks'
                var id = result.data.id
                var name = result.data.name
                var newProject = "<div class='project col-4' id='project" + id + "'> <div class='projectHeader'> <div class='projectTitle'> <span> <a data-toggle='modal' data-target='#editDeadLineModal'> <i data-id='" + id + "' class='projectDeadline far fa-calendar-alt fa-2x' data-toggle='tooltip' data-placement='top' title='Set Deadline'></i>   </a> </span> <h5 class='projectName " + id + "'>" + name + "</h5> <div class='projectButtons'> <span data-toggle='tooltip' data-placement='top' title='Edit Project Title'> <a data-toggle='modal' data-target='#editProjectTitleModal'> <i id='editProjectName' class='editProject fas fa-pencil-alt' data-name='" + name + "' data-id='" + id + "'></i> </a> </span> <i class='separatorDash fas fa-minus'></i> <span data-toggle='tooltip' data-placement='top' title='Delete Project'> <a data-toggle='modal' data-target='#deleteProjectModal'> <i id='deleteProject>' class='deleteProject far fa-trash-alt' data-id='" + id + "'></i> </a> </span> </div> </div> </div> <form class='' action='' method=''>  <div class='inputTab'>    <div class='plusButton fas fa-plus'></div>    <input id='inputNewTask" + id + "' data-toggle='tooltip' data-placement='top' title='Please enter 1 to 50 characters' data-description='data-description' class='inputField' minlength='1' maxlength='50' pattern='[A-Za-z].{1-50}'      autocomplete='off' name='taskDescription' value='' type='text' placeholder='  Start typing here to create a task...' required>    <button id='addButton " + id + "' data-id='" + id + "' class='addButton' type='submit' value='Submit'><p>Add task</p></button></div></form><div class='taskList " + id + "' id='taskList" + id + "'></div>"
                $('.projects').append(newProject)
                var projectTitle = document.getElementsByClassName('projectName ' + id)[0]
                projectTitle.setAttribute("data-toggle", "tooltip", "data", 'top', 'title', 'dawd', 'data-original-title', '')

              },
              error: function(err) {
                $("#newProjectModal").on();
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
    // $(this).off();
    var today = new Date()
    url = '/setProjectDeadline'
    var projectId = $(this).attr('data-id')
    // alert(projectId)
    $("#confirmEditDeadline").on("click", function(event) {
      $(this).off();
      event.preventDefault();
      var deadline = new Date($("#deadLineInput").val())
      // alert(deadline)
      // alert(today)
      if (deadline > today) {
        $.post({
          url: url,
          data: {
            projectDeadline: deadline.toISOString(),
            projectID: projectId
          },
          success: function(result) {
            $("#editDeadLineModal").modal('hide')
            console.log("setting project Deadline");
            var title = document.getElementsByClassName('projectName ' + projectId)
            title[0].setAttribute('data-original-title', "Deadline: " + deadline.toDateString())
          },
          error: function(err) {
            console.log(err);
          }
        })
      } else {
        alert("Deadline must be later than today")
        $("#editDeadLineModal").modal('hide')
      }
    })
  })


  // Edit Project Title by ID
  $("body").delegate(".editProject", "click", function() {
    // $(this).off();
    var editProjectId = $(this).attr('data-id');
    // alert(editProjectId)
    var currentTitle = document.getElementsByClassName('projectName ' + editProjectId)[0].innerText;
    // alert(currentTitle)
    $("#editProjectNameInput").val(currentTitle)
    var url = '/editProjectName';
    $('#confirmEditProjectName').on("click", function(event) {
      $(this).off();
      var newTitle = $("#editProjectNameInput").val();
      if (currentTitle === newTitle) {
        event.preventDefault();
        alert("New Title should be different")
      }
      if (newTitle.length > 1 && newTitle.length <= 25) {
        event.preventDefault();
        $.post({
          url: url,
          data: {
            projectName: newTitle,
            projectID: editProjectId
          },
          success: function(result) {
            $("#editProjectTitleModal").modal('hide')
            document.getElementsByClassName('projectName ' + editProjectId)[0].innerText = newTitle;
          },
          error: function(err) {
            console.log(err);
          }
        })
      }
    })
  })




  // Delete Project by ID
  $("body").delegate(".deleteProject", "click", function() {
    $(this).off();
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
    var thisProjectId = $(this).attr("data-id");
    // alert(thisProjectId)
    var newTask = $("#inputNewTask" + thisProjectId).val()
    var url = '/submitTask';
    // alert(newTask)
    if (newTask !== '' && newTask.length >= 1) {

      $.post({
        url: url,
        data: {
          name: newTask,
          id: thisProjectId
        },
        success: function(results) {
          // alert("New task added");
          $("#inputNewTask" + thisProjectId).val('')
          // window.location.href = '/tasks'
          // console.log(results);
          var id = results.data.id
          var name = results.data.name
          var priority = results.data.priority
          var deadline = results.data.t_deadline
          var status = results.data.status
          var completed = results.data.completed
          var project_id = results.data.project_id

          var newTask = "<div class='taskRow' id='taskRow" + id + "' data-toggle='tooltip' data-placement='bottom' title=''> <div class='doneMark'> <span> <input id='doneMark " + id + "' data-priority='" + priority + "' type='checkbox' data-id='" + id + "' data-completion='" + completed + "' name='doneTaskMark'>      </span> </div>    <div class='separator'></div>    <div class='taskDescription " + id + "' id='taskDescription" + id + "'> <span id='task" + id + "'>" + name + "</span> </div>    <div class='taskOptions'> <span data-toggle='tooltip' data-placement='left' title='Set Priority'> <a class='dropdown' id='dropdownMenuButton" + id + "' data-id='" + id + "' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'> <i class='setTaskPriority fas fa-sort' data-id='" + id + "' data-priority='" + priority + "'></i>  <div class='dropdown-menu' aria-labelledby='dropdownMenuButton'> <a class='dropdown-item priority" + id + "' style='color: red;' data-value='4'>Urgent</a> <a class='dropdown-item priority" + id + "' style='color: orange;' data-value='3'>High</a> <a class='dropdown-item priority" + id + "' style='color: blue;' data-value='2'>Normal</a> <a class='dropdown-item priority" + id + "' style='color: grey;' data-value='1'>Low</a> </div> </a> </span> <i class='separatorDash fas fa-minus'></i> <span data-toggle='tooltip' data-placement='left' title='Edit task'> <i id='editTask " + id + "' class='editTask fas fa-pencil-alt' data-id='" + id + "' data-description='" + name + "' data-toggle='modal' data-target='#editTaskModal'></i></span> <i class='separatorDash fas fa-minus'></i> <span data-toggle='tooltip' data-placement='left' title='Delete task'> <a data-toggle='modal' data-target='#deleteTaskModal'> <i class='deleteTask fas fa-trash-alt' data-id='" + id + "'></i> </a> </span> </div> </div>"
          $('#taskList' + project_id).prepend(newTask)


        },
        error: function(err) {
          console.log(err);
        }
      })
    }
  })

  // Mark task as DONE/UNDONE
  $("body").delegate('input[type="checkbox"]', "click", function() {
    var taskCompletion = true;
    var taskStatus = "Completed"
    var markTaskId = $(this).attr("data-id")
    var priority = $(this).attr("data-priority")
    var url = '/markdone';

    if ($(this).prop("checked") === true) {
      taskCompletion = true
      $('#taskRow' + markTaskId).tooltip('disable')
    } else if ($(this).prop("checked") === false) {
      taskCompletion = false
      taskStatus = "In progress"
    }
    if (taskCompletion != null) {
      $.post({
        url: url,
        data: {
          id: markTaskId,
          priority: priority,
          completion: taskCompletion,
          status: taskStatus
        },
        success: function(results) {
          // console.log(typeof results.priority);
          console.log("Check done/undone");
          var imageSpan = document.getElementById('imgSpan' + markTaskId)
          var parent = document.getElementById('taskDescription' + markTaskId)


          if (taskCompletion === true) {
            parent.classList.add('done')
            $('#dropdownMenuButton' + markTaskId).prop('disabled', true);
            $('#taskRow' + markTaskId).tooltip('disable')

            if (imageSpan) {
              imageSpan.classList.add('hidden')
            }

          } else if (taskCompletion === false) {
            parent.classList.remove('done')
            $('#dropdownMenuButton' + markTaskId).prop('disabled', false);
            $('#taskRow' + markTaskId).tooltip('enable')

            if (imageSpan) {
              imageSpan.classList.remove('hidden')
            }
          }
        },
        error: function(err) {
          console.log(err);
        }
      })
    }
  });


  // Set priority for Task
  $("body").delegate(".setTaskPriority", "click", function() {
    var priorityTaskId = $(this).attr("data-id");
    var url = '/editPriority'
    var element = $('#taskDescription' + priorityTaskId)
    if (element.hasClass("done")) {
      $('#dropdownMenuButton' + priorityTaskId).prop('disabled', true);
      alert("Task is complete")
    }
    $(".priority" + priorityTaskId).on("click", function() {
      var newPriority = $(this).attr("data-value");
      // alert(newPriority)

      $.post({
        url: url,
        data: {
          priority: newPriority,
          id: priorityTaskId
        },
        success: function(result) {

          var oldImg = document.getElementById("imgSpan" + priorityTaskId)
          if (oldImg) {

            oldImg.setAttribute('src', 'images/priority' + newPriority + '.png')
          } else {
            newImg = '<img id="imgSpan' + priorityTaskId + '" class="imgSpan" src="images/priority' + newPriority + '.png" alt="Img">'
            $('#taskDescription' + priorityTaskId).prepend(newImg)
          }

        },
        error: function(err) {
          console.log(err);
        }
      })
    })

  })

  //Edit existing task by ID
  $("body").delegate(".editTask", "click", function() {
    var editTaskId = $(this).attr("data-id");
    var element = $('#taskDescription' + editTaskId)
    $(this).off();
    $("#editTaskId").val($(this).attr("data-id"));
    $("#editTaskDescription").val(document.getElementById('task' + editTaskId).innerText);
    var url = '/edit';
    $("#confirmEditTask").on("click", function(event) {
      $(this).off();
      event.preventDefault()
      var newTask = $("#editTaskDescription").val();
      if (newTask.length < 1 || newTask.length > 25) {
        alert("Please match requested format")
        $("#editTaskModal").modal('hide')
      } else {
        // alert(newTask)
        var today = new Date()
        var deadline = new Date($("#deadLineEntry").val())
        // alert(deadline)
        if (today >= deadline) {
          alert("Deadline must be later than today")
        } else {
          $.post({
            url: url,
            data: {
              task: newTask,
              deadline: deadline.toLocaleString(),
              id: editTaskId
            },
            success: function(result) {
              $("#editTaskModal").modal('hide')
              $('#task' + editTaskId).text(newTask)
              if (result.deadline !== 'Invalid Date') {
                // $('#taskRow' + editTaskId).attr('data-original-title', "Deadline: " + deadline.toDateString())
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
    // alert('I am inside')
    var delTaskId = $(this).attr("data-id");
    // alert(delTaskId);
    $("#deleteTaskModal").on('show.bs.modal', function() {
      var url = '/deletetask'
      // alert(delTaskId);
      $("#confirmDeleteTask").on("click", function(event) {
        $("#confirmDeleteTask").off();
        event.preventDefault();
        $.post({
          url: url,
          data: {
            id: delTaskId
          },
          success: function(result) {
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

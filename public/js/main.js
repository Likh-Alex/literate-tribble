

// Set Deadline for Project
$(document).on("click", "#setListDeadline", function() {
  var today = new Date()
  // alert(today)
  url = '/setProjectDeadline'
  var projectId = $(this).attr('data-id')
  $("#confirmEditDeadline").on("click", function(event) {
    event.preventDefault();
    var deadline = new Date($("#deadLineInput").val())
    if (deadline > today) {
      $.ajax({
        type: "POST",
        url: url,
        data: {
          projectDeadline: deadline.toISOString(),
          projectID: projectId
        },
        success: function(result) {
          $("#editDeadLineModal").modal('hide')
          console.log("setting project Deadline");
          document.getElementById('projectTitle ' + id).attributes[6].value = "Deadline " + deadline.toDateString()
        },
        error: function(err) {
          console.log(err);
        }
      })
    } else {
      alert("Deadline must be later than today")
    }
  })
})

//Edit existing task by ID
$(document).on("click", '#editTask', function() {
  $("#editTaskDescription").val($(this).attr('data-description'));
  $("#editTaskId").val($(this).attr("data-id"));
  var editTaskId = $(this).attr("data-id");
  var url = '/edit';
  $(".confirmEditTask").on("click", function(event) {
    event.preventDefault()
    var newTask = $("#editTaskDescription").val();
    // alert(newTask)
    var deadline = new Date($("#deadLineEntry").val())
    $.ajax({
      type: "POST",
      url: url,
      data: {
        task: newTask,
        deadline: deadline.toLocaleString(),
        id: editTaskId
      },
      success: function(result) {
        $("#editTaskModal").modal('hide')
        console.log("editing task");
        document.getElementById('task' + editTaskId).innerText = newTask
        if (deadline != null) {
          document.getElementById('taskRow ' + editTaskId).attributes[5].value = "Deadline " + deadline.toDateString();
        }

      },
      error: function(err) {
        console.log(err);
      }
    })
  })
})


// Edit Project Title by ID
$(document).on('click', "#editProjectName", function() {
  // $("#editProjectName").click(function() {
  var editProjectId = $(this).attr('data-id');
  // alert(id)
  var currentTitle = document.getElementById('projectTitle ' + editProjectId).innerText;
  // alert(currentTitle)
  $("#editProjectNameInput").val(currentTitle)
  var url = '/editProjectName';
  $('#confirmEditProjectName').on('click', function(event) {
    var newTitle = $("#editProjectNameInput").val();
    if (currentTitle === newTitle) {
      event.preventDefault();
      alert("New Title should be different")
    } else {
      event.preventDefault();
      if (newTitle.length > 1 && newTitle.length <= 25) {
        $.ajax({
          type: "POST",
          url: url,
          data: {
            projectName: newTitle,
            projectID: editProjectId
          },
          success: function(result) {
            $("#editProjectTitleModal").modal('hide')
            // $("#editProjectNameInput").val('')
            // alert("editing project name");
            document.getElementById('projectTitle ' + editProjectId).innerText = newTitle;
            editProjectId = null;
            currentTitle = null;
            newTitle = null
          },
          error: function(err) {
            console.log(err);
          }
        })
      }
    }
  })
})

// Delete Project by ID
$(document).on('click', "#deleteProject", function() {
  var deleteProjectId = $(this).attr('data-id');
  // alert(id)
  var url = '/deleteProject/' + deleteProjectId;
  $("#deleteProjectModal").on('show.bs.modal', function() {
    $("#confirmDeleteProject").on("click", function() {
      $.ajax({
        url: url,
        type: "GET",
        success: function() {
          $("#deleteProjectModal").modal('hide');
          console.log("deleting project");
          document.getElementById('project ' + deleteProjectId).remove();
        },

        error: function(err) {
          console.log(err);
        }
      })
    })
  });
})



//Add new task
$(document).on("click", "#addButton", function(event) {
  var thisProjectId = $(this).attr("data-id");
  var newTask = $("#inputNewTask" + thisProjectId).val()
  var url = '/submitTask';
  alert(newTask)
  $("#inputNewTask" + thisProjectId).val('')
  if (newTask !== '' && newTask.length >= 3) {
    event.preventDefault()
    $.ajax({
      url: url,
      type: "POST",
      data: {
        name: newTask,
        id: thisProjectId
      },
      success: function(results) {
        console.log("adding new task");
      },
      error: function(err) {
        console.log(err);
      }
    })
  }
})


// Mark task as DONE/UNDONE
$(document).on(function() {
  $('input[type="checkbox"]').click(function() {
    var taskCompletion = true;
    var taskStatus = "Completed"
    var markTaskId = $(this).attr("data-id")
    var priority = $(this).attr("data-priority")
    var url = '/markdone/' + markTaskId;
    if ($(this).prop("checked") == true) {
      taskCompletion = true
      $('#taskRow ' + markTaskId).tooltip({
        disabled: true
      })
    } else if ($(this).prop("checked") == false) {
      taskCompletion = false
      taskStatus = "In progress"
    }
    if (taskCompletion != null) {
      $.ajax({
        type: "POST",
        url: url,
        data: {
          param1: taskCompletion,
          param2: taskStatus
        },
        success: function(results) {
          console.log("Marking done/undone");
          var imageSpan = document.getElementById('imgSpan' + markTaskId)
          var parent = document.getElementById('taskDescription ' + markTaskId)


          if (taskCompletion === true) {
            if (imageSpan !== null) {
              imageSpan.style.display = "none";
              parent.classList.add('thick')
            } else {
              parent.classList.add('thick')
            }
          } else {
            if (imageSpan !== null) {
              imageSpan.style.display = "inline-block";
              parent.classList.remove('thick')
            } else {
              parent.classList.remove('thick')
            }
          }
        },
        error: function(err) {
          console.log(err);
        }
      })
    }
  });
});


// Set priority for Task
$(document).on('click', ".setTaskPriority", function() {
  const priorityTaskId = $(this).attr("data-id");
  alert(priorityTaskId)
  console.log(priorityTaskId);
  $("#setPriorityModal").on('show.bs.modal', function(event) {
    var url = '/editPriority'
    $(".choose").on('click', function() {
      var newPriority = $(this).val();
      // alert(newPriority)
      $(".confirmEditPriority").on("click", function() {
        $.ajax({
          url: url,
          type: "POST",
          data: {
            priority: newPriority,
            id: priorityTaskId
          },
          success: function(result) {
            $("#setPriorityModal").modal('hide')
            console.log("Setting priority for " + priorityTaskId);
            var oldImg = document.getElementById("imgSpan" + priorityTaskId)
            if (oldImg) {
              oldImg.remove();
            }
            console.log(priorityTaskId);
            var img = document.createElement('IMG');
            var attributes = 'id="imgSpan' + priorityTaskId + '" class="imgSpan" data-toggle="tooltip" data-placement="bottom" title="Urgent" src="images/priority' + newPriority + '.png" alt="Img"';
            var arr = attributes.match(/[^\s="']+|"([^"]*)"|'([^']*)'/g);
            for (var i = 0; i < arr.length; i += 2)
              img.setAttribute(arr[i], arr[i + 1].replace(/"/g, ''));

            document.getElementById("taskDescription " + priorityTaskId).prepend(img);
          },
          error: function(err) {
            console.log(err);
          }
        })
      })
    })
  })
})







//Delete Task by ID
$(document).on(function() {
  $(".deleteTask").on("click", function() {
    var delTaskId = $(this).attr("data-id");
    console.log(delTaskId);
    $("#deleteTaskModal").on('show.bs.modal', function(event) {
      var url = '/delete/' + delTaskId;
      // alert(id);
      $(document).on("click", ".confirmDeleteTask", function() {
        $.ajax({
          url: url,
          type: "GET",
          success: function(result) {
            console.log(result);
            $("#deleteTaskModal").modal('hide');
            console.log("deleting task");
            document.getElementById('taskRow ' + delTaskId).remove();
          },
          error: function(err) {
            console.log(err);
          }
        })
      })
    });
  })
})



// Add new TODO list
$('#addNewProjectBtn').on("click", function() {
  $("#newProjectModal").on('show.bs.modal', function(event) {
    var url = '/addNewList';
    $("#confirmNewList").on("click", function() {
      var newListTitle = $("#newListNameInput").val()
      if (newListTitle !== null && newListTitle.length >= 3) {
        $.ajax({
          url: url,
          type: "POST",
          data: {
            param: $("#newListNameInput").val()
          },
          success: function(result) {
            $("#newProjectModal").modal('hide')
            console.log("Adding new list");
            window.location.href = '/tasks'
          },
          error: function(err) {
            console.log(err);
          }
        })
      }
    })
  })
})


$(function() {
  $('[data-toggle="tooltip"]').tooltip()
})

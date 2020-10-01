// Set Deadline for Project
$(".projectDeadline").click(function() {
  var today = new Date()
  url = '/setProjectDeadline'
  var projectId = $(this).attr('data-id')
  alert(projectId)
  $("#confirmEditDeadline" + projectId).on("click", function(event) {
    event.preventDefault();
    var deadline = new Date($("#deadLineInput" + projectId).val())
    if (deadline > today) {
      $.ajax({
        type: "POST",
        url: url,
        data: {
          projectDeadline: deadline.toISOString(),
          projectID: projectId
        },
        success: function(result) {
          $("#editDeadLineModal" + projectId).modal('hide')
          console.log("setting project Deadline");
          document.getElementById('projectTitle' + projectId).attributes[6].value = "Deadline " + deadline.toDateString()
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
$('.editTask').click(function() {
  var editTaskId = $(this).attr("data-id");
  $("#editTaskId").val($(this).attr("data-id"));
  $("#editTaskDescription" + editTaskId).val(document.getElementById('task' + editTaskId).innerText);
  var url = '/edit';
  $("#confirmEditTask" + editTaskId).on("click", function(event) {
    event.preventDefault()
    var newTask = $("#editTaskDescription" + editTaskId).val();
    // alert(newTask)
    var today = new Date()
    var deadline = new Date($("#deadLineEntry" + editTaskId).val())
    // alert(deadline)
    if (today > deadline) {
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
          $("#editTaskModal" + editTaskId).modal('hide')
          console.log("editing task");
          // alert(result.deadline)
          document.getElementById('task' + editTaskId).innerText = newTask
          if (result.deadline !== undefined) {
            document.getElementById('taskRow' + editTaskId).attributes[5].value = "Deadline " + deadline.toDateString();
          }
        },
        error: function(err) {
          console.log(err);
        }
      })
    }
  })
})


// Edit Project Title by ID
$(".editProject").click(function() {
  var editProjectId = $(this).attr('data-id');
  // alert(editProjectId)
  var currentTitle = document.getElementsByClassName('projectName ' + editProjectId)[0].innerText;
  // alert(currentTitle)
  $("#editProjectNameInput" + editProjectId).val(currentTitle)
  var url = '/editProjectName';
  $('#confirmEditProjectName' + editProjectId).click(function(event) {
    var newTitle = $("#editProjectNameInput" + editProjectId).val();
    if (currentTitle === newTitle) {
      event.preventDefault();
      alert("New Title should be different")
    } else {
      event.preventDefault();
      if (newTitle.length > 1 && newTitle.length <= 25) {
        $.ajax({
          type: "POST",
          url: url,
          // async: false,
          data: {
            projectName: newTitle,
            projectID: editProjectId
          },
          success: function(result) {
            $("#editProjectTitleModal" + editProjectId).modal('hide')
            document.getElementsByClassName('projectName ' + editProjectId)[0].innerText = newTitle;
            editProjectId = null;
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
$(".deleteProject").click(function() {
  var deleteProjectId = $(this).attr('data-id');
  // alert(deleteProjectId)
  var url = '/deleteProject';
  $("#deleteProjectModal" + deleteProjectId).on('show.bs.modal', function(event) {
    // alert("i'm modal")
    $("#confirmDeleteProject" + deleteProjectId).click(function() {
      // alert("i'm clicked")
      event.preventDefault();
      $.post({
        url: url,
        data: {
          id: deleteProjectId
        },
        success: function() {
          $("#deleteProjectModal" + deleteProjectId).modal('hide');
          console.log("deleting project");
          document.getElementById('project' + deleteProjectId).remove();
        },

        error: function(err) {
          console.log(err);
        }
      })
    })
  });
})



//Add new task
$(".addButton").click(function() {
  // alert('hi')
  var thisProjectId = $(this).attr("data-id");
  var newTask = $("#inputNewTask" + thisProjectId).val()
  var url = '/submitTask';
  event.preventDefault()
  // alert(newTask)
  if (newTask !== '' && newTask.length >= 3) {
    $.ajax({
      url: url,
      type: "POST",
      data: {
        name: newTask,
        id: thisProjectId
      },
      success: function(results) {
        // alert("New task added");
        $("#inputNewTask" + thisProjectId).val('')
      },
      error: function(err) {
        console.log(err);
      }
    })
  }
})


// Mark task as DONE/UNDONE
$('input[type="checkbox"]').click(function() {
  var taskCompletion = true;
  var taskStatus = "Completed"
  var markTaskId = $(this).attr("data-id")
  var priority = $(this).attr("data-priority")
  var url = '/markdone/' + markTaskId;
  if ($(this).prop("checked") == true) {
    taskCompletion = true
    $('#taskRow' + markTaskId).tooltip({
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
        var parent = document.getElementById('taskDescription' + markTaskId)
        if (taskCompletion === true) {
          parent.classList.add('thick')
          if (priority) {
            imageSpan.style.display = "none";
          }
        } else {
          if (imageSpan) {
            imageSpan.style.display = "inline-block";
            parent.classList.remove('thick')
          } else {
            if (!priority) {
              parent.classList.remove('thick')
            } else {
              parent.classList.remove('thick')
              var newImg = $("<img id='imgSpan" + markTaskId + "' class='imgSpan' src='images/priority" + priority + ".png' alt='Img'>").prependTo(parent);
            }
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
$(".setTaskPriority").click(function() {
  var priorityTaskId = $(this).attr("data-id");
  var url = '/editPriority'
  // alert(priorityTaskId)
  $(".priority" + priorityTaskId).click(function() {
    const newPriority = $(this).attr("data-value");
    // alert($(this).attr("data-value"))
    $.post({
      url: url,
      data: {
        priority: newPriority,
        id: priorityTaskId
      },
      success: function(result) {

        var parent = document.getElementsByClassName("taskDescription " + priorityTaskId)
        var oldImg = document.getElementById("imgSpan" + priorityTaskId)
        if (!oldImg) {
          var newImg = $("<img id='imgSpan" + priorityTaskId + "' class='imgSpan' src='images/priority" + newPriority + ".png' alt='Img'>").prependTo(parent);

        }
        oldImg.remove();
        var newImg = $("<img id='imgSpan" + priorityTaskId + "' class='imgSpan' src='images/priority" + newPriority + ".png' alt='Img'>").prependTo(parent);
        $("#setPriorityModal" + priorityTaskId).modal('hide')
      },
      error: function(err) {
        console.log(err);
      }
    })
  })
})




//Delete Task by ID
$(".deleteTask").click(function() {
  // alert('I am inside')
  var delTaskId = $(this).attr("data-id");
  // alert(delTaskId);
  $("#deleteTaskModal" + delTaskId).on('show.bs.modal', function() {
    var url = '/deletetask'
    // alert(delTaskId);
    $("#confirmDeleteTask" + delTaskId).click(function(event) {
      event.preventDefault();
      $.post({
        url: url,
        data: {
          id: delTaskId
        },
        success: function(result) {
          $("#deleteTaskModal" + delTaskId).modal('hide');
          document.getElementById('taskRow' + delTaskId).remove();
        },
        error: function(err) {
          console.log(err);
        }
      })
    })
  });
})



// Add new TODO list
$('#addNewProjectBtn').click(function() {
  // alert('Ok')
  $("#newProjectModal").on('show.bs.modal', function() {
    // alert("modal")
    var url = '/addNewList';
    $(".confirmNewList").click(function(event) {
      var newListTitle = $(".newListNameInput").val()
      if (newListTitle !== null && newListTitle.length >= 3) {
        event.preventDefault();
        $.ajax({
          url: url,
          type: "POST",
          data: {
            param: $(".newListNameInput").val()
          },
          success: function(result) {
            $("#newProjectModal").modal('hide')
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

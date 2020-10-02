// Add new TODO list
$('#addNewProjectBtn').on("click", function() {
  $('#addNewProjectBtn').off();
  // alert('Ok')
  $("#newProjectModal").on('show.bs.modal', function() {
    $("#newProjectModal").off()
    // alert("modal")
    var url = '/addNewList';
    $(".confirmNewList").on("click", function(event) {
      var newListTitle = $("#newListNameInput").val()
      $(".confirmNewList").off();
      // alert(newListTitle)
      if (newListTitle.length < 1) {
        alert("Please enter the list name")
      } else {
        if (newListTitle.length >= 1 && newListTitle.length <= 15) {
          event.preventDefault();
          $.ajax({
            url: url,
            type: "POST",
            data: {
              listName: $("#newListNameInput").val()
            },
            success: function(result) {
              $("#newProjectModal").modal('hide')
              $("#newListNameInput").val('');
              var id = result.data.id
              var name = result.data.name
              $(".projects").append("<div class='project col-4' id='project" + id + "'> <div class='projectHeader'> <div class='projectTitle'> <span> <a data-toggle='modal' data-target='#editDeadLineModal'> <i data-id='" + id + "' class='projectDeadline far fa-calendar-alt fa-2x' data-toggle='tooltip' data-placement='top' title='Set Deadline'></i>   </a> </span> <h5 class='projectName " + id + "'>" + name + " </h5> <div class='projectButtons'> <span data-toggle='tooltip' data-placement='top' title='Edit Project Title'> <a data-toggle='modal' data-target='#editProjectTitleModal'> <i id='editProjectName' class='editProject fas fa-pencil-alt' data-name='" + name + " data-id='" + id + "'></i> </a> </span> <i class='separatorDash fas fa-minus'></i> <span data-toggle='tooltip' data-placement='top' title='Delete Project'> <a data-toggle='modal' data-target='#deleteProjectModal'> <i id='deleteProject>' class='deleteProject far fa-trash-alt' data-id='" + id + "'></i> </a> </span> </div> </div> </div>")


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
$(".projectDeadline").on("click", function() {
  // $(this).off();
  var today = new Date()
  url = '/setProjectDeadline'
  var projectId = $(this).attr('data-id')
  // alert(projectId)
  $("#confirmEditDeadline").on("click", function(event) {
    $(this).off();
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


// Edit Project Title by ID
$(".editProject").on("click", function() {
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
      $.ajax({
        type: "POST",
        url: url,
        // async: false,
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
$(".deleteProject").click(function() {
  var deleteProjectId = $(this).attr('data-id');
  alert(deleteProjectId)
  var url = '/deleteProject';
  $("#deleteProjectModal").on('show.bs.modal', function() {
    // alert("i'm modal")
    $("#confirmDeleteProject").click(function(event) {
      // alert("i'm clicked")
      event.preventDefault();
      $.post({
        url: url,
        data: {
          id: deleteProjectId
        },
        success: function() {
          $("#deleteProjectModal").modal('hide');
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
$(".addButton").click(function(event) {
  // alert('hi')
  var thisProjectId = $(this).attr("data-id");
  var newTask = $("#inputNewTask" + thisProjectId).val()
  var url = '/submitTask';
  event.preventDefault()
  // alert(newTask)
  if (newTask !== '' && newTask.length >= 1) {
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
$(".setTaskPriority").on("click", function() {
  var priorityTaskId = $(this).attr("data-id");
  var url = '/editPriority'
  $(this).off();
  console.log(priorityTaskId);
  $(".priority").on("click", function() {
    const newPriority = $(this).attr("data-value");
    // alert($(this).attr("data-value"))
    // $(this).off();
    $.post({
      url: url,
      data: {
        priority: newPriority,
        id: priorityTaskId
      },
      success: function(result) {
        $(".setTaskPriority").on()
        var doneTask = document.getElementsByClassName("taskDescription " + priorityTaskId + " thick")
        var parent = document.getElementsByClassName("taskDescription " + priorityTaskId)
        var oldImg = document.getElementById("imgSpan" + priorityTaskId)
        if (doneTask && oldImg) {
          document.getElementById("imgSpan" + priorityTaskId).setAttribute('src', 'images/priority' + newPriority + '.png')
        } else if (doneTask && !oldImg) {
          var newImg = $("<img id='imgSpan" + priorityTaskId + "' style='display:none;' class='imgSpan' src='images/priority" + newPriority + ".png' alt='Img'>").prependTo(doneTask);
        } else if (!doneTask && !oldImg) {
          var newImg = $("<img id='imgSpan" + priorityTaskId + "' style='display:inline-block;' class='imgSpan' src='images/priority" + newPriority + ".png' alt='Img'>").prependTo(parent);
        } else {
          document.getElementById("imgSpan" + priorityTaskId).setAttribute('src', 'images/priority' + newPriority + '.png')
        }
      },
      error: function(err) {
        console.log(err);
      }
    })
  })
})

//Edit existing task by ID
$('.editTask').on("click", function() {
  $(this).off();
  var editTaskId = $(this).attr("data-id");
  $("#editTaskId").val($(this).attr("data-id"));
  $("#editTaskDescription").val(document.getElementById('task' + editTaskId).innerText);
  var url = '/edit';
  $("#confirmEditTask").on("click", function(event) {
    $(this).off();
    event.preventDefault()
    var newTask = $("#editTaskDescription").val();
    if (newTask.length < 1 || newTask.length > 25) {
      alert("Please match requested format")
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
            // console.log("editing task");
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
    }
  })
})


//Delete Task by ID
$(".deleteTask").on("click", function() {
  // alert('I am inside')
  var delTaskId = $(this).attr("data-id");
  // alert(delTaskId);
  $("#deleteTaskModal").on('show.bs.modal', function() {
    var url = '/deletetask'
    // alert(delTaskId);
    $("#confirmDeleteTask").on("click", function(event) {
      $(this).off();
      event.preventDefault();
      $.post({
        url: url,
        data: {
          id: delTaskId
        },
        success: function(result) {
          $("#deleteTaskModal").modal('hide');
          document.getElementById('taskRow' + delTaskId).remove();
        },
        error: function(err) {
          console.log(err);
        }
      })
    })
  });
})



$(function() {
  $('[data-toggle="tooltip"]').tooltip()
})

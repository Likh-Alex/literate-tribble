// Set Deadline for Project
$(document).on("click", "#setListDeadline", function() {
  var today = new Date()
  // alert(today)
  url = '/setProjectDeadline'
  id = $(this).attr('data-id')
  $("#confirmEditDeadline").on("click", function() {
    var deadline = new Date($("#deadLineInput").val())
    if (deadline > today) {
      $.ajax({
        type: "POST",
        url: url,
        data: {
          projectDeadline: deadline.toISOString(),
          projectID: id
        },
        success: function(result) {
          $("#editDeadLineModal").modal('hide')
          console.log("setting project Deadline");
          window.location.href = '/tasks'
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

$(".project").on('click', function() {
  url = '/tasks'
  $.get({
    url: url,
    type: "GET",
    success: function() {
      console.log("Sending request");
    },
    error: function(err) {
      console.log(err);
    }
  })
})

//Edit existing task by ID
$(document).on("click", '#editTask', function() {
  $("#editTaskDescription").val($(this).attr('data-description'));
  $("#editTaskId").val($(this).attr("data-id"));
  var id = $(this).attr("data-id");
  var url = '/edit';
  $(".confirmEditTask").on("click", function() {
    var newTask = $("#editTaskDescription").val();
    // alert(newTask)
    var deadline = new Date($("#deadLineEntry").val())
    $.ajax({
      type: "POST",
      url: url,
      data: {
        task: newTask,
        deadline: deadline.toLocaleString(),
        id: id
      },
      success: function(result) {
        $("#editTaskModal").modal('hide')
        console.log("editing task");
        window.location.href = '/tasks'
      },
      error: function(err) {
        console.log(err);
      }
    })
  })
})


// Edit Project Title by ID
$(document).on("click", "#editProjectName", function() {
  var id = $(this).attr('data-id');
  $("#editProjectNameInput").val($(this).attr('data-name'))
  // alert(id)
  var url = '/editProjectName';
  $('#confirmEditProjectName').on('click', function() {
    var newTitle = $("#editProjectNameInput").val();
    if (newTitle.length > 1 && newTitle.length <= 15) {
      $.ajax({
        type: "POST",
        url: url,
        data: {
          projectName: newTitle,
          projectID: id
        },
        success: function(result) {
          $("#editProjectTitleModal").modal('hide')
          console.log("editing project name");
          window.location.href = '/tasks'
        },
        error: function(err) {
          console.log(err);
        }
      })
    }
  })
})

// Delete Project by ID
$(document).on('click', "#deleteProject", function() {
  var id = $(this).attr('data-id');
  // alert(id)
  var url = '/deleteProject/' + id;
  $("#deleteProjectModal").on('show.bs.modal', function() {
    $("#confirmDeleteProject").on("click", function() {
      $.ajax({
        url: url,
        type: "GET",
        success: function() {
          $("#deleteProjectModal").modal('hide');
          console.log("deleting project");
          window.location.href = '/'
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
  var id = $(this).attr("data-id");
  var newTask = $("#inputNewTask" + id).val()
  var url = '/submitTask';
  if (newTask !== '' && newTask.length >= 3) {
    event.preventDefault()
    $.ajax({
      url: url,
      type: "POST",
      data: {
        name: newTask,
        id: id
      },
      success: function(results) {
        console.log("adding new task");
        $("#addButton").mouseup(function() {
          $("#inputNewTask" + id).val(null)
        })
        // window.location.href = "/"
      },
      error: function(err) {
        console.log(err);
      }
    })
  }
})


// Mark task as DONE/UNDONE
$(document).ready(function() {
  $('input[type="checkbox"]').click(function() {
    var taskCompletion = true;
    var taskStatus = "Completed"
    var id = $(this).attr("data-id")
    var url = '/markdone/' + id;
    if ($(this).prop("checked") == true) {
      taskCompletion = true
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
          window.location.href = "/tasks"
        },
        error: function(err) {
          console.log(err);
        }
      })
    }
  });
});


// Set priority for Task
$(document).ready(function() {
  $(".setTaskPriority").on("click", function() {
    var id = $(this).attr("data-id");
    $("#setPriorityModal").on('show.bs.modal', function(event) {
      var url = '/editPriority/' + id;

      $(".choose").on('click', function() {
        var newPriority = $(this).val();
        // alert(newPriority)
        $(".confirmEditPriority").on("click", function() {
          $.ajax({
            url: url,
            type: "POST",
            data: {
              param: newPriority
            },
            success: function(result) {
              $("#setPriorityModal").modal('hide')
              console.log("Setting priority");
              window.location.href = '/tasks'
            },
            error: function(err) {
              console.log(err);
            }
          })
        })
      })
    })
  })
})



//Delete Task by ID
$(document).ready(function() {
  $(".deleteTask").on("click", function() {
    var id = $(this).attr("data-id");
    $("#deleteTaskModal").on('show.bs.modal', function(event) {
      var url = '/delete/' + id;
      // alert(id);
      $(document).on("click", ".confirmDeleteTask", function() {
        $.ajax({
          url: url,
          type: "GET",
          success: function(result) {
            console.log(result);
            $("#deleteTaskModal").modal('hide');
            console.log("deleting task");
            // window.location.href = '/'
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

$("#result").load("ajax/test.html");

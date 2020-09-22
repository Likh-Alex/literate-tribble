//Delete task by ID
$(document).ready(function() {
  $(".deleteTask").on("click", function() {
    var id = $(this).attr("data-id");
    $("#deleteTaskModal").on('show.bs.modal', function(event) {
      var url = '/delete/' + id;
      // alert(id);
      $(document).on("click", ".confirmDeleteTask", function() {
        if (!null) {
          $.ajax({
            url: url,
            type: "GET",
            success: function(result) {
              console.log(result);
              $("#deleteTaskModal").modal('hide');
              console.log("deleting task");
              window.location.href = '/'
            },
            error: function(err) {
              console.log(err);
            }
          })
        }
      })
    });
  })


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



  //Edit existing task by ID
  $(document).on("click", '.editTask', function() {
    $("#editTaskDescription").val($(this).attr('data-description'));
    $("#editTaskId").val($(this).attr("data-id"));
    var id = $(this).attr("data-id");
    var url = '/edit/' + id;
    $(".confirmEditTask").on("click", function(event) {
      if (!null) {
        $.ajax({
          type: "POST",
          url: url,
          data: {
            param: $("#editTaskDescription").val()
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
      }
    })
  })
})


// Add new TODOLIST
$('.addNewProject').on("click", function(){
  $('#confirmNewList').on('click', function(){
    var newProject = $('#newListNameInput').val();
    var url = '/addNewProject';
    if(newProject !== null){
      $.ajax({
        type: "POST",
        url: url,
        data: {
          param: newProject
        },
        success: function(result) {
          $("#newProjectModal").modal('hide')
          console.log("Adding new project");
          window.location.href = '/tasks'
        },
        error: function(err) {
          console.log(err);
        }
      })
    }
  })
})





//Add new task
$(document).on("click", "#addButton", function() {
  var newTask = $("#inputNewTask").val();
  if (newTask !== '' && newTask.length >= 3) {
    var url = '/submitTask';
    $.ajax({
      type: "POST",
      url: url,
      data: {
        param: $("#inputNewTask").val()
      },
      success: function(results) {
        console.log("adding new task");
        window.location.href = "/tasks"
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











$(function() {
  $('[data-toggle="tooltip"]').tooltip()
})

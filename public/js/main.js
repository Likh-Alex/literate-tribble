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

  //Edit existing task by ID
  $(document).on("click", '.editTask', function() {
    $("#editTaskDescription").val($(this).attr('data-description'));
    $("#editTaskId").val($(this).attr("data-id"));
    var id = $(this).attr("data-id");
    var url = '/edit/' + id;
    console.log("i'm editTaskId");
    $(".confirmEditTask").on("click", function(event) {
      console.log("i'm clicked");
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

//Add new task
$(document).on("click", "#addButton", function() {
  var newTask = $("#inputNewTask").val();
  if (newTask !== '' && newTask.length >= 3) {
    // alert(newTask);
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


$(document).ready(function() {
  $('input[type="checkbox"]').click(function() {
    var newStatus = true;
    if ($(this).prop("checked") == true) {
      alert("Checkbox is checked.");
    } else if ($(this).prop("checked") == false) {
      alert("Checkbox is unchecked.");
    }
  });
});



// Add new TODOLIST


$(function() {
  $('[data-toggle="tooltip"]').tooltip()
})

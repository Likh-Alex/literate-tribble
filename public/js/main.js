$(document).ready(function() {
  $(".deleteTask").on("click", function() {
    var id = $(this).attr("data-id");
    // alert("The data-id of clicked item is: " + dataId);
    $("#deleteTaskModal").on('show.bs.modal', function(event) {
      var url = '/delete/' + id; //url
      // alert(dataId)
      $(document).on("click", ".confirmDeleteTask", function() {
        if (!null) {
          $.ajax({
            url: url,
            type: "DELETE",
            success: function(result) {
              $("#deleteTaskModal").modal('hide')
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
            param1: $("#editTaskDescription").val()
          },
          success: function(result) {
            $("#editTaskModal").modal('hide')
            console.log("editing task");
            window.location.href = '/'
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

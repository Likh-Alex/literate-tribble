// Add new TODO list
$('#addNewProjectBtn').on("click", function() {
$("#newProjectModal").on('show.bs.modal', function() {
  $(".confirmNewList").on("click", function(event) {
      var url = '/addNewList';
      var newListTitle = $("#newListNameInput").val()
      event.preventDefault();
      $.post({
        url: url,
        data: {
          listName: newListTitle
        },
        success: function(result) {
          $("#newProjectModal").modal('hide')
          $("#newListNameInput").val('');
          var id = result.data.id
          var name = result.data.name
          //Apped new
          $(".projects").append("<div class='project col-4' id='project" + id + "'> <div class='projectHeader'> <div class='projectTitle'> ")
        },
        error: function(err) {
          console.log(err);
        }
      })
    }
  }
})
})
})

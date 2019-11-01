function deleteComic(confirm)
{
  if($(".delete-confirm").hasClass("delete-confirm-on"))
  {
    $(".delete-confirm").removeClass("delete-confirm-on")
  }
  else{
    $(".delete-confirm").addClass("delete-confirm-on")
  }

  if(confirm == "yes")
  {

  }
  else if(confirm == "no")
  {
    $(".delete-confirm").removeClass("delete-confirm-on")
  }
}

function editProperties()
{
  if($(".edit-preferences").hasClass("edit-preferences-on"))
  {
    $(".edit-preferences").removeClass("edit-preferences-on")
  }
  else{
    $(".edit-preferences").addClass("edit-preferences-on")
  }
}

$(document).ready(function() {
$( ".comic-page" ).click(function() {
  $(".page-open").addClass("page-open-on")
});

$( ".close" ).click(function() {
  $(".page-open").removeClass("page-open-on")
});
});

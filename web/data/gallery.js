//The last row
var rowNumber = 0;
//The time to start the most recent gallery at, maintains recent comic consistency at times of high throughput
var full = false;
function grabNextRows() {
    var data = {
        search: 0,
        type: 0,
    };
    $.ajax({
        type: "POST",
        datatype: 'json',
        url: "/srv/comic/search",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (n) { if (n == "done") { full = true; return; } else { full = false; } $(".comic-gallery").append(n); }
    });
};

function pollForComics(n) {
    $.ajax({
        type: "POST",
        datatype: 'json',
        url: "/srv/comic/search",
        contentType: 'application/json',
        data: JSON.stringify({ search: n, type: 1, row: 0, start: (new Date().toJSON()) }),
        success: function (j) { if (n == "done") { full = true; return; } else { full = false; } $(".comic-gallery").html(j); $(".content-pane").scrollTop(0);}
    })
}

grabNextRows();
$(document).ready(function() {
    $(".content-pane").scroll(function(){
     //   if(!full && $(".content-pane").scrollTop() + window.innerHeight >= $(".comic-gallery").height() - 5 * $(".book").height())
    //       grabNextRows();
        $(".subnav").css("opacity", 1 - $(window).scrollTop() / 250);
    });
});

$(".bookDetails").click(function() {
  $(this).attr('cid');
  window.location.replace("/comic/");
})

function filter(filterType){
  if(filterType == "filter")
  {
    if(window.screen.availWidth > 768)
    {
      if($("#filter-accounts").hasClass("filter-type"))
      {
        $("#filter-relevant").removeClass("filter-type")
        $("#filter-recent").removeClass("filter-type")
        $("#filter-accounts").removeClass("filter-type")
      }
      else {
        $("#filter-relevant").addClass("filter-type")
        $("#filter-recent").addClass("filter-type")
        $("#filter-accounts").addClass("filter-type")
      }
    }
    else
    {
      $("#filter-dropdown").addClass("show-dropdown");
      $("#filter-dropdown-btn").addClass("filter-type")
    }
  }
  else if(filterType == "relevant" || filterType == "recent" || filterType ==  "accounts")
  {
    if(window.screen.availWidth > 768)
    {
      $("#filter-relevant").removeClass("filter-type")
      $("#filter-recent").removeClass("filter-type")
      $("#filter-accounts").removeClass("filter-type")
    }
    else
    {
      $("#filter-dropdown").removeClass("show-dropdown");
      $("#filter-dropdown-btn").removeClass("filter-type")
    }
  }

};


function createComic()
{
  if($("#acctSess").html().includes("Login/Signup"))
    window.location.replace("/login");
  if($(".createComic").hasClass("createComic-on"))
  {
    $(".createComic").removeClass("createComic-on")
  }
  else{
    $(".createComic").addClass("createComic-on")
  }
}

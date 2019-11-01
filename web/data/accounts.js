$.ajax({
    type: "GET",
    url: "/srv/acct/getSess",
    success: function (n) { $("#acctSess").html(n) }
}).fail(function () { $("#acctSess").html("<a href='/login' class='nav-link'>Login/Signup</a>") })

$(document).ready(function () {
    $("#defaultOpen").click();
});

function signOut() {
    $.ajax({
        type: "POST",
        url: "/srv/acct/logout",
        success: function (n) { $(location).attr("href", "/"); }
    })
}

function openPage(pageName, elmnt, btnName) {
    // Hide all elements with class="tabcontent" by default */

    $(".tabcontent").hide();
    $(".AcPageBtn").css("background", "inherit").css("color", "white");

    // Show the specific tab content
    $(pageName).css("display", "block");
    $(btnName).css("background", "white").css("color", "black");

    $(".accsidebar").height($(".acc-content-pane").height());
}

function accMenuFunction(x) {
    $(".accsidebar").width("100%");
    $(".accsidebar").css("position","fixed");
}

function acccloseNav() {
    $(".accsidebar").width("0");
    $(".acc-content-pane").width("100%");
}

function filter(filterType){
  if(filterType == "filter")
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
  else if(filterType == "relevant")
  {
    $("#filter-relevant").removeClass("filter-type")
    $("#filter-recent").removeClass("filter-type")
    $("#filter-accounts").removeClass("filter-type")
  }
  else if(filterType == "recent")
  {
    $("#filter-relevant").removeClass("filter-type")
    $("#filter-recent").removeClass("filter-type")
    $("#filter-accounts").removeClass("filter-type")
  }
  else if(filterType == "accounts")
  {
    $("#filter-relevant").removeClass("filter-type")
    $("#filter-recent").removeClass("filter-type")
    $("#filter-accounts").removeClass("filter-type")
  }

};

function createComic()
{
  if($(".createComic").hasClass("createComic-on"))
  {
    $(".createComic").removeClass("createComic-on")
  }
  else{
    $(".createComic").addClass("createComic-on")
  }
}

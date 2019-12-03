

$.urlParam = function (httpParam) {
    var results = new RegExp('[\?&]' + httpParam + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null; //non existent
    }
    //faster typing
    return decodeURI(results[1]) || 0;
}

$.ajax({
    type: "POST",
    datatype: 'json',
    url: "/srv/comic/getdata",
    contentType: 'application/json',
    data:JSON.stringify({id:$.urlParam('id')}),
    success: function (n) { if (n == 'failure') {window.location.href="/";}
        $(".content-pane h2").html(n.comic_name);
    }
  });
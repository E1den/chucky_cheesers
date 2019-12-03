function grabNextRows() {
    var data = {
        search: 0,
        type: 1,
    };
    $.ajax({
        type: "POST",
        datatype: 'json',
        url: "/srv/comic/search",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (n) { if (n == "done") { full = true; return; } else { full = false; } $("#AccComics").append(n); }
    });
};

$(document).ready(function(){
    grabNextRows();
});
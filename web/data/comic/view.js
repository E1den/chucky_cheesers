
window.dataLoaded = function () {

};

window.pageError = function(offset) {

}

window.frameError = function() {

}


$(document).ready(function () {

    const width = 2560;
    const height = 1440;

    //  window.comicData => comic data
    //  window.ctx => canvas contex
    //  window.COMIC_ID => comic id
    //  window.leftPageNum => page num of the left page



    $("#comic-viewer").click(function (e) {

        //grab the screen based cordinates in the canvas
        var x = e.pageX - $("#comic-viewer").offset().left;
        var y = e.pageY - $("#comic-viewer").offset().top;
        //scale to the canvas coordinates
        x = (x / $("#comic-viewer").width()) * width;
        y = (y / $("#comic-viewer").height()) * height;


        //left => width:90,height:90,left: width * 0.05,top: height * 0.92

        var lleft = width * 0.02;
        var rleft = width * 0.95;
        var bheight = height * 0.92;

        //left
        if ((window.leftPageNum - 2 >= 0) && (x >= lleft) && (x <= lleft + 90) && (y >= bheight) && (y <= bheight + 90)) {
            //selected this box at index
            window.leftPageNum -= 2;

            var page = window.getLeftPage();

            window.redrawPages();
        }

        //right
        if ((window.leftPageNum + 2 <= window.comicData.page.length) && (x >= rleft) && (x <= rleft + 90) && (y >= bheight) && (y <= bheight + 90)) {
            //selected this box at index
            window.leftPageNum += 2;

            var page = window.getRightPage();

            window.redrawPages();
        }

    });
});
$(document).ready(function () {

    const width = 2560;
    const height = 1440;

    //  window.comicData => comic data
    //  window.ctx => canvas contex
    //  window.COMIC_ID => comic id
    //  window.leftPageNum => page num of the left page



    $("#comic-viewer").click(function(e){
        var x = e.pageX - $("#comic-viewer").offset().left;
        var y = e.pageY - $("#comic-viewer").offset().right;

        var currentPage = window.comicData.page[window.leftPageNum]; // left page
        if(x>(width/2))
        {
            currentPage = window.comicData.page[window.leftPageNum+1]; // right page
        }

        //each should be a plus sign until an image is added
        currentPage.forEach(function (frame, index) {
            if((x>=frame.x)&&(x<=frame.x+frame.width)&&(y>=frame.y)&&(y<=frame.y+frame.height))
            {
                //selected this box at index

            }
        });

    });
});
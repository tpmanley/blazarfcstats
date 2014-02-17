$(document).ready(function() {
    $.getJSON("/api/player", function(data){
        var items = [];
        $.each(data.objects, function(i, v) {
            console.log(v);
            items.push("<div class=\"row\"> <div class=\"small-12 columns\">" + v["name"] + "</div></div>");
        })
        $("#stats").html(items.join(""));
    })
})
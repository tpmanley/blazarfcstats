function addGoal(id, goals) {
    $.ajax({
        url: "/api/player/" + id,
        type: "PUT",
        data: JSON.stringify({"goals": goals + 1}),
        contentType: "application/json",
        'success': updateStats
    });
}

function resetGoals() {
    $.getJSON("/api/player", function(data){
        var items = [];
        $.each(data.objects, function(i, v) {
            $.ajax({
                url: "/api/player/" + v["id"],
                type: "PUT",
                data: JSON.stringify({"goals": 0}),
                contentType: "application/json",
                'success': updateStats
            });
        });
    });
}

function updateStats() {
    order_by = [{"field":"name", "direction":"asc"}];
    $.getJSON("/api/player", {"q":JSON.stringify({"order_by":order_by})}, function(data){
        var items = [];
        $.each(data.objects, function(i, v) {
            console.log(v);
            items.push(
                "<div class=\"row text-center\">" +
                    "<div class=\"pic small-1 columns\">" +
                        "<img height=50 width=50 src=\"" + v["picture"] + "\"</img>" +
                    "</div>" +
                    "<div class=\"goals small-11 columns\">" +
                        "<button onclick=\"addGoal(" + v["id"] + "," + v["goals"] + ")\" class=\"button expand\">" +
                            v["name"] + " - " + v["goals"] +
                        "</button>" +
                    "</div>" +
                "</div>");
        });
        $("#stats").html(items.join(""));
    });
}

$(document).ready(updateStats);
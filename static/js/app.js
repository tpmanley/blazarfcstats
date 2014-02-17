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
    $.getJSON("/api/player", function(data){
        var items = [];
        $.each(data.objects, function(i, v) {
            console.log(v);
            items.push(
                "<div class=\"row\">" +
                    "<div class=\"pname small-2 columns\">" + v["name"] + "</div>" +
                    "<div class=\"goals small-10 columns\">" +
                        "<button onclick=\"addGoal(" + v["id"] + "," + v["goals"] + ")\" class=\"button expand\">" +
                            v["goals"] +
                        "</button>" +
                    "</div>" +
                "</div>");
        });
        $("#stats").html(items.join(""));
    });
}

$(document).ready(updateStats);
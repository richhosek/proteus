function enableButtons() {
    $("button").prop("disabled", false);
}

function getSwitches() {
    var devices = JSON.parse(sessionStorage.getItem("devices")) || [];
    console.log("ALL DEVICES", devices);
    var switches = devices.filter(function(device){
        return device.binary_switch_id;
    });
    return switches;
}

$("#show-switches").on("click", function(event){

    var switches = getSwitches();
    console.log("SWITCHES", switches);
    $("#devices").empty();
    switches.forEach(function(swtch){
        var switchDiv = $("<div>");
        var lightIcon = $("<i>");
        if (swtch.last_reading.powered) {
            lightIcon.addClass("far fa-lightbulb binary-switch");
        } else {
            lightIcon.addClass("fas fa-lightbulb binary-switch");
        }
        switchDiv.append(lightIcon, " ", swtch.name);
        if (swtch.binary_switch_id) {
            // this is a Binary Switch
            lightIcon.data("deviceModel", 
            new BinarySwitch(swtch.binary_switch_id, swtch.last_reading.powered));    
        }
        $("#devices").append(switchDiv);
    });
});

$(document).on("click", ".binary-switch", function(event){
    var icon = $(this);
    var device = icon.data("deviceModel");
    device.switch(!device.powered)
    .then(function(response){
        console.log("SWITCHED", response);
        device.powered = !device.powered;
        if (device.powered) {
            icon.removeClass("fas").addClass("far");
        } else {
            icon.removeClass("far").addClass("fas");
        }
    });
    
});
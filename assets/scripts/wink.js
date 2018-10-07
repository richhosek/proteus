var clientSecret = "8IEyqrzTXS-QI9ZNkuLf0Jo8DyHKQNPe";
var clientId = "CvQMPFBJEIptrwvldB2I5U3qRZxVaBs7"

function getToken(code) {
    return $.post({
            url: "https://api.wink.com/oauth2/token",
            data: {
                "client_secret": clientSecret,
                "grant_type": "authorization_code",
                "code": code
            }
        })
        .then(function (data) {
            sessionStorage.setItem("token", data.access_token);
            return data.access_token;
        });
}

function getDevices() {
    return $.ajax({
            url: "https://api.wink.com/users/me/wink_devices",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            }
        })
        .then(function (data) {
            sessionStorage.setItem("devices", JSON.stringify(data.data));
            return data.data
        })
        .catch(function (error) {
            console.log(error);
        })
}

function updateDesiredState(deviceType, deviceId, setting){
    return $.ajax({
        url: `https://api.wink.com/${deviceType}/${deviceId}/desired_state`,
        type: "PUT",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        data: setting
    }).then(function(response){
        console.log("UPDATE DESIRED STATE", response);
        return response;
    });
}

function BinarySwitch(id, powered){
    this.id = id;
    this.powered = powered;
    this.switch = function(poweredState){
        return updateDesiredState("binary_switches", this.id, {
            "desired_state": {
                "powered": poweredState
            }
        })
        .then(function(response){
            console.log("BINARY SWITCH SWITCH", response);
            return response;
        });
    }
}
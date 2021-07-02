// Called when the user clicks on the browser action.

infotext_storage = "";

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "update infotext") {
            infotext_storage = request.infotext;
        }
    }
);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "get infotext") {
            chrome.runtime.sendMessage({ message: "infotext transmission", infotext: infotext_storage });
        }
    }
);

chrome.browserAction.onClicked.addListener(function (tab) {
    if (false) {
        // Send a message to the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            let activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { message: "clicked_browser_action" });
            console.log(activeTab.id);
        });
    }
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "make_api_call") {
            console.log("Calling API - please stand by");
            if (request.token === "None") {
                //this is a login request
                makeXHRRequest_login(request.method, request.url, request.payload, callback_login);
                return true;
            } else if (request.token === "Stored") {
                chrome.storage.sync.get("token", function (token) {
                    if (typeof token.token === 'undefined') {
                        console.log("No token found!");
                        e = Error(JSON.stringify(
                            {
                                status: xhttp.status,
                                statusTextInElse: xhttp.statusText
                            }));
                        console.log(e);
                    } else {
                        makeXHRRequest_general(request.method, request.url, request.payload, token.token, callback_general);
                        return true;
                    }
                });
            }
        }
    }
);

function pastecallback(data) {

}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "read_clipboard") {

            console.log("Reading clipboard!")

            // add a DIV, contentEditable=true, to accept the paste action
            var helperdiv = document.createElement("div");
            document.body.appendChild(helperdiv);
            helperdiv.contentEditable = true;

            // focus the helper div's content
            var range = document.createRange();
            range.selectNode(helperdiv);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            helperdiv.focus();

            // trigger the paste action
            document.execCommand("Paste");

            // read the clipboard contents from the helperdiv
            var clipboardContents = helperdiv.innerHTML;
            console.log(clipboardContents);

            // Send a message to the active tab
            sendResponse({
                response: clipboardContents
            });
        }
        return true;
    }
);



/**
 * Possible parameters for request:
 *  action: "xhttp" for a cross-origin HTTP request
 *  url   : required, but not validated
 *  payload  : data to send in a POST request
 *
 * The callback function is called upon completion of the request */
function makeXHRRequest_login(method, url, payload, callback) {
    var xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        if (xhttp.status >= 200 && xhttp.status < 300) {
            callback(xhttp, payload);
        } else {
            console.log("Error logging in!");
            e = Error(JSON.stringify(
                {
                    status: xhttp.status,
                    statusTextInElse: xhttp.statusText
                }));
            console.log(e);
            chrome.runtime.sendMessage({ message: "Login failed!" });
        };
    };

    xhttp.onerror = function () {
            // Do whatever you want on error. Don't forget to invoke the
            // callback to clean up the communication port.
        console.log("Error logging in!");
        e = Error(JSON.stringify(
            {
                status: xhttp.status,
                statusTextInElse: xhttp.statusText
            }));
        console.log(e);
        chrome.runtime.sendMessage({ message: "Login failed!" });
        };

    xhttp.open(method, url, true);
        if (method == 'POST') {
            xhttp.setRequestHeader('Content-Type', 'application/json');
        }

    xhttp.send(JSON.stringify(payload));
        return true; // prevents the callback from being called too early on return
}



function callback_login(xhttp, payload) {
    response_data = JSON.parse(xhttp.responseText);
    console.log(response_data);
    console.log(response_data.response.token);
    let token = response_data.response.token;
    console.log(typeof (token));
    chrome.storage.sync.set({ 'token': token }, function () {
        chrome.storage.sync.get("token", function (token) {
            console.log("token", token);
            chrome.storage.sync.set({ 'login_check': Date.now() }, function () { });
            //callback to popup to say login worked
            chrome.runtime.sendMessage({ message: "Login successful!" });
        });
    });

    let user_email = payload.email;
    chrome.storage.sync.set({ 'user_email': user_email }, function () {
        chrome.storage.sync.get("user_email", function (user_email) {
            console.log("user_email", user_email);
            //callback to popup to say login worked
            chrome.runtime.sendMessage({ message: "Email stored!" });
        });
    });

}


/**
 * Possible parameters for request:
 *  action: "xhttp" for a cross-origin HTTP request
 *  url   : required, but not validated
 *  payload  : data to send in a POST request
 *
 * The callback function is called upon completion of the request */
function makeXHRRequest_general(method, url, payload, token, callback) {
    var xhttp = new XMLHttpRequest();

    xhttp.onload = function () {
        if (xhttp.status >= 200 && xhttp.status < 300) {
            callback(xhttp);
        } else {
            console.log("Error saving data to server!");
            let e = Error(JSON.stringify(
                {
                    status: xhttp.status,
                    statusTextInElse: xhttp.statusText
                }));
            console.log(e);
            chrome.runtime.sendMessage({ message: "Error saving data to server!", details: xhttp.status + " " + xhttp.statusText });
            infotext_storage = "Error saving data to server! Details: " + xhttp.statusText;
        };
    };

    xhttp.onerror = function () {
        // Do whatever you want on error. Don't forget to invoke the
        // callback to clean up the communication port.

        if (["https://app.namii.ai/version-test/api/1.1/wf/login_check", "https://app.namii.ai/version-test/api/1.1/wf/login_check"].includes(xhttp.responseURL)) {
            chrome.runtime.sendMessage({ message: "Not logged in" });
        } else {
            e = Error(JSON.stringify(
                {
                    status: xhttp.status,
                    statusTextInElse: xhttp.statusText
                }));
            console.log(e);

            chrome.runtime.sendMessage({ message: "Error saving data to server!", details: e.status });
            infotext_storage = "Error saving data to server! Details: " + xhttp.statusText;
        }
        callback(xhttp, true);
    };

    xhttp.open(method, url, true);
    if (method == 'POST') {
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.setRequestHeader('Authorization', 'Bearer ' + token);
    }

    console.log(payload);
    xhttp.send(JSON.stringify(payload));
    return true; // prevents the callback from being called too early on return
}

function callback_general(xhttp, error=false) {
    if (error) {
        console.log("error");
    } else if (["https://app.namii.ai/version-test/api/1.1/wf/login_check", "https://app.namii.ai/version-test/api/1.1/wf/login_check"].includes(xhttp.responseURL)) {
        console.log("Still logged in");
        chrome.runtime.sendMessage({ message: "Login check successful" });

        chrome.storage.sync.set({ 'login_check': Date.now() }, function () {});

    } else {
        response_data = JSON.parse(xhttp.responseText);
        console.log("Posted data - great success!");
        console.log(response_data);
        chrome.runtime.sendMessage({ message: "Data saved to server!" });
        infotext_storage = "Saved!";
    }
}


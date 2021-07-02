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
            console.log(request);
            makeXHRRequest_general(request.method, request.url, request.headers, request.payload, callback_general);
            return true;
        }
    }
);

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
function makeXHRRequest_general(method, url, headers, payload, callback) {
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

        e = Error(JSON.stringify(
            {
                status: xhttp.status,
                statusTextInElse: xhttp.statusText
            }));
        console.log(e);

        chrome.runtime.sendMessage({ message: "Error saving data to server!", details: e.status });
        infotext_storage = "Error saving data to server! Details: " + xhttp.statusText;
        
        callback(xhttp, true);
    };

    xhttp.open(method, url, true);
    if (method == 'POST') {
        header_object = JSON.parse(headers);

        Object.entries(header_object).forEach((entry) => {
            const [key, value] = entry;
            xhttp.setRequestHeader(key, value);
        });

        //xhttp.setRequestHeader('Content-Type', 'application/json');
        //xhttp.setRequestHeader('Authorization', 'Bearer ' + token);
    }

    console.log(payload);
    xhttp.send(JSON.stringify(payload));
    return true; // prevents the callback from being called too early on return
}

function callback_general(xhttp, error=false) {
    if (error) {
        console.log("error");
    } else {
        //response_data = JSON.parse(xhttp.responseText);
        response_data = xhttp.responseText;
        console.log("Posted data - great success!");
        console.log(response_data);
        chrome.runtime.sendMessage({ message: "Data saved to server!" });
        infotext_storage = "Saved!";
    }
}


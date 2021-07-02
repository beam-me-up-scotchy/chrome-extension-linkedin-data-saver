document.addEventListener("DOMContentLoaded", function () {

    chrome.runtime.sendMessage({ message: "get infotext" });

    //initialise buttons
    document.getElementById("scrape_button").addEventListener('click', send_scrape_LI);

    chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
        function (tabs) {

            let li = tabs[0].url.indexOf("linkedin.com/in/") > -1;
            let company = tabs[0].url.indexOf("linkedin.com/company/") > -1;
            let sn_li = tabs[0].url.indexOf("linkedin.com/sales/people/") > -1;
            let sn_company = tabs[0].url.indexOf("linkedin.com/sales/company/") > -1;

            if (li || company || sn_li || sn_company) {
                document.getElementById("scrape_button").disabled = false;
                if (li || sn_li) {
                    document.getElementById("scrape_button").innerText = "Save contact";
                } else if (company || sn_company) {
                    document.getElementById("scrape_button").innerText = "Save company";
                }
            } else {
                document.getElementById("scrape_button").disabled = true;
                document.getElementById("scrape_button").innerText = "Nothing to save";
            }
        }
    );

});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "Data saved to server!") {
            document.getElementById("scrape_button").disabled = false;
            console.log("Messaged received - Data saved to server");
            document.getElementById("infotext2").textContent = "Saved!";
            chrome.runtime.sendMessage({ message: "update infotext", infotext: "Saved!" });
            setTimeout(function () {
                document.getElementById("infotext2").textContent = "";
                chrome.runtime.sendMessage({ message: "update infotext", infotext: "" });
            }, 5000);
        } else if (request.message === "Error saving data to server! Try logging out and in again?") {
            document.getElementById("scrape_button").disabled = false;
            console.log("Messaged received - Error saving data to server!");
            document.getElementById("infotext2").textContent = request.message + " Details: " + request.details;
            chrome.runtime.sendMessage({ message: "update infotext", infotext: request.message + " Details: " + request.details });
        }  else if (request.message === "infotext transmission") {
            document.getElementById("infotext2").textContent = request.infotext;
            if (request.infotext === "Saved!") {
                setTimeout(function () {
                    document.getElementById("infotext2").textContent = "";
                    chrome.runtime.sendMessage({ message: "update infotext", infotext: "" });
                }, 5000);
            }
        }
    }
);

function send_scrape_LI() {

    document.getElementById("scrape_button").disabled = true;

    document.getElementById("infotext2").textContent = "Saving to Namii...";
    chrome.runtime.sendMessage({ message: "update infotext", infotext: "Saving to Namii..." });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
            message: "scrape button clicked",
            url: document.getElementById("url").value,
            headers: document.getElementById("headers").value
        });
        console.log(activeTab.id);
    });
}
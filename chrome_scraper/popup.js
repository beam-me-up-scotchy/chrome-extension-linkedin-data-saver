document.addEventListener("DOMContentLoaded", function () {

    chrome.runtime.sendMessage({ message: "get infotext" });

    //initialise buttons
    document.getElementById("login_button").addEventListener('click', login);
    document.getElementById("scrape_button").addEventListener('click', prescrape_check_logged_in);
    document.getElementById("logout_text").addEventListener('click', logout);
    document.getElementById("forgot").addEventListener('click', forgot);
    document.getElementById("signup").addEventListener('click', signup);

    chrome.storage.sync.get('token', function (data) {
        if (typeof data.token === 'undefined') {
            //if token not found, hide scraping div
            document.getElementById('scrape').style.display = "none";
        } else {
            //if token found, hide login div
            document.getElementById('Login').style.display = "none";
        }
    });

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
        if (request.message === "Login successful!") {
            console.log("Messaged received - Login successful!");
            document.getElementById('Login').style.display = "none";
            document.getElementById('scrape').style.display = "initial";
        } else if (request.message === "Login failed!") {
            console.log("Messaged received - Login failed!");
            document.getElementById("infotext").textContent = "Hmm... we couldn't find those login details. Please try again.";
        } else if (request.message === "Data saved to server!") {
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
        } else if (request.message === "Login check successful") {
            send_scrape_LI();
        } else if (request.message === "Not logged in") {
            chrome.storage.sync.remove('token', function () {
                document.getElementById("infotext").textContent = "";
                document.getElementById('Login').style.display = "initial";
                document.getElementById('scrape').style.display = "none";
            });
        } else if (request.message === "infotext transmission") {
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

function login() {
    document.getElementById("infotext").textContent = "";

    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;
    var payload = {
        "email": email,
        "password": pass
    };

    if (email === "mitchscott94@gmail.com") {
        var url = "https://app.namii.ai/version-test/api/1.1/wf/login";
    } else {
        var url = "https://app.namii.ai/version-live/api/1.1/wf/login";
    }

    chrome.runtime.sendMessage({ message: "make_api_call", method: "POST", url: url, token: "None", payload: payload });
}

function prescrape_check_logged_in() {
    chrome.storage.sync.get("login_check", function (timestamp) {
        if ((Date.now() - timestamp.login_check) < (1000 * 60 * 60 * 24)) {
            send_scrape_LI();
        } else {
            chrome.storage.sync.get("user_email", function (user_email) {
                if (user_email.user_email === "mitchscott94@gmail.com") {
                    var url = "https://app.namii.ai/version-test/api/1.1/wf/login_check";
                    chrome.runtime.sendMessage({ message: "make_api_call", method: "POST", url: url, token: "Stored", payload: {} });
                } else {
                    var url = "https://app.namii.ai/version-live/api/1.1/wf/login_check";
                    chrome.runtime.sendMessage({ message: "make_api_call", method: "POST", url: url, token: "Stored", payload: {} });
                }
            });
        }
    });
}

function send_scrape_LI() {

    document.getElementById("scrape_button").disabled = true;

    document.getElementById("infotext2").textContent = "Saving to Namii...";
    chrome.runtime.sendMessage({ message: "update infotext", infotext: "Saving to Namii..." });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { message: "scrape button clicked" });
        console.log(activeTab.id);
    });
}

function logout() {
    chrome.storage.sync.remove('token', function () {
        document.getElementById("infotext").textContent = "";
        chrome.runtime.sendMessage({ message: "update infotext", infotext: "" });
        document.getElementById('Login').style.display = "initial";
        document.getElementById('scrape').style.display = "none";
    });
}

function forgot() {
    chrome.tabs.create({
        url: "https://app.namii.ai/reset_pw",
        active: true
    });
}

function signup() {
    chrome.tabs.create({
        url: "https://app.namii.ai/sign_up/",
        active: true
    });
}
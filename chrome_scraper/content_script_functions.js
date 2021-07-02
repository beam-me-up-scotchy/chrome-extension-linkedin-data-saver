//Helper functions

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getElementByXpath(path, contextNode = document) {
    return document.evaluate(path, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
};

function getElementsByXpath(path, contextNode = document) {
    return document.evaluate(path, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
};

function getAllTextFromElements(path, contextNode = document, remove_button_text = false) {
    let nodes = getElementsByXpath(path, contextNode);

    let returnString = "";
    try {
        for (var i = 0; i < nodes.snapshotLength; i++) {
            let thisNode = nodes.snapshotItem(i);

            if ((remove_button_text) && (getElementsByXpath(".//button", thisNode).snapshotLength == 1)) {
                var found_string = "";
                if (thisNode.innerText !== undefined) {
                    found_string = thisNode.innerText.replace(/\n/g, " ").trim();
                    var button_string = getElementByXpath(".//button", thisNode).innerText;
                    found_string = found_string.substring(0, found_string.indexOf(button_string));
                }
            } else {
                var found_string = "";
                if (thisNode.innerText !== undefined) {
                    found_string = thisNode.innerText.replace(/\n/g, " ").trim();
                }
            }
            returnString = returnString.concat(found_string, " ").trim();
        }
    }
    catch (e) {
        alert('Error: ' + e);
    }
    return returnString;
}

function getArrayOfTextFromElements(path, contextNode = document) {
    let nodes = getElementsByXpath(path, contextNode);
    let returnArray = [];
    try {
        for (var i = 0; i < nodes.snapshotLength; i++) {
            let thisNode = nodes.snapshotItem(i);
            returnArray.push(thisNode.innerText.trim());
        }
    }
    catch (e) {
        alert('Error: ' + e);
    }
    return returnArray;
}

function getArrayOfHrefs(path, contextNode = document, splitText = '', splitIndex = 0) {
    let nodes = getElementsByXpath(path, contextNode);
    let returnArray = [];
    try {
        for (var i = 0; i < nodes.snapshotLength; i++) {
            let thisNode = nodes.snapshotItem(i);
            let hrefText = thisNode.href;
            if (splitText !== '') { hrefText = hrefText.split(splitText)[splitIndex] };
            returnArray.push(hrefText.trim());
        }
    }
    catch (e) {
        alert('Error: ' + e);
    }
    return returnArray;
}

function clickAllElements(path, contextNode = document, callback = undefined) {

    var nodes = getElementsByXpath(path, contextNode);

    function clickloop(i, nodelist) {
        setTimeout(function () {
            nodes.snapshotItem(i).click();
            --i;
            if (i >= 0) {
                clickloop(i, nodelist);
            } else if ( !(callback==undefined) ) {
                callback();
            }
        }, getRandomInt(250, 1000))
    };

    if (nodes.snapshotLength > 0) {
        clickloop(nodes.snapshotLength - 1);
    } else if (!(callback == undefined)) {
        callback();
    }    
}

function trycatcherror(fn, node, error_msg) {
    let value = '';
    try {
        value = fn(node);
    }
    catch (e) {
        console.log(error_msg + e);
    }
    return value
}

function clickOnce(path, contextNode = document) {
    getElementByXpath(path, contextNode = contextNode).click()
}


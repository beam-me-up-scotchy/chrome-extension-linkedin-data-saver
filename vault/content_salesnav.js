// Notes to self
// Change trycatcherror fn to "node" and "non-node" version
// Put error catching in direct non-node functions

// !!! Profile scraper functions !!!
function sn_in_get_name() {
    return getAllTextFromElements('//span[contains(@class, "profile-topcard-person-entity__name")]');
};

function sn_in_get_salesnav_url() {
    return document.location.href.split(',')[0]+",,";
};

function sn_in_get_about() {
    //nb need to click "see more" and there's a popup
    getElementByXpath('//button[contains(@class, "profile-topcard__summary-expand-link")]').click();
    var text = getAllTextFromElements('//div[@class = "profile-topcard__summary-modal-content"]');
    getElementByXpath('//button[contains(@class, "profile-topcard__summary-modal-footer")]').click();
    return text;
}; //todo - need to do some timing stuff on this so it's not as obvious


function sn_in_get_location() {
    return getAllTextFromElements("//div[contains(@class,'profile-topcard__location-data')]");
};

function sn_in_get_headline() {
    return getAllTextFromElements('//div[contains(@class, "profile-topcard-person-entity__content")]/dl/dd[@class = "mt2"]');
};

function sn_in_get_skills() {
    return getArrayOfTextFromElements('//section[contains(@id, "profile-skills")]/div/ul/li/div/div/span[contains(@class,"profile-skills__skill-name")]');
};

function sn_in_get_contact_info() {
    //nb need to click "Show all (x)" and there's a popup
    getElementByXpath('//button[contains(@aria-label, "contact information (")]').click();
    var contact_info = {};
    contact_info['Phone'] = getArrayOfHrefs('//section[contains(@class, "contact-info-form__phone")]//a',document,"tel:",1);
    contact_info['Email'] = getArrayOfHrefs('//section[contains(@class, "contact-info-form__email")]//a', document, "mailto:", 1);
    contact_info['Website'] = getArrayOfHrefs('//section[contains(@class, "contact-info-form__website")]//a');
    contact_info['Social'] = getArrayOfHrefs('//section[contains(@class, "contact-info-form__social")]//a');
    contact_info['Address'] = getArrayOfTextFromElements('//section[contains(@class, "contact-info-form__address")]//a');
    getElementByXpath('//div[contains(@class,"artdeco-modal__actionbar")]/button[contains(@class, "artdeco-button")]').click();
    return contact_info;
}; //todo - need to do some timing stuff on this so it's not as obvious


//Profile scraper functions - Education
function sn_in_get_schools() {
    var schools_array = [];
    var education_li = getElementsByXpath('//section[@id = "profile-educations"]/div/ul/li');

    try {

        for (var i = 0; i < education_li.snapshotLength; i++) {
            var thisNode = education_li.snapshotItem(i);
            schools_array[i] = {};
            schools_array[i]['School name'] = trycatcherror(in_get_schools_name, thisNode, 'Error getting school name:  ');
            schools_array[i]['Degree info'] = trycatcherror(in_get_schools_degree_info, thisNode, 'Error getting degree info:  ');
            schools_array[i]['Degree dates'] = trycatcherror(in_get_schools_degree_dates, thisNode, 'Error getting degree dates:  ');
        }
    }
    catch (e) {
        alert('Error: Document tree modified during iteration ' + e);
    }
    return schools_array;
};

function sn_in_get_schools_name(node) {
    return getAllTextFromElements("./dl/dt[contains(@class,'profile-education__school-name')]", node).trim();
} 

function sn_in_get_schools_degree_info(node) {
    return getAllTextFromElements("./dl/dd[contains(@class, 'profile-education__degree')]", node).trim();
} //consider breaking this out into more granular info

function sn_in_get_schools_degree_dates(node) {
    return getAllTextFromElements("./dl/dd[contains(@class, 'profile-education__dates')]/span[@data-test-education='dates']", node).trim();
} //consider breaking this out into "start date" and "end date"

//Profile scraper functions - Experience
function sn_in_get_positions() {
    var positions_array = [];
    var experience_li = getElementsByXpath('//section[@id = "profile-positions"]/div[@id="profile-experience"]/ul/li');

    try {
        for (var i = 0; i < experience_li.snapshotLength; i++) {
            var thisNode = experience_li.snapshotItem(i);
            let new_position_index = positions_array.length;
            positions_array[new_position_index] = {};
            positions_array[new_position_index]['Company name'] = trycatcherror(sn_in_get_company_name_flat, thisNode, 'Error getting company name (flat):  ');
            positions_array[new_position_index]['Company LinkedIn URL'] = "";
            positions_array[new_position_index]['Company Sales Navigator URL'] = trycatcherror(in_get_company_salesnav_url_flat, thisNode, 'Error getting company LI URL (flat):  ');
            positions_array[new_position_index]['Position name'] = trycatcherror(in_get_position_name_flat, thisNode, 'Error getting position name (flat):  ');
            positions_array[new_position_index]['Position dates'] = trycatcherror(in_get_position_dates_flat, thisNode, 'Error getting position dates (flat):  ');
            positions_array[new_position_index]['Position length'] = trycatcherror(in_get_position_length_flat, thisNode, 'Error getting position length (flat):  ');
            positions_array[new_position_index]['Position info'] = trycatcherror(in_get_position_info_flat, thisNode, 'Error getting position info (flat):  ');
        }
    }
    catch (e) {
        alert('Error: Document tree modified during iteration ' + e);
    }
    return positions_array;
};

function sn_in_get_company_name_flat(node) {
    return getAllTextFromElements('./dl/dd[contains(@class,"profile-position__secondary-title")]/span[not(contains(@class, "visually-hidden"))]', node);
}

function sn_in_get_company_salesnav_url_flat(node) {
    var company_salesnav_url = getElementByXpath('./dl/dd[contains(@class,"profile-position__secondary-title")]/span[not(contains(@class, "visually-hidden"))]/a', node).href;

    if (company_salesnav_url.includes("/sales/company/")) {
        return company_salesnav_url;
    } else {
        return "https://www.linkedin.com/search/results/all/?keywords=" + encodeURI(sn_in_get_company_name_flat(node));
    }
} //returns without trailing '/' e.g. "https://www.linkedin.com/sales/company/2091531" and handles non-existent companies

function sn_in_get_position_name_flat(node) {
    return getAllTextFromElements('.//dl/dt[contains(@class,"profile-position__title")]', node).trim();
} 

function sn_in_get_position_dates_flat(node) {
    return getElementByXpath('.//dl/dd/p[contains(@class,"profile-position__dates-employed")]/text()[normalize-space()]', node).textContent.trim();
} 

function sn_in_get_position_length_flat(node) {
    return getElementByXpath('.//dl/dd/p[contains(@class,"profile-position__duration")]/text()[normalize-space()]', node).textContent.trim();
} 

function sn_in_get_position_info_flat(node) {
    return getElementByXpath('./dl/dd[contains(@class,"profile-position__description")]/text()[normalize-space()]', node).textContent.trim();
}

//consider also getting location of each position
//consider also getting school linkedin_url

// !!! Company scraper functions !!!

function sn_company_get_company_name() {
    return getAllTextFromElements('//div[contains(@class, "top-card")]//div[contains(@class, "banner")]//h1[contains(@class, "title")]');
};

function sn_company_get_salesnav_url() {
    return document.location.href.split('/people')[0];
};

function sn_company_get_company_overview() {
    //nb need to click "see all" and there's a popup
    getElementByXpath('//h2[contains(@class, "subtitle")]/div/button[contains(@class, "topcard-see-more-link")]').click();
    var text = getAllTextFromElements('//div[contains(@class,"topcard-extended-description-modal")]');
    getElementByXpath('//button[contains(@class, "topcard-extended-description-modal-footer-button-right")]').click();
    return text;
}; //todo - need to do some timing stuff on this so it's not as obvious

function sn_company_get_company_website() {
    return getElementByXpath('//div[@class = "meta-links"]/div/span/a[@data-control-name = "topcard_website"]').href;
};

function sn_company_get_company_phone() {
    return "";
}; //I don't think LinkedIn displays phone numbers anymore for companies

function sn_company_get_company_industry() {

    let text_array = getAllTextFromElements('//div[contains(@class, "top-card")]//p[contains(@class,"muted-copy")]').split(' \u00B7 ');

    if (text_array.length == 3) {
        return text_array[0].trim();
    } else if (text_array == 2) {
        return text_array[0].trim();
    } else {
        console.log("Couldn't find industry...");
        return "";
    }
};

function sn_company_get_company_size() {
    let text_array = getAllTextFromElements('//div[contains(@class, "top-card")]//p[contains(@class,"muted-copy")]').split(' \u00B7 ');

    if (text_array.length == 3) {
        return text_array[2].trim();
    } else if (text_array == 2) {
        return text_array[1].trim();
    } else {
        console.log("Couldn't find size...");
        return "";
    }
};

function sn_company_get_company_employees() {
    return getElementByXpath('//div[contains(@class, "top-card")]//a[@data-control-name = "topcard_employees"]/text()[normalize-space()]').textContent.trim();
}; 

function sn_company_get_company_headquarters() {
    if (getElementsByXpath('//div[@class = "meta-links"]//a[@data-control-name="topcard_headquarters"]').snapshotLength > 0) {
        let arr = getArrayOfTextFromElements('//div[contains(@id, "artdeco-hoverable-artdeco-gen")]');
        return arr[arr.length - 1];
    } else {
        return "";
    }
}; //it displays a location but it's not the registered headquarters... so we disregard it

function sn_company_get_company_type() {
    return "";
}; //doesn't give this info in sales nav

function sn_company_get_company_founded() {
    return "";
}; //doesn't give this info in sales nav

function sn_company_get_company_specialties() {
    return "";
}; //doesn't give this info in sales nav


// !!! Tab control functions !!!
function scroll_to_bottom() {
    let last_height = document.body.scrollHeight;

    while (true) {
        window.scrollTo(0, document.body.scrollHeight);
        let new_height = document.body.scrollHeight;

        console.log(new_height)

        if (new_height == last_height) {
            console.log("breaking loop...")
            break;
        }
        last_height = new_height;
    }
};

function scroll_to_top() {
    window.scrollTo(0, 0);
};

function expand_stuff() {
    clickAllElements('//button[@data-test-experience-section="expand-button" and @aria-expanded="false"]');
    clickAllElements('//button[@data-test-skills-section="expand-button" and @aria-expanded="false"]');
};


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "scrape button clicked") {
            console.log("received loud and clear!");

            // Scroll to bottom of page to force complete load, then call scrape()

            console.log(document.location.href);

            if (document.location.href.indexOf("linkedin.com/sales/people/") > -1) {
                console.log("yes to profile scraper condition");
                $("html, body").animate({
                    scrollTop: $(
                        'html, body').get(0).scrollHeight
                }, 2000).promise().then(function () {
                    $('html,body').animate({ scrollTop: 0 }, 2000);
                    if (getElementsByXpath('.//div[contains(@class,"artdeco-loader")]').snapshotLength == 0) {
                        console.log("No loading time!");
                        sn_in_get_ln_url();
                    } else {
                        sn_LI_spinner_observer();
                    }
                });
            } else if (document.location.href.indexOf("linkedin.com/sales/company/") > -1) {
                console.log("yes to company scraper condition");
                if (getElementsByXpath('.//div[contains(@class,"artdeco-loader")]').snapshotLength == 0) {
                    console.log("No loading time!");
                    sn_company_get_ln_url();
                } else {
                    sn_company_spinner_observer();
                }
            }
        }
    }
)

function sn_in_get_ln_url() {

    if (getElementsByXpath('//button[contains(@class,"right-actions-overflow-menu-trigger")]').snapshotLength > 0) {

        var read_clipboard_get_reponse = function () {
            console.log("in_get_ln_url read_clipboard_get_response");
            document.removeEventListener('copy', read_clipboard_get_reponse, true);
            chrome.runtime.sendMessage({
                message: "read_clipboard",
            },
                function (response) {
                    console.log(response.response + "/");
                    sn_scrape_LI(response.response + "/");
                });
        }

        getElementByXpath('//button[contains(@class,"right-actions-overflow-menu-trigger")]').click();
        getElementByXpath('//div[@data-control-name = "copy_linkedin"]').click();

        document.addEventListener('copy', read_clipboard_get_reponse, true);
    } else {
        sn_scrape_LI("");
    }
};

function company_get_ln_url() {

    var observation_node = getElementByXpath('//div[contains(@class, "company-topcard-actions__overflow-dropdown")]');

    var read_clipboard_get_reponse = function () {
        console.log("company_get_ln_url read_clipboard_get_response");
        document.removeEventListener('copy', read_clipboard_get_reponse, true);
        chrome.runtime.sendMessage({
            message: "read_clipboard",
        },
            function (response) {
                console.log(response.response);
                sn_scrape_company(response.response);
            });
    }

    var observer = new MutationObserver(function (mutations) {
        if (document.contains(observation_node)) {
            observer.disconnect();
            console.log("observer disconnected (company)");

            document.addEventListener('copy', read_clipboard_get_reponse, true); 

            getElementByXpath('//div[contains(@class, "company-topcard-actions__overflow-dropdown")]//ul/li/div[contains(.,"Copy")]').click();
        }
    });

    observer.observe(document, { attributes: false, childList: true, characterData: false, subtree: true });

    getElementByXpath('//button[contains(@class,"right-actions-overflow-menu-trigger")]').click();
}; //todo

function sn_LI_spinner_observer() {
    var observation_node = getElementByXpath('//div[contains(@class, "profile-body")]');

    var observer = new MutationObserver(function (mutations) {

        if (getElementsByXpath('.//div[contains(@class,"artdeco-loader")]', observation_node).snapshotLength == 0) {
            console.log("Scraped via observer.")
            observer.disconnect();
            sn_in_get_ln_url();
        } else {
            console.log("Still loading!");
        }
    });

    observer.observe(observation_node, { attributes: false, childList: true, characterData: false, subtree: true });
}

function sn_company_spinner_observer() {
    var observation_node = getElementByXpath('//main[id = "content-main"]');

    var observer = new MutationObserver(function (mutations) {

        if (getElementsByXpath('.//div[contains(@class,"artdeco-loader")]', observation_node).snapshotLength == 0) {
            console.log("Scraped via observer.")
            observer.disconnect();
            sn_company_get_ln_url();
        } else {
            console.log("Still loading!");
        }
    });

    observer.observe(observation_node, { attributes: false, childList: true, characterData: false, subtree: true });
}

function sn_scrape_LI(LinkedIn_URL) {
    expand_stuff();

    var in_payload = {};

    in_payload["Name"] = trycatcherror(sn_in_get_name, document, "Error getting name.");
    in_payload["About"] = trycatcherror(sn_in_get_about, document, "Error getting about.");
    in_payload["LinkedIn URL"] = LinkedIn_URL;
    in_payload["Sales Navigator URL"] = trycatcherror(sn_in_get_salesnav_url, document, "Error getting about.");
    in_payload["Location"] = trycatcherror(sn_in_get_location, document, "Error getting profile location.");
    in_payload["Headline"] = trycatcherror(sn_in_get_headline, document, "Error getting headline.");
    in_payload["Schools"] = trycatcherror(sn_in_get_schools, document, "Error getting schools.");
    in_payload["Positions"] = trycatcherror(sn_in_get_positions, document, "Error getting positions.");
    in_payload["Skills"] = trycatcherror(sn_in_get_skills, document, "Error getting skills.");
    in_payload["Contact info"] = trycatcherror(sn_in_get_contact_info, document, "Error getting contact info.");

    console.log(in_payload);
    console.log(JSON.stringify(in_payload))

    chrome.storage.sync.get("user_email", function (user_email) {
        if (user_email === "mitchscott94@gmail.com") {
            var url = "https://app.namii.ai/version-test/api/1.1/wf/profile_salesnav";
            chrome.runtime.sendMessage({ message: "make_api_call", method: "POST", url: url, token: "Stored", payload: in_payload });
        } else {
            var url = "https://app.namii.ai/version-live/api/1.1/wf/profile_salesnav";
            chrome.runtime.sendMessage({ message: "make_api_call", method: "POST", url: url, token: "Stored", payload: in_payload });
        }
    });
}

function sn_scrape_company(LinkedIn_URL) {
    var company_payload = {};

    company_payload["Name"] = trycatcherror(sn_company_get_company_name, document, "Error getting company name.");
    company_payload["LinkedIn URL"] = LinkedIn_URL;
    company_payload["Sales Navigator URL"] = trycatcherror(sn_company_get_salesnav_url, document, "Error getting about.");
    company_payload["Overview"] = trycatcherror(sn_company_get_company_overview, document, "Error getting company overview.");
    company_payload["Website"] = trycatcherror(sn_company_get_company_website, document, "Error getting company website.");
    company_payload["Phone"] = trycatcherror(sn_company_get_company_phone, document, "Error getting company phone.");
    company_payload["Industry"] = trycatcherror(sn_company_get_company_industry, document, "Error getting company industry.");
    company_payload["Size"] = trycatcherror(sn_company_get_company_size, document, "Error getting company size.");
    company_payload["Employees"] = trycatcherror(sn_company_get_company_employees, document, "Error getting company employees.");
    company_payload["Headquarters"] = trycatcherror(sn_company_get_company_headquarters, document, "Error getting company headquarters.");
    company_payload["Type"] = trycatcherror(sn_company_get_company_type, document, "Error getting company type.");
    company_payload["Founded"] = trycatcherror(sn_company_get_company_founded, document, "Error getting company founded.");
    company_payload["Specialties"] = trycatcherror(sn_company_get_company_specialties, document, "Error getting company specialties.");

    console.log(company_payload);
    console.log(JSON.stringify(company_payload))

    chrome.storage.sync.get("user_email", function (user_email) {
        if (user_email === "mitchscott94@gmail.com") {
            var url = "https://app.namii.ai/version-test/api/1.1/wf/company_salesnav";
            chrome.runtime.sendMessage({ message: "make_api_call", method: "POST", url: url, token: "Stored", payload: company_payload });
        } else {
            var url = "https://app.namii.ai/version-live/api/1.1/wf/company_salesnav";
            chrome.runtime.sendMessage({ message: "make_api_call", method: "POST", url: url, token: "Stored", payload: company_payload });
        }
    });
}

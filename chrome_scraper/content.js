// !!! Profile scraper functions !!!
function in_get_name() {
    return getAllTextFromElements('//section[contains(@class, "pv-top-card")]//li[contains(@class, "break-words")]');
};

function in_get_about() {
    return getAllTextFromElements('//p[contains(@class,"pv-about__summary-text")]/span[contains(@class,"lt-line-clamp__line") or contains(@class,"lt-line-clamp__raw-line")]');
};

function in_get_location() {
    return getAllTextFromElements('//section[contains(@class, "pv-top-card")]//li[@class="t-16 t-black t-normal inline-block"][1]');
};

function in_get_ln_url() {
    return document.location.href;
};

function in_get_headline() {
    return getAllTextFromElements('//section[contains(@class, "pv-top-card")]//h2');
};

function in_get_skills() {
    return getArrayOfTextFromElements('//span[contains(@class, "pv-skill-category-entity__name-text")]');
};

// Profile scraper functions - Education
function in_get_schools() {
    var schools_array = [];
    var education_li = getElementsByXpath('//section[@id = "education-section"]/ul/li');

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

function in_get_schools_name(node) {
    return getAllTextFromElements(".//h3[contains(@class,'pv-entity__school-name')]", node).trim()
}

function in_get_schools_degree_info(node) {
    return getAllTextFromElements(".//div[@class = 'pv-entity__degree-info']/p", node).trim()
}

function in_get_schools_degree_dates(node) {
    return getAllTextFromElements(".//p[contains(@class, 'pv-entity__dates')]/span[not(@class='visually-hidden')]", node).trim()
}

//Profile scraper functions - Experience
function in_get_positions() {
    var positions_array = [];
    var experience_li = getElementsByXpath('//section[@id = "experience-section"]/ul/li');

    try {
        for (var i = 0; i < experience_li.snapshotLength; i++) {
            var thisNode = experience_li.snapshotItem(i);

            if (getElementsByXpath(".//a[@data-control-name='background_details_company']/div[contains(@class,'pv-entity__company-details')]", thisNode).snapshotLength > 0) {
                var nested_experience = true;
            }
            else {
                var nested_experience = false;
            }

            if (nested_experience) {
                var position_li = getElementsByXpath('.//li', thisNode);
                for (var p = 0; p < position_li.snapshotLength; p++) {
                    let new_position_index = positions_array.length;
                    var thisPositionNode = position_li.snapshotItem(p);
                    positions_array[new_position_index] = {};
                    positions_array[new_position_index]['Company name'] = trycatcherror(in_get_company_name_nested, thisNode, 'Error getting company name (nested):  ');
                    positions_array[new_position_index]['Company LinkedIn URL'] = trycatcherror(in_get_company_linkedin_url_nested, thisNode, 'Error getting company LI URL (nested):  ');
                    positions_array[new_position_index]['Position name'] = trycatcherror(in_get_position_name_nested, thisPositionNode, 'Error getting position name (nested):  ');
                    positions_array[new_position_index]['Position dates'] = trycatcherror(in_get_position_dates_nested, thisPositionNode, 'Error getting position dates (nested):  ');
                    positions_array[new_position_index]['Position length'] = trycatcherror(in_get_position_length_nested, thisPositionNode, 'Error getting position length (nested):  ');
                    positions_array[new_position_index]['Position info'] = trycatcherror(in_get_position_info_nested, thisPositionNode, 'Error getting position info (nested):  ');
                }
            } else {
                let new_position_index = positions_array.length;
                positions_array[new_position_index] = {};
                positions_array[new_position_index]['Company name'] = trycatcherror(in_get_company_name_flat, thisNode, 'Error getting company name (flat):  ');
                positions_array[new_position_index]['Company LinkedIn URL'] = trycatcherror(in_get_company_linkedin_url_flat, thisNode, 'Error getting company LI URL (flat):  ');
                positions_array[new_position_index]['Position name'] = trycatcherror(in_get_position_name_flat, thisNode, 'Error getting position name (flat):  ');
                positions_array[new_position_index]['Position dates'] = trycatcherror(in_get_position_dates_flat, thisNode, 'Error getting position dates (flat):  ');
                positions_array[new_position_index]['Position length'] = trycatcherror(in_get_position_length_flat, thisNode, 'Error getting position length (flat):  ');
                positions_array[new_position_index]['Position info'] = trycatcherror(in_get_position_info_flat, thisNode, 'Error getting position info (flat):  ');
            }
        }
    }
    catch (e) {
        alert('Error: Document tree modified during iteration ' + e);
    }
    return positions_array;
};

function in_get_company_name_flat(node) {
    return getElementByXpath('.//p[contains(@class,"pv-entity__secondary-title")]/text()[normalize-space()]', node).textContent.trim();
}

function in_get_company_name_nested(node) {
    return getAllTextFromElements('.//div[@class = "pv-entity__company-summary-info"]/h3/span[2]', node).trim();
}

function in_get_company_linkedin_url_flat(node) {
    return getElementByXpath('.//a[@data-control-name="background_details_company"]', node).href;
}

function in_get_company_linkedin_url_nested(node) {
    return getElementByXpath('.//a[@data-control-name="background_details_company"]', node).href;
}

function in_get_position_name_flat(node) {
    return getAllTextFromElements('.//h3', node).trim();
}

function in_get_position_name_nested(node) {
    return getAllTextFromElements('.//div[contains(@class,"pv-entity__summary-info-v2")]/h3/span[2]', node).trim();
}

function in_get_position_dates_flat(node) {
    return getAllTextFromElements('.//*[contains(@class, "pv-entity__date-range")]/span[not(@class = "visually-hidden")]', node).trim();
}

function in_get_position_dates_nested(node) {
    return getAllTextFromElements('.//*[contains(@class, "pv-entity__date-range")]/span[not(@class = "visually-hidden")]', node).trim();
}

function in_get_position_length_flat(node) {
    return getAllTextFromElements('.//div[contains(@class, "display-flex")]/h4[not(contains(@class, "pv-entity__date-range"))]/span[not(@class = "visually-hidden")]', node).trim();
}

function in_get_position_length_nested(node) {
    return getAllTextFromElements('.//div[contains(@class, "display-flex")]/h4[not(contains(@class, "pv-entity__date-range"))]/span[not(@class = "visually-hidden")]', node).trim();
}

function in_get_position_info_flat(node) {
    return getAllTextFromElements('.//*[contains(@class, "pv-entity__extra-details")]/p', node, true).trim();
}

function in_get_position_info_nested(node) {
    return getAllTextFromElements('.//*[contains(@class, "pv-entity__extra-details")]/p', node, true).trim();
}


// !!! Company scraper functions !!!

function company_get_company_name() {
    return getAllTextFromElements('//section[contains(@class, "org-top-card")]//h1[contains(@class, "org-top-card-summary__title")]');
};

function company_get_company_url() {
    return document.location.href.replace(/\/about\//, "/");
};

function company_get_company_overview() {
    return getAllTextFromElements('//h4[contains(.,"Overview")]/parent::section/p');
};

function company_get_company_website() {
    return getAllTextFromElements('//dt[contains(., "Website")]/following::dd[1]/a');
};

function company_get_company_phone() {
    return getElementByXpath('//dt[contains(., "Phone")]/following::dd[1]/a').href.substring(4);
};

function company_get_company_industry() {
    return getAllTextFromElements('//dt[contains(., "Industry")]/following::dd[1]');
};

function company_get_company_size() {
    return getAllTextFromElements('//dt[contains(., "Company size")]/following::dd[1]');
};

function company_get_company_employees() {
    return getElementByXpath('//dt[contains(., "Company size")]/following::dd[2]/text()[normalize-space()]').textContent.trim();
};

function company_get_company_headquarters() {
    return getAllTextFromElements('//dt[contains(., "Headquarters")]/following::dd[1]');
};

function company_get_company_type() {
    return getAllTextFromElements('//dt[contains(., "Type")]/following::dd[1]');
};

function company_get_company_founded() {
    return getAllTextFromElements('//dt[contains(., "Founded")]/following::dd[1]');
};

function company_get_company_specialties() {
    return getAllTextFromElements('//dt[contains(., "Specialties")]/following::dd[1]');
};


// !!! Salesnav Profile scraper functions !!!
function sn_in_get_name() {
    return getAllTextFromElements('//span[contains(@class, "profile-topcard-person-entity__name")]');
};

function sn_in_get_salesnav_url() {
    return document.location.href.split(',')[0] + ",,";
};

function sn_in_get_about() {
    //nb need to click "see more" and there's a popup
    getElementByXpath('//button[contains(@class, "profile-topcard__summary-expand-link")]').click();
    var text = getAllTextFromElements('//div[@class = "profile-topcard__summary-modal-content"]');
    getElementByXpath('//button[contains(@class, "profile-topcard__summary-modal-footer")]').click();
    return text;
};


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
    contact_info['Phone'] = getArrayOfHrefs('//section[contains(@class, "contact-info-form__phone")]//a', document, "tel:", 1);
    contact_info['Email'] = getArrayOfHrefs('//section[contains(@class, "contact-info-form__email")]//a', document, "mailto:", 1);
    contact_info['Website'] = getArrayOfHrefs('//section[contains(@class, "contact-info-form__website")]//a');
    contact_info['Social'] = getArrayOfHrefs('//section[contains(@class, "contact-info-form__social")]//a');
    contact_info['Address'] = getArrayOfTextFromElements('//section[contains(@class, "contact-info-form__address")]//a');
    getElementByXpath('//div[contains(@class,"artdeco-modal__actionbar")]/button[contains(@class, "artdeco-button")]').click();
    return contact_info;
}; 


//Profile scraper functions - Education
function sn_in_get_schools() {
    var schools_array = [];
    var education_li = getElementsByXpath('//section[@id = "profile-educations"]/div/ul/li');

    try {

        for (var i = 0; i < education_li.snapshotLength; i++) {
            var thisNode = education_li.snapshotItem(i);
            schools_array[i] = {};
            schools_array[i]['School name'] = trycatcherror(sn_in_get_schools_name, thisNode, 'Error getting school name:  ');
            schools_array[i]['Degree info'] = trycatcherror(sn_in_get_schools_degree_info, thisNode, 'Error getting degree info:  ');
            schools_array[i]['Degree dates'] = trycatcherror(sn_in_get_schools_degree_dates, thisNode, 'Error getting degree dates:  ');
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
} 

function sn_in_get_schools_degree_dates(node) {
    return getAllTextFromElements("./dl/dd[contains(@class, 'profile-education__dates')]/span[@data-test-education='dates']", node).trim();
} 

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
            positions_array[new_position_index]['Company Sales Navigator URL'] = trycatcherror(sn_in_get_company_salesnav_url_flat, thisNode, 'Error getting company LI URL (flat):  ');
            positions_array[new_position_index]['Position name'] = trycatcherror(sn_in_get_position_name_flat, thisNode, 'Error getting position name (flat):  ');
            positions_array[new_position_index]['Position dates'] = trycatcherror(sn_in_get_position_dates_flat, thisNode, 'Error getting position dates (flat):  ');
            positions_array[new_position_index]['Position length'] = trycatcherror(sn_in_get_position_length_flat, thisNode, 'Error getting position length (flat):  ');
            positions_array[new_position_index]['Position info'] = trycatcherror(sn_in_get_position_info_flat, thisNode, 'Error getting position info (flat):  ');
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
} 

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
    return getAllTextFromElements('./dl/dd[contains(@class,"profile-position__description")]', node).substring(12);
}


// !!! Salesnav Company scraper functions !!!

function sn_company_get_company_name() {
    return getAllTextFromElements('//div[contains(@class, "account-top-card__basic-info")]//div[contains(@class, "artdeco-entity-lockup__title")]');
};

function sn_company_get_salesnav_url() {
    return document.location.href.split('/people')[0];
};

function sn_company_get_company_overview_panel() {
    //this needs to be proceeded by an element click opening the popup - panel info
    return getAllTextFromElements('//p[contains(@class,"company-details-panel-description")]');
};

function sn_company_get_company_overview_non_panel() {
    //this needs to be proceeded by an element click opening the popup
    return getAllTextFromElements('//p[contains(@class,"account-top-card__account-description")]');
}; 

function sn_company_get_company_website() {
    return getElementByXpath('//div[contains(@class,"account-actions")]//a[@data-control-name = "visit_company_website"]').href;
};

function sn_company_get_company_phone() {
    return "";
}; 

function sn_company_get_company_industry() {

    let text_array = getAllTextFromElements('//div[contains(@class,"account-top-card__lockup-content")]//div[contains(@class, "artdeco-entity-lockup__subtitle")]/div').split('\u00B7 ');

    if (text_array.length == 2) {
        return text_array[0].trim();
    } else {
        return "";
    }
};

function sn_company_get_company_size() {
    return "";
}; 

function sn_company_get_company_employees() {
    let text_array = getAllTextFromElements('//div[contains(@class,"account-top-card__lockup-content")]//div[contains(@class, "artdeco-entity-lockup__subtitle")]/div').split('\u00B7 ');

    if (text_array.length == 2) {
        return text_array[1].trim();
    } else if (text_array.length == 1) {
        return text_array[0].trim();
    } else {
        return "";
    }
};

function sn_company_get_company_headquarters() {
    return getAllTextFromElements('//div[contains(@class,"ember-panel")]//dd[contains(@class,"company-details-panel-headquarters")]');
}; //panel info

function sn_company_get_company_type() {
    return getAllTextFromElements('//div[contains(@class,"ember-panel")]//dd[contains(@class,"company-details-panel-type")]');
}; //panel info

function sn_company_get_company_founded() {
    return getAllTextFromElements('//div[contains(@class,"ember-panel")]//dd[contains(@class,"company-details-panel-founded")]');
}; //panel info

function sn_company_get_company_specialties() {
    return getAllTextFromElements('//div[contains(@class,"ember-panel")]//dd[contains(@class,"company-details-panel-specialties")]');
}; //panel info


//Tab control functions
function scroll_to_bottom() {
    let last_height = document.body.scrollHeight;

    while (true) {
        window.scrollTo(0, document.body.scrollHeight);
        let new_height = document.body.scrollHeight;

        if (new_height == last_height) {
            break;
        }
        last_height = new_height;
    }
};

function scroll_to_top() {
    window.scrollTo(0, 0);
};

function expand_stuff(callback) {
    path_array = [];
    path_array.push('//a[@data-test-line-clamp-show-more-button="true" and @aria-expanded="false"]');
    path_array.push('//*[contains(@class,"pv-profile-section__see-more-inline") and @aria-expanded="false"]');
    path_array.push('//section[contains(@class, "pv-skill-categories-section")]//button[@aria-expanded="false"]');
    path_array.push('//section[@id = "experience-section"]//button[contains(@class, "inline-show-more-text__button") and @aria-expanded="false"]');
    path_array.push('//div[@id="profile-experience"]/button[@data-test-experience-section = "expand-button" and @aria-expanded="false"]');
    clickAllElements(path_array.join(" | "), document, callback);
};

function scrape_init() {
    if (document.location.href.indexOf("linkedin.com/in/") > -1) {
        $("html, body").animate({
            scrollTop: $(
                'html, body').get(0).scrollHeight
        }, getRandomInt(2000, 5000)).promise().then(function () {
            if (getElementsByXpath('.//div[contains(@class,"pv-deferred-area__loader")]').snapshotLength == 0) {
                //console.log("Finished loading!");
                expand_stuff(scrape_LI);
            } else {
                li_spinner_observer();
            }
            $('html,body').animate({ scrollTop: 0 }, getRandomInt(2000, 5000));
        });
    } else if (document.location.href.indexOf("linkedin.com/company/") > -1) {
        clickOnce('//a[contains(@href, "/about/")]');
        $("html, body").animate({
            scrollTop: $(
                'html, body').get(0).scrollHeight
        }, getRandomInt(2000, 5000)).promise().then(function () {
            if (getElementsByXpath('.//div[contains(@class,"artdeco-loader")]').snapshotLength == 0) {
                //console.log("Finished loading!");
                expand_stuff(scrape_company);
            } else {
                company_about_spinner_observer();
            }
            $('html,body').animate({ scrollTop: 0 }, getRandomInt(2000, 5000));
        });
    } else if (document.location.href.indexOf("linkedin.com/sales/people/") > -1) {
        //console.log("yes to profile scraper condition");
        $("html, body").animate({
            scrollTop: $(
                'html, body').get(0).scrollHeight
        }, getRandomInt(2000, 5000)).promise().then(function () {
            $('html,body').animate({ scrollTop: 0 }, getRandomInt(2000, 5000));

            if (getElementsByXpath('.//div[contains(@class,"artdeco-loader")]').snapshotLength == 0) {
                expand_stuff(sn_in_get_ln_url);
            } else {
                sn_LI_spinner_observer();
            }
        });
    } else if (document.location.href.indexOf("linkedin.com/sales/company/") > -1) {
        //console.log("yes to company scraper condition");
        if (getElementsByXpath('.//div[contains(@class,"artdeco-loader")]').snapshotLength == 0) {
            //console.log("No loading time!");
            expand_stuff(sn_company_get_ln_url);
        } else {
            sn_company_spinner_observer();
        }
    } else {
        console.log("Not able to be scraped.")
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "scrape button clicked") {
            scrape_init();
        }
    }
)

//chrome.runtime.onMessage.addListener(
//    function (request, sender, sendResponse) {
//        if (request.message === "scrape button clicked") {
//            console.log("received loud and clear!");

//            if (document.location.href.indexOf("linkedin.com/in/") > -1) {
//                $("html, body").animate({
//                    scrollTop: $(
//                        'html, body').get(0).scrollHeight
//                }, getRandomInt(2000, 5000)).promise().then(function () {
//                    if (getElementsByXpath('.//div[contains(@class,"pv-deferred-area__loader")]').snapshotLength == 0) {
//                        console.log("Finished loading!");
//                        expand_stuff(scrape_LI);
//                    } else {
//                        li_spinner_observer();
//                    }
//                    $('html,body').animate({ scrollTop: 0 }, getRandomInt(2000, 5000));
//                });
//            } else if (document.location.href.indexOf("linkedin.com/company/") > -1) {
//                clickOnce('//a[contains(@href, "/about/")]');
//                $("html, body").animate({
//                    scrollTop: $(
//                        'html, body').get(0).scrollHeight
//                }, getRandomInt(2000, 5000)).promise().then(function () {
//                    if (getElementsByXpath('.//div[contains(@class,"artdeco-loader")]').snapshotLength == 0) {
//                        console.log("Finished loading!");
//                        expand_stuff(scrape_company);
//                    } else {
//                        company_about_spinner_observer();
//                    }
//                    $('html,body').animate({ scrollTop: 0 }, getRandomInt(2000, 5000));
//                });
//            } else if (document.location.href.indexOf("linkedin.com/sales/people/") > -1) {
//                console.log("yes to profile scraper condition");
//                $("html, body").animate({
//                    scrollTop: $(
//                        'html, body').get(0).scrollHeight
//                }, getRandomInt(2000, 5000)).promise().then(function () {
//                    $('html,body').animate({ scrollTop: 0 }, getRandomInt(2000, 5000));
//                    if (getElementsByXpath('.//div[contains(@class,"artdeco-loader")]').snapshotLength == 0) {
//                        console.log("No loading time!");
//                        expand_stuff(sn_in_get_ln_url);
//                    } else {
//                        sn_LI_spinner_observer();
//                    }
//                });
//            } else if (document.location.href.indexOf("linkedin.com/sales/company/") > -1) {
//                console.log("yes to company scraper condition");
//                if (getElementsByXpath('.//div[contains(@class,"artdeco-loader")]').snapshotLength == 0) {
//                    console.log("No loading time!");
//                    expand_stuff(sn_company_get_ln_url);
//                } else {
//                    sn_company_spinner_observer();
//                }
//            } else {
//                console.log("Not able to be scraped.")
//            }
//        }
//    }
//)

function li_spinner_observer() {
    var observation_node = getElementByXpath('//div[@class = "profile-detail"]');

    var observer = new MutationObserver(function (mutations) {

        if (getElementsByXpath('.//div[contains(@class,"pv-deferred-area__loader")]', observation_node).snapshotLength == 0) {
            observer.disconnect();
            expand_stuff(scrape_LI);
        } else {
            //console.log("Still loading!");
        }
    });

    observer.observe(observation_node, { attributes: false, childList: true, characterData: false, subtree: true });
}

function company_about_spinner_observer() {
    var observation_node = getElementByXpath('//div[contains(@class,"org-grid__content")]');
    //console.log(observation_node);
    //console.log(document);

    var observer = new MutationObserver(function (mutations) {

        if (getElementsByXpath('.//div[contains(@class,"artdeco-loader")]', observation_node).snapshotLength == 0) {
            //console.log("Scraped via observer.")
            observer.disconnect();
            expand_stuff(scrape_company);
        } else {
            //console.log("Still loading!");
        }
    });

    observer.observe(observation_node, { attributes: false, childList: true, characterData: false, subtree: true });
}

function scrape_LI() {
    expand_stuff();

    var in_payload = {};

    in_payload["Name"] = trycatcherror(in_get_name, document, "Error getting name.");
    in_payload["About"] = trycatcherror(in_get_about, document, "Error getting about.");
    in_payload["LinkedIn URL"] = trycatcherror(in_get_ln_url, document, "Error getting URL.");
    in_payload["Sales Navigator URL"] = "";
    in_payload["Location"] = trycatcherror(in_get_location, document, "Error getting profile location.");
    in_payload["Headline"] = trycatcherror(in_get_headline, document, "Error getting headline.");
    in_payload["Schools"] = trycatcherror(in_get_schools, document, "Error getting schools.");
    in_payload["Positions"] = trycatcherror(in_get_positions, document, "Error getting positions.");
    in_payload["Skills"] = trycatcherror(in_get_skills, document, "Error getting skills.");

    var contact_info = {};
    contact_info['Phone'] = "";
    contact_info['Email'] = "";
    contact_info['Website'] = "";
    contact_info['Social'] = "";
    contact_info['Address'] = "";
    in_payload["Contact info"] = contact_info;

    var url = "https://app.namii.ai/version-live/api/1.1/wf/profile";
    chrome.runtime.sendMessage({ message: "make_api_call", method: "POST", url: url, token: "Stored", payload: in_payload });
}

function scrape_company() {
    var company_payload = {};

    company_payload["Name"] = trycatcherror(company_get_company_name, document, "Error getting company name.");
    company_payload["LinkedIn URL"] = trycatcherror(company_get_company_url, document, "Error getting company linkedin url.");
    company_payload["Sales Navigator URL"] = "";
    company_payload["Overview"] = trycatcherror(company_get_company_overview, document, "Error getting company overview.");
    company_payload["Website"] = trycatcherror(company_get_company_website, document, "Error getting company website.");
    company_payload["Phone"] = trycatcherror(company_get_company_phone, document, "Error getting company phone.");
    company_payload["Industry"] = trycatcherror(company_get_company_industry, document, "Error getting company industry.");
    company_payload["Size"] = trycatcherror(company_get_company_size, document, "Error getting company size.");
    company_payload["Employees"] = trycatcherror(company_get_company_employees, document, "Error getting company employees.");
    company_payload["Headquarters"] = trycatcherror(company_get_company_headquarters, document, "Error getting company headquarters.");
    company_payload["Type"] = trycatcherror(company_get_company_type, document, "Error getting company type.");
    company_payload["Founded"] = trycatcherror(company_get_company_founded, document, "Error getting company founded.");
    company_payload["Specialties"] = trycatcherror(company_get_company_specialties, document, "Error getting company specialties.");

    var url = "https://app.namii.ai/version-live/api/1.1/wf/company";
    chrome.runtime.sendMessage({ message: "make_api_call", method: "POST", url: url, token: "Stored", payload: company_payload });
}


//Salesnav control functions

function sn_in_get_ln_url() {

    console.log("Got to sn_in_get_ln_url");

    if (getElementsByXpath('//div[contains(@class,"profile-topcard-actions ")]//li-icon[contains(@type,"ellipsis-horizontal-icon")]/..').snapshotLength > 0) {

        var read_clipboard_get_reponse = function () {
            console.log("Reading clipboard...");
            document.removeEventListener('copy', read_clipboard_get_reponse, true);
            chrome.runtime.sendMessage({
                message: "read_clipboard",
            },
                function (response) {
                    expand_stuff(function () { sn_scrape_LI(response.response + "/"); });
                });
        }

        document.addEventListener('copy', read_clipboard_get_reponse, true);
        console.log("Added listener for clipboard");

        if (!AUTOSCRAPE) {
        getElementByXpath('//div[contains(@class,"profile-topcard-actions ")]//li-icon[contains(@type,"ellipsis-horizontal-icon")]/..').click();
        getElementByXpath('//div[@data-control-name = "copy_linkedin"]').click();
        } 
    } else {
        sn_scrape_LI("");
    }
};

function sn_company_get_ln_url() {

    var observation_node = getElementByXpath('//div[contains(@class, "artdeco-dropdown__content")]');

    var read_clipboard_get_reponse = function () {
        document.removeEventListener('copy', read_clipboard_get_reponse, true);
        chrome.runtime.sendMessage({
            message: "read_clipboard",
        },
            function (response) {
                expand_stuff(function () { sn_scrape_company(response.response); });
            });
    }

    var observer = new MutationObserver(function (mutations) {
        if (document.contains(observation_node)) {
            observer.disconnect();

            document.addEventListener('copy', read_clipboard_get_reponse, true);

            getElementByXpath('//div[contains(@class, "artdeco-dropdown__content-inner")]//div[@data-control-name = "copy_li_url"]').click();
        }
    });

    observer.observe(document, { attributes: false, childList: true, characterData: false, subtree: true });

    getElementByXpath('//div[contains(@class,"account-actions")]//li-icon[contains(@type,"ellipsis-horizontal-icon")]/..').click();
};

function sn_LI_spinner_observer() {
    var observation_node = getElementByXpath('//div[contains(@class, "profile-body")]');

    var observer = new MutationObserver(function (mutations) {

        if (getElementsByXpath('.//div[contains(@class,"artdeco-loader")]', observation_node).snapshotLength == 0) {
            observer.disconnect();
            sn_in_get_ln_url();
        } else {
        }
    });

    observer.observe(observation_node, { attributes: false, childList: true, characterData: false, subtree: true });
}

function sn_company_spinner_observer() {
    var observation_node = getElementByXpath('//main[id = "content-main"]');

    var observer = new MutationObserver(function (mutations) {

        if (getElementsByXpath('.//div[contains(@class,"artdeco-loader")]', observation_node).snapshotLength == 0) {
            observer.disconnect();
            sn_company_get_ln_url();
        } else {
        }
    });

    observer.observe(observation_node, { attributes: false, childList: true, characterData: false, subtree: true });
}

function sn_scrape_LI(LinkedIn_URL) {

    console.log("Got to SN_scrape_LI");

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

    console.log("Finished scraping stuff");

    chrome.storage.sync.get("user_email", function (user_email) {
        if (user_email.user_email === "REDACTED") {
            var url = "https://app.namii.ai/version-test/api/1.1/wf/profile_salesnav";
            chrome.runtime.sendMessage({ message: "make_api_call", method: "POST", url: url, token: "Stored", payload: in_payload });
        } else {
            var url = "https://app.namii.ai/version-live/api/1.1/wf/profile_salesnav";
            chrome.runtime.sendMessage({ message: "make_api_call", method: "POST", url: url, token: "Stored", payload: in_payload });
            console.log("We sent the message");
        }
    });
}

function sn_scrape_company(LinkedIn_URL) {
    var company_payload = {};

    company_payload["Name"] = trycatcherror(sn_company_get_company_name, document, "Error getting company name.");
    company_payload["LinkedIn URL"] = LinkedIn_URL;
    company_payload["Sales Navigator URL"] = trycatcherror(sn_company_get_salesnav_url, document, "Error getting about.");
    company_payload["Website"] = trycatcherror(sn_company_get_company_website, document, "Error getting company website.");

    if (getElementsByXpath('//p[contains(@class, "account-top-card__account-description")]/div/button[@data-control-name="read_more_description"]').snapshotLength > 0) {
        getElementByXpath('//p[contains(@class, "account-top-card__account-description")]/div/button[@data-control-name="read_more_description"]').click();
        company_payload["Overview"] = trycatcherror(sn_company_get_company_overview_panel, document, "Error getting company overview.");
        company_payload["Headquarters"] = trycatcherror(sn_company_get_company_headquarters, document, "Error getting company headquarters.");
        company_payload["Type"] = trycatcherror(sn_company_get_company_type, document, "Error getting company type.");
        company_payload["Founded"] = trycatcherror(sn_company_get_company_founded, document, "Error getting company founded.");
        company_payload["Specialties"] = trycatcherror(sn_company_get_company_specialties, document, "Error getting company specialties.");
        getElementByXpath('//div[contains(@class, "ember-panel")]/button[contains(@class,"ember-panel__dismiss")]').click();
    } else {
        company_payload["Overview"] = trycatcherror(sn_company_get_company_overview_non_panel, document, "Error getting company overview.");
        company_payload["Headquarters"] = "";
        company_payload["Type"] = "";
        company_payload["Founded"] = "";
        company_payload["Specialties"] = "";
    }

    company_payload["Phone"] = trycatcherror(sn_company_get_company_phone, document, "Error getting company phone.");
    company_payload["Industry"] = trycatcherror(sn_company_get_company_industry, document, "Error getting company industry.");
    company_payload["Size"] = trycatcherror(sn_company_get_company_size, document, "Error getting company size.");
    company_payload["Employees"] = trycatcherror(sn_company_get_company_employees, document, "Error getting company employees.");

    chrome.storage.sync.get("user_email", function (user_email) {
        if (user_email.user_email === "REDACTED") {
            var url = "https://app.namii.ai/version-test/api/1.1/wf/company_salesnav";
            chrome.runtime.sendMessage({ message: "make_api_call", method: "POST", url: url, token: "Stored", payload: company_payload });
        } else {
            var url = "https://app.namii.ai/version-live/api/1.1/wf/company_salesnav";
            chrome.runtime.sendMessage({ message: "make_api_call", method: "POST", url: url, token: "Stored", payload: company_payload });
        }
    });
}

AUTOSCRAPE = false;

if (AUTOSCRAPE) {
    setTimeout(function () {
        scrape_init();
    }, 2000)
}
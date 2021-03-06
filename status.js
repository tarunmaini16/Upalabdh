var set_interval = 1800;
var tryThis;
var environment = 'prod';
var notMes = ['UNKNOWN', 'AVAILABLE', 'UNDELIVERABLE', 'UNAVAILABLE'];
var sourceOfTruth = 'https://raw.githubusercontent.com/tarunmaini16/Upalabdh/master/Util/locators.json';


function getJSON(key) {
    return JSON.parse(window.localStorage.getItem(key));
}

function setJSON(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
}

var products = getJSON('productList') || [];

function diag() {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
    }
}

function getLocators() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            tryThis = JSON.parse(this.response)
        }
    };
    if (environment == 'test') {
        sourceOfTruth = 'scratch.json'
    }
    xmlhttp.open("GET", sourceOfTruth, true);
        xmlhttp.open("GET", sourceOfTruth, true);
    xmlhttp.setRequestHeader('Cache-Control', 'no-cache');
    xmlhttp.send();
}

var i_cnt = 0;

function check_stat() {
    // if (new Date().getHours() % 8 == 0 || tryThis == undefined)
        getLocators();
    products = getJSON('productList');
    if (products != null) i_cnt = products.length
    var xhr = [], i;
    for (let i = 0; i < i_cnt; i++) {
            xhr[i] = new XMLHttpRequest();
            xhr[i].responseType = 'document';
            itemUrl = products[i].url;
            xhr[i].open("GET", itemUrl, true);
            xhr[i].onreadystatechange = function () {
                if (xhr[i].readyState === 4 && xhr[i].status === 200) {
                    for (let j = 0, j_cnt = products[i].shop; j < tryThis[j_cnt].length; j++) {
                        var actual = xhr[i].response.querySelector(Object.keys(tryThis[j_cnt][j]))
                        if (actual != null) {
                            if ( (JSON.stringify(Object.values(tryThis[j_cnt][j])).toUpperCase()).includes((actual.innerText.trim()).toUpperCase())
                                && (products[i].status != parseInt((JSON.stringify(Object.values(tryThis[j_cnt][j]))).charAt(2)))) {
                                let prev_status = products[i].status
                                products[i].status = parseInt((JSON.stringify(Object.values(tryThis[j_cnt][j]))).charAt(2))
                                var opt = {
                                    type: "basic",
                                    title: notMes[products[i].status],
                                    message: products[i].name,
                                    requireInteraction: true,
                                    iconUrl: products[i].status + ".png"
                                }
                                chrome.notifications.create('Status' + products[i].id, opt, diag)
                                setJSON('productList', products);
                                break;
                            }
                        }
                    }
                }
            };
            xhr[i].send();
    }
    setTimeout(function () {
        if (i_cnt > 0 || getJSON('productList') != null) {
            check_stat();
        } else {
            console.log('No product in the list');
            check_stat();
        }
    }, set_interval * 1000);
};
setTimeout(check_stat, 5 * 1000);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.text == "listEdited") {
        check_stat()
    }
});

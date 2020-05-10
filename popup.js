var products = [];
var esites = {amazon: 3, bigbasket: 5, flipkart: 3} //this part is index of url from where to fetch product name
var getCurrentUrl;
var product_name;
var allshops;

function setJSON(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
}

function getJSON(key) {
    return JSON.parse(window.localStorage.getItem(key));
}

function product_del(id) {
    let del_elem = document.getElementById("prod_list_" + id);
    del_elem.classList.add("ptodel");

    let product_id = 0;
    // search product
    for (let i = 0, i_cnt = products.length; i < i_cnt; i++) {
        if (products[i].id == id) {
            product_id = i;
            break;
        }
    }

    setTimeout(function () {
        if (window.confirm('Do you want delete this product?')) {
            del_elem.remove();
            console.log(products);
            products.splice(product_id, 1);
            console.log(products);
            setJSON('productList', products);
        } else del_elem.classList.remove("ptodel");
    }, 80);

}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.text == "cs") {
        console.log("Popup says it was opened.");
        products.forEach(prod =>
            product_list_insert(prod, false)
        );
    }
});

function product_list_insert(prod, feature) {
    let class_ins = '';
    if (feature) {
        // remove all features products
        document.querySelectorAll('.pitem').forEach(function (e) {
            e.classList.remove('pfeature');
        });
        class_ins = 'pfeature';
    }

    let prod_name = prod.name
    // let target_elem = document.getElementById(shop_label[prod.shop] + "_list");
    let target_elem = document.getElementById(prod.shop + "_list");

    try {
        target_elem.insertAdjacentHTML("beforeend", '<div id="prod_list_' +
            prod.id + '" class="pitem ' + class_ins + '"><img src="' + prod.status + '.png"><div class="pname">' + prod_name +
            ' </div><div id="dprod_' + prod.id + '" class="pdel"><img src="bin.png"></div></div>');
    } catch (e) {
        alert("Seems like we are not on the correct site")
    }


    var button = document.getElementById('dprod_' + prod.id);
    button.onclick = function () {
        product_del(prod.id)
    };

}

function get_max_id() {
    let max_id = 0;
    for (let i = 0, i_cnt = products.length; i < i_cnt; i++) {
        if (products[i].id > max_id) max_id = products[i].id;
    }

    return max_id;
}

function product_add() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        getCurrentUrl = tabs[0].url;
        var productNameToArray = getCurrentUrl.split('/')

        for (let i = 0, i_cnt = products.length; i < i_cnt; i++) {
            if (products[i].url == getCurrentUrl) {
                alert('This product is already added');
                return;
            }
        }
        for (domain in esites) {
            if (productNameToArray[2].includes(domain)) {
                var shop_id = domain
                // console.log(esites[shop_id])  //work
                // console.log(esites[domain])  //work
                var getIndex = esites[shop_id]
                product_name = productNameToArray[getIndex]
            }
        }
        let new_prod = {shop: shop_id, name: product_name, id: (get_max_id() + 1), status: 0, url: getCurrentUrl}

        products.push(new_prod)
        // chrome.runtime.sendMessage({text: "item added"});
        product_list_insert(new_prod, true);
        setJSON('productList', products);
    });
}

function diag() {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
    }
}

document.addEventListener('DOMContentLoaded', function product_list_init() {
    document.getElementById('add_product').addEventListener("click", product_add);

    products = getJSON('productList') || [];
    products.forEach(prod =>
        product_list_insert(prod, false)
    );
});
// window.onload = product_list_init();

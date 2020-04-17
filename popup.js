function func1(plusNewItem=' c') {
	document.getElementById("amazon_list").textContent =  plusNewItem;

}
// window.onload=func1;
var listOfUrl = [];
function getCurrentUrl(){
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
		var gctu = tabs[0].url;
		var productNameToArray = gctu.split('/')
		var esites = {a: 3, b: 5, f: 3, g: 4}
		for (domain in esites){
			if(productNameToArray[2].includes(domain)) {
				document.getElementById("AddedUrl").innerHTML = '<br>Added to ' + domain  + '<h3 style="color:#1c22ff;background-color:#faff11">' + productNameToArray[esites[domain]];
				// func1(productNameToArray[esites[domain]])
			}
		}
		console.log('gctu-->>' + gctu);
		console.log('urlSize-->>' + listOfUrl.push(gctu));
		console.log('listOfUrl-->>' + listOfUrl);
		localStorage["listOfUrl"] = listOfUrl;
		document.getElementById("Amazon1").innerHTML = 'Added to ';
	});
}
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("getCurrentUrl").addEventListener("click", getCurrentUrl);
});

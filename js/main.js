window.onload = function() {
	var headerBack = document.getElementById('header-back');
	var headerBackFake = document.getElementById('header-back-fake');

	headerBackFake.style.width = headerBack.offsetWidth + 'px';
	headerBackFake.style.height = headerBack.offsetHeight + 'px';
	headerBack.style.display = 'none';

	document.getElementById('page-form-origin-input').onfocus = enterSuggestMode;
	document.getElementById('page-form-dest-input').onfocus = enterSuggestMode;
	document.getElementById('page-form-via-form-station-input').onfocus = enterSuggestMode;

	document.getElementById('page-form-via-drop').onclick = expandVia;
	document.getElementById('page-form-now-now-input').onclick = disableTimeSelection;
	document.getElementById('page-form-now-depart-input').onclick = enableTimeSelection;
	document.getElementById('page-form-now-arrive-input').onclick = enableTimeSelection;

	document.getElementById('page-suggest-search-station-input').oninput = suggestPlaces;

	initTime();
};

var suggestTarget = null;

function enterSuggestMode(e) {
	if (suggestTarget != null) {
		return;
	}

	suggestTarget = e.target;

	document.getElementById('header-back-fake').style.display = 'none';
	document.getElementById('header-back').onclick = exitSuggestMode;
	document.getElementById('header-back').style.display = 'flex';

	document.getElementById('page-form').style.display = 'none';
	document.getElementById('page-suggest-search-station-input').placeholder = suggestTarget.placeholder;
	document.getElementById('page-suggest').style.display = 'flex';
	document.getElementById('page-suggest-search-station-input').focus();
}

function exitSuggestMode() {
	suggestTarget = null;

	document.getElementById('header-back').onclick = null;
	document.getElementById('header-back').style.display = 'none';
	document.getElementById('header-back-fake').style.display = 'flex';

	document.getElementById('page-suggest-search-station-input').placeholder = '';
	document.getElementById('page-suggest-search-station-input').value = '';
	document.getElementById('page-suggest').style.display = 'none';
	document.getElementById('page-form').style.display = 'flex';
}

var suggestRequest = null;

function suggestPlaces() {
	if (suggestRequest != null) {
		suggestRequest.abort();
		suggestRequest = null;
	}

	searchstring = document.getElementById('page-suggest-search-station-input').value;

	if (searchstring == '') {
		document.getElementById('page-suggest-list').innerHTML = '';
		return;
	}

	var url = 'trafiklab-api/place-lookup.php?searchstring=' + encodeURIComponent(searchstring);

	if (suggestTarget.id != 'page-form-via-form-station-input') {
		url += '&stationsonly=False';
	}

	var xmlhttp = new XMLHttpRequest();

	suggestRequest = xmlhttp;

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var suggestList = document.getElementById('page-suggest-list');

			suggestList.innerHTML = '';

			var response = JSON.parse(xmlhttp.responseText);

			if (response.StatusCode != 0) {
				suggestList.innerHTML = '<li class="card">' +
				                          '<span class="suggest-list-elem">'
				                             response.Message + ' (' + response.StatusCode + ')' +
				                          '</span>'
				                        '</li>';
			} else {
				var sites = response.ResponseData;

				for (i in sites) {
					suggestList.innerHTML += '<li class="card">' +
					                           '<span class="suggest-list-elem"' +
					                                 'name="' + sites[i].Name + '" ' +
					                                 'type="' + sites[i].Type + '" ' +
					                                 'siteid="' + sites[i].SiteId + '" ' +
					                                 'x="' + sites[i].X + '" ' +
					                                 'y="' + sites[i].Y + '" ' +
					                                 'onclick="selectPlace(this);">' +
					                             '<p>' + sites[i].Name + '</p>' +
					                             '<p>' + sites[i].Type + '</p>' +
					                           '</span>'
					                         '</li>';
				}
			}

			suggestRequest = null;
		}
	};

	xmlhttp.open('GET', url, true);
	xmlhttp.send();
}

function selectPlace(place) {
	suggestTarget.value = place.getAttribute('name');
	exitSuggestMode();
}

function expandVia() {
	document.getElementById('page-form-via-drop-arrow').innerHTML = '∧';
	document.getElementById('page-form-via-drop').onclick = collapseVia;
	document.getElementById('page-form-via-form').style.display = 'flex';
}

function collapseVia() {
	document.getElementById('page-form-via-drop-arrow').innerHTML = '∨';
	document.getElementById('page-form-via-drop').onclick = expandVia;
	document.getElementById('page-form-via-form').style.display = 'none';
}

function disableTimeSelection() {
	document.getElementById('page-form-date-input').disabled = true;
	document.getElementById('page-form-time-input').disabled = true;
}

function enableTimeSelection() {
	document.getElementById('page-form-date-input').disabled = false;
	document.getElementById('page-form-time-input').disabled = false;
}

function initTime() {
	var now = new Date();

	var year = now.getFullYear().toString();
	var month = twoDigitString((now.getMonth() + 1).toString());
	var day = twoDigitString(now.getDate().toString());

	var date = year + '-' + month + '-' + day;

	var hour = twoDigitString(now.getHours().toString());
	var minute = twoDigitString(now.getMinutes().toString());

	var time = hour + ':' + minute;

	document.getElementById('page-form-date-input').value = date;
	document.getElementById('page-form-time-input').value = time;
}

function twoDigitString(str) {
	if (str.length == 1) {
		return '0' + str;
	}

	return str;
}

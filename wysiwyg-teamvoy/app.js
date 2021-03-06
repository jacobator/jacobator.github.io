var controlsConfig, controlsList = [], inputArea = document.getElementById("input-area");

resetControlsConfig();
setControlsList();
inputArea.focus();

inputArea.ondragenter = function(e) {
	inputArea.className = "dragging";
};

inputArea.ondragleave = function(e) {
	inputArea.className = "";
};

inputArea.onpaste = function(e) {
	e.preventDefault();
	var item = e.clipboardData.items[e.clipboardData.items.length - 1];
	if (item.type.match(/image.*/)) {
		var file = item.getAsFile();
		insertImageFile(file);
	}
	else if (item.type.match(/text.*/)) {
		item.getAsString(function(data) {
			//document.execCommand("insertHTML", false, data); //по завданню зрозумів що HTML треба вставляти просто текстом
			document.execCommand("insertText", false, data);
		});
	}
};

inputArea.ondrop = function(e) {
	e.preventDefault();
	inputArea.focus();
	inputArea.className = "";
	var file = e.dataTransfer.files[0];
	if (!file || !file.type.match(/image.*/)) return;
	insertImageFile(file);
};

inputArea.onmouseup = function() {
	resetControlsConfig();
	updateControls();
};
inputArea.onkeyup = function() {
	resetControlsConfig();
	updateControls();
};

function applyEditing(param, cmd, val) {
	document.execCommand(cmd, false, val);
	setControlsParam(param, val);
	if (param === "UL") {
		controlsConfig.OL = false;
	}
	if (param === "OL") {
		controlsConfig.UL = false;
	}
	applyControlsConfig();
	inputArea.focus();
}

function insertImageURL() {
	var imgUrl = prompt('Enter a URL:\n(Or just drop an image from your PC to the editor area)', 'http://');
	if ((imgUrl != null) && (imgUrl != "")) {
		document.execCommand("insertImage", false, imgUrl);
	}
}

function insertImageFile(file) {
	var reader = new FileReader();
	reader.onload = function(e) {
		document.execCommand("insertImage", false, e.target.result);
	};
	reader.readAsDataURL(file);
}

function setControlsList() {
	var controls = document.getElementById("controls").childNodes;
	for (var i = 0; i < controls.length; i++) {
		if (controls[i].nodeType !== 3) {
			controlsList.push(controls[i]);
		}
	}
}

function resetControlsConfig() {
	controlsConfig = {
		B: false,
		I: false,
		U: false,
		STRIKE: false,
		COLOR: "#000000",
		SIZE: 3,
		UL: false,
		OL: false
	};
}

function updateControls() {
	var cursorNode = document.getSelection().anchorNode;
	//if (cursorNode.id === "input-area") {
	//	return;
	//}
	updateControlsConfig(cursorNode);
	applyControlsConfig();
}

function updateControlsConfig(node) {
	var parent = node.parentNode;
	if (parent.nodeName !== "DIV") {
		if (parent.nodeName === "FONT") {
			var name = parent.size ? "SIZE" : "COLOR";
			setControlsParam(name, parent[name.toLowerCase()]);
		}
		else if (parent.nodeName !== "LI") {
			setControlsParam(parent.nodeName);
		}
		updateControlsConfig(parent);
	}
}

function setControlsParam(param, val) {
	controlsConfig[param] = val || !controlsConfig[param];
}

function applyControlsConfig() {
	controlsList.forEach(function(control) {
		if (control.nodeName === "SELECT") {
			control.selectedIndex = controlsConfig[control.id] - 1;
		}
		else if (control.nodeName === "INPUT") {
			control.value = controlsConfig[control.id];
		}
		else {
			control.className = controlsConfig[control.id] ? "btn-active" : "";
		}
	});
}

function sendData() {
	localStorage.setItem("postData", inputArea.innerHTML);
	window.location.href = "post.html";
}
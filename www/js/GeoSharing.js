var info = new Object();
function onDeviceReady() {
  console.log("onDeviceReady called");
  // console.log("DEBUG: onDeviceReady called");
  try {
	  console.log("Calling checkConnection from onDeviceReady");
	  checkConnection();
  } catch (error) {
    console.log("Failed during initalisation");
    for (var x in error) {
      console.log("  " + x + " ->" + error[x]);
    }
  }
}

function checkConnection() {
	console.log("DEBG: checkConnection started");
	var conn = navigator.connection || navigator.network.connection;
	var connectionType;
	var reschedule = true;
    switch (conn.type) {
    	case Connection.WIFI:
    	case Connection.ETHERNET:
    		connectionType = "WiFi";
    	break;
    	case Connection.CELL_2G:
    	case Connection.CELL_3G:
    	case Connection.CELL_4G:
    		connectionType = "Mobile";
    	break;
    	default:
      connectionType = "None";
      reschedule = false;
  }
    console.log("there is no internt = "+connectionType);
    deviceInfo(reschedule,connectionType);
    
}


function deviceInfo(reschedule,connectionType) {
	console.log("DEBG: Loading deviceInfo");
	info.devicePlatform = device.platform;
	info.deviceUuid = device.uuid;
	console.log(reschedule+"///////,///////"+connectionType);
	if (reschedule === true) {
		console.log("there is internet = "+connectionType);
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}
	if (reschedule === false) {
		console.log("there is no internt = "+connectionType);
		info.latitude = 0;
		info.longitude = 0;
		info.Timestamp = 0;
	}
	
	function onSuccess(position) {
		console.log("onSuccess function loaded to get geolocation of the applicaion");
		info.latitude = position.coords.latitude;
		info.longitude = position.coords.longitude;
		info.Timestamp = new Date(position.timestamp);
		console.log("User device information is = " +JSON.stringify(info));
	}
	
	function onError(error) {
		console.log("onError function loaded faild to get geolocation of the applicaion");
	    console.log('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
	    console.log("Time to call setUserInterface form onError function");
	}
	
}


function captureSuccess(mediaFiles) {
	console.log("DEBG: Loading captureSuccess");
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        uploadFile(mediaFiles[i]);
    }
}

// Called if something bad happens.
//
function captureError(error) {
	console.log("DEBG: Loading captureError");
    var msg = 'An error occurred during capture: ' + error.code;
    navigator.notification.alert(msg, null, 'Uh oh!');
}

// A button will call this function
//
function captureImage() {
	console.log("DEBG: Loading captureImage");
    // Launch device camera application,
    // allowing user to capture up to 2 images
	info.describ = $("#home_pg #discrib_ph").val();
	info.hanshtag = $("#home_pg #hanshtag_ph").val();
	console.log("d"+info.describ);
	if(info.describ.length === 0) {
		navigator.notification.vibrate(2500);
		navigator.notification.alert("Please enter photo description", function() {},
		"Invalid Description", "OK");
		$("#discrib_ph").css("border", "2px dotted red");
		return;
	}
	if(info.hanshtag.length === 0) {
		info.hanshtag = "";
	}
	
    navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 2});
}

// Upload files to server
function uploadFile(mediaFile) {
	console.log("DEBG: Loading uploadFile");
    var ft = new FileTransfer(),
        path = mediaFile.fullPath,
        name = mediaFile.name;

    ft.upload(path,
        "http://my.domain.com/upload.php",
        function(result) {
            console.log('Upload success: ' + result.responseCode);
            console.log(result.bytesSent + ' bytes sent');
        },
        function(error) {
            console.log('Error uploading file ' + path + ': ' + error.code);
        },
        { fileName: name });
}

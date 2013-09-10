var user = new Object();
function onDeviceReady() {
  console.log("onDeviceReady called");
  // console.log("DEBUG: onDeviceReady called");
  try {
	  console.log("test "+device.platform);
	  loadOrCreateDatabase();
  } catch (error) {
    console.log("Failed during initalisation");
    for (var x in error) {
      console.log("  " + x + " ->" + error[x]);
    }
  }
}

function checkConnection() {
	console.log("checking connnection type and if internet is there");
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
    //TODO add a function to check the user internet conection, after every 2 min setTimeout
    console.log("there is no internt = "+connectionType);
    console.log("Calling addingValuesToUser");
    addingValuesToUser(reschedule,connectionType);
}
function addingValuesToUser(reachable,connectionType) {
	console.log("addingValuesToUser(reachable,connectionType) started");
	user.DevicePlatform = device.platform;
	user.DeviceUuid = device.uuid;
	user.DeviceVersion = device.version;
	if (reachable === true) {
		console.log("there is internet = "+connectionType);
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}
	if (reachable === false) {
		console.log("there is no internt = "+connectionType);
		user.latitude = 0;
		user.longitude = 0;
		user.Timestamp = 0;		
		setUserInterface();
	}
	function onSuccess(position) {
		console.log("onSuccess function loaded to get geolocation of the applicaion");
		user.latitude = position.coords.latitude;
		user.longitude = position.coords.longitude;
		user.Timestamp = new Date(position.timestamp);
		console.log("User device information is = " +JSON.stringify(user));
		console.log("Time to call setUserInterface form onSuccess function");
	    console.log("Calling loadDatabase from onSuccess checkConnection()");
	    loadscreen();
	}
	function onError(error) {
		console.log("onError function loaded faild to get geolocation of the applicaion");
	    console.log('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
	    console.log("Time to call setUserInterface form onError function");
	    console.log("Calling loadDatabase from check connection error");
	    loadscreen();
	}
}
function loadscreen(){
	console.log("DEBG: loadscreen");
	$("#home_pg #Login_btn").on("click", function() {
		console.log("user click login button");
		user.Email = $("#home_pg #login_email").val();
		user.Password = $("#home_pg #login_password").val();
		$("#login_email").css("border", "");
	    $("#login_password").css("border", "");
	    if(user.Email.length<3) {
	        navigator.notification.vibrate(2500);
	        navigator.notification.alert('Please enter your Child Name', function() {},
	            "Invalid Name", "OK");
	        $("#login_email").css("border", "2px dotted red");
	        return;
	    }
	    if(user.Password.length<3) {
	        navigator.notification.vibrate(2500);
	        navigator.notification.alert('Please enter your Child Date of Birth', function() {},
	            "Invalid Date of Birth", "OK");
	        $("#login_password").css("border", "2px dotted red");
	        return;
	    }
	    checklogin();
	});
	$("#home_pg #requesNew_btn").on("click", function() {
		console.log("user click login button");
    	$.mobile.changePage( "#newAccount_pg", {
    		transition: "none",
    		reverse: false,
    		changeHash: false
    	});
	});	
}

function checklogin(){
	console.log("DEBG: checklogin is loadding");
    $.mobile.changePage( "#upload_pg", {
		transition: "none",
		reverse: false,
		changeHash: false
	});
    $("#latitude").val(user.latitude);
    $("#longitude").val(user.longitude);
    upload();
}
function upload(){
	console.log("DEBG: Loading upload");
	$('form').submit(function() {
		console.log("DEBG: user click submit button in the page");
	   var username = user.Email;
	   var password = user.Password;
	   var uploadinfo = $(this).serialize();
	   console.log('datea: '+uploadinfo);
	   $.ajax({
		    type: 'POST', 
		    data: uploadinfo, 
		    url: 'http://184.169.176.223:8080/GeoSharing/mobile/secure/submission', 
		    dataType: 'json', 
		    beforeSend: function(xhr) {
		     xhr.setRequestHeader("Authorization", "Basic " + $.base64.encode(username + ":" + password)); 
		    }, 
		    success: function(d) {
		     console.log('successful!'); 
		    }, 
		    error: function(xhr, ajaxOptions, errorThrown) {
		     console.log('failed!');
		    }
	   });
	});
}








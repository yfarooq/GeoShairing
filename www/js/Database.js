var db = openDatabase("GeoSharing", "1", "GeoSharing", 10000);
function loadOrCreateDatabase() {
	console.log("DEBG: Loading create database");
    db.transaction(function(tx) {
    	console.log("====================================");
        console.log("creating tables started");
        tx.executeSql('CREATE TABLE IF NOT EXISTS userloginInfo (UUID unique,username,password,temPass)');
        console.log("tables created");
        console.log("====================================");
        checkConnection();
    });
}
  function RunSQL(str) {
	  log("DEBUG: loading Delte");
	    db.transaction(function(tx) {
	        tx.executeSql(str);
	    }, function() {
	    	console.log("Error: " + str);
	    });
	  
  }
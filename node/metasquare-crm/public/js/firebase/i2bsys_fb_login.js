/**
 * 
 */
var isSuccessful = false;
var logoutDiv = document.getElementById("logout_div");
var loginDiv = document.getElementById("login_div");

var config = {
	apiKey: "key",
	authDomain: "metasquare-crm.firebaseio.com",
	databaseURL: "https://metasquare-crm.firebaseio.com",
	projectId:"metasquare-crm"
};
firebase.initializeApp(config);
var firestore = firebase.firestore();



/**
 * This METHOD is NOT working as expected. To be fixed to segregate the config
 * @returns
 */
function initFirebase() {
	var config = {
		apiKey: "AIzaSyCmRB7vloloJImFPKknNsjhonkXUgBgY-k",
		authDomain: "metasquare-crm.firebaseio.com",
		databaseURL: "https://metasquare-crm.firebaseio.com",
		projectId:"metasquare-crm"
	};
	firebase.initializeApp(config);
	var firestore = firebase.firestore();
}

/**
 *	
 */
function login() {
	var logoutDiv = document.getElementById("logout_div");
	var loginDiv = document.getElementById("login_div");
	var firebase_email = document.getElementById("firebase_email").value;
	//console.log("firebase_email:"+firebase_email);
	var password = document.getElementById("password").value;
	//console.log("password:"+password);
	firebase.auth().signInWithEmailAndPassword(firebase_email, password).then(function (user) {
		console.log("Login Successfull");
		//alert("Login Successfull");
		loginDiv.style.display = "none";
		logoutDiv.style.display = "block";
		//document.forms["addEnquiry"].reset();
		isSuccessful=true;
		createMenuAndRelevantHtmlTable();
		//window.location.href="Main.jsp"
	}).catch(function (error) {
		alert("Login failed");
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode === 'auth/wrong-password') {
			alert('Wrong password.');
		} else {
			alert(errorMessage);
		}
		console.log(error);
	});
}

function logout() {
	var logoutDiv = document.getElementById("logout_div");
	var loginDiv = document.getElementById("login_div");
	firebase.auth().signOut().then(function () {
		// Sign-out successful
		loginDiv.style.display = "block";
		logoutDiv.style.display = "none";
		location.reload();
		isSuccessful=false;
	}, function (error) {
		// An error happened
		alert("You MAY have logged out already. Please check")
	});
}
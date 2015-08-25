var Terminal = require('term.js/src/term');
var Firebase = require('firebase');

var fbRef = new Firebase('https://fireterm.firebaseio.com/rpi');
var stdin = fbRef.child('stdin');
var stdout = fbRef.child('stdout');

fbRef.onAuth(function(authData) {
  if (!authData) {
	fbRef.authWithOAuthRedirect('google', function(error) {
	  if (error) {
		alert('login failed!');
		console.log("Login Failed!", error);
	  }
	});
  }
});

var term = new Terminal({
	cols: 80,
	rows: 24,
	useStyle: true,
	screenKeys: true,
	cursorBlink: false
});
term.on('data', function(data) {
	stdin.push(data);
});
term.on('title', function(title) {
	document.title = title;
});
term.open(document.body);
term.write('\x1b[31mWelcome to FireTerm!!\x1b[m\r\n');

stdout.on('child_added', function(snap) {
	term.write(snap.val());
});

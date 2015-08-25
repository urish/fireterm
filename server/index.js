var pty = require('pty.js');
var Firebase = require('firebase');
var fs = require('fs');
var FirebaseTokenGenerator = require("firebase-token-generator");

var tokenGenerator = new FirebaseTokenGenerator(process.env.FIREBASE_SECRET);
var token = tokenGenerator.createToken({uid: "admin"}, {admin:true, expires: new Date().getTime()/1000 + 100000000});

var fbRef = new Firebase('https://fireterm.firebaseio.com/rpi');
fbRef.authWithCustomToken(token, function(error) {
	if (error) {
		console.log('Fireterm auth failed:', error);
		process.exit(1);
	} else {
		console.log('Fireterm Ready!');
	}
});
var stdin = fbRef.child('stdin');
var stdout = fbRef.child('stdout');

var term = pty.fork(process.env.SHELL || 'sh', [], {
  name: fs.existsSync('/usr/share/terminfo/x/xterm-256color')
    ? 'xterm-256color'
    : 'xterm',
  cols: 80,
  rows: 24,
  cwd: process.env.HOME
});

term.on('data', function(data) {
	stdout.push(data);
});
stdin.set(null);
stdin.on('child_added', function(snap) {
	term.write(snap.val());
});

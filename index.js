var Evernote = require('evernote').Evernote;
var config = require('./config');

var client = new Evernote.Client({
  token: config.develop.token,
  sandbox: true
});

var userStore = client.getUserStore();

userStore.checkVersion(
  'Evernote EDAMTest (Node.js)',
  Evernote.EDAM_VERSION_MAJOR,
  Evernote.EDAM_VERSION_MINOR,
  function (err, versionOk) {
    console.log("Is my Evernote API version up to date? " + versionOk);
    if (!versionOk) {
      process.exit(1);
    }
  }
);


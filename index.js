var Evernote = require('evernote').Evernote;
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var mime = require('mime');
var config = require('./config');

var client = new Evernote.Client({
  token: config.develop.token,
  sandbox: true
});

var userStore = client.getUserStore();

function versionCheck () {
  userStore.checkVersion(
    'Evernote EDAMTest (Node.js)',
    Evernote.EDAM_VERSION_MAJOR,
    Evernote.EDAM_VERSION_MINOR,
    function (err, versionOk) {
      if (err) {
        console.log(err);
      }
      console.log("Is my Evernote API version up to date? " + versionOk);
      if (!versionOk) {
        process.exit(1);
      }
    }
  );
}

var noteStore = client.getNoteStore();

function createNote (options) {
  var title = options.title || 'Crete from Evernote API';
  var body = options.body || null;
  var file = options.file || null;
  var note = new Evernote.Note();

  note.title = title;

  note.content = '<?xml version="1.0" encoding="UTF-8"?>';
  note.content += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
  note.content += '<en-note>' + body;

  if (file) {
    _addResouce(file);
  }

  note.content += '</en-note>';

  noteStore.createNote(note, function(err, createdNote) {
    if (err) {
      console.log(err);
    }
    console.log("Creating a new note in the default notebook");
    console.log("Successfully created a new note with GUID: " + createdNote.guid);
  });

  function _addResouce (file) {
    var attachment = fs.readFileSync(file);
    var hash = attachment.toString('base64');

    var data = new Evernote.Data();
    data.size = attachment.length;
    data.bodyHash = hash;
    data.body = attachment;

    var resource = new Evernote.Resource();
    resource.mime = mime.lookup(file);
    resource.data = data;

    note.resources = [resource];

    var md5 = crypto.createHash('md5');
    md5.update(attachment);
    hashHex = md5.digest('hex');

    note.content += '<br/><en-media type="' + resource.mime + '" hash="' + hashHex + '"/>';
  }
}

var options = {
  title: 'Test note',
  body: 'Here is the Evernote logo',
  file: 'enlogo.png'
}

createNote(options);

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
var noteStore = client.getNoteStore();

module.exports = {

  versionCheck: function () {
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
  },

  createNote: function (options, callback) {
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
      callback(createdNote);
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

      var attributes = new Evernote.ResourceAttributes();
      attributes.fileName = path.basename(file);
      attributes.timestamp = new Date().getTime();

      resource.attributes = attributes;
      note.resources = [resource];

      var md5 = crypto.createHash('md5');
      md5.update(attachment);
      hashHex = md5.digest('hex');

      note.content += '<br/><en-media type="' + resource.mime + '" hash="' + hashHex + '"/>';
    }
  },

  deleteNote: function (options, callback) {
    var title = options.title;
    var guid = options.guid;
    var note = new Evernote.Note();

    note.title = title;
    note.guid = guid;
    note.active = false;

    noteStore.updateNote(note, function (err, deletedNote) {
      callback(deletedNote);
    });
  }
}

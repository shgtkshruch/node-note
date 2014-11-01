var Evernote = require('evernote').Evernote;
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var async = require('async');
var mime = require('mime');

function evernote (config) {
  var options = {}

  if (process.env.NODE_ENV === 'production') {
    options.token = config.production.token;
    options.sandbox = false;
  } else {
    options.token = config.develop.token;
    options.sandbox = true;
  }

  var client = new Evernote.Client({
    token: options.token,
    sandbox: options.sandbox
  });

  this.userStore = client.getUserStore();
  this.noteStore = client.getNoteStore();
}

evernote.prototype.versionCheck = function () {
  this.userStore.checkVersion(
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

evernote.prototype.createNote = function (options, callback) {
  var title = options.title || 'Crete from Evernote API';
  var body = options.body || '';
  var file = options.file || '';
  var note = new Evernote.Note();

  note.title = title;

  note.content = '<?xml version="1.0" encoding="UTF-8"?>';
  note.content += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
  note.content += '<en-note>' + body;

  if (file) {
    _addResouce(file);
  }

  note.content += '</en-note>';

  this.noteStore.createNote(note, function(err, createdNote) {
    if (err) {
      throw err;
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
}

evernote.prototype.deleteNote = function (options, callback) {
  var title = options.title || '';
  var _this = this;

  async.series([
    function (cb) {
      if (!options.guid) {
        _this.getNoteMetadata({word: title}, function (metadataList) {
          cb(null, metadataList[0].guid);
        });
      } else {
        cb(null, options.guid);
      }
    }
  ], function (err, guid) {
    if (err) {
      throw new Error("Can not read property 'guid'.");
    }
    var note = new Evernote.Note();

    note.title = title;
    note.guid = guid[0];
    note.active = false;

    _this.noteStore.updateNote(note, function (err, deletedNote) {
      if (err) {
        throw err;
      }
      callback(deletedNote);
    });
  });
}

evernote.prototype.getNoteMetadata = function (options, callback) {
  var filter = new Evernote.NoteFilter();

  if (!options.word) {
    throw new Error("Can not read property 'word' of undefined.");
  }

  filter.words = options.word || '';

  var maxNotes = options.maxNotes || 1

  var spec = new Evernote.NotesMetadataResultSpec();

  for (var p in spec) {
    if (p.indexOf('include') !== -1) {
      spec[p] = true;
    }
  }

  this.noteStore.findNotesMetadata(filter, 0, maxNotes, spec, function (err, noteMetadata) {
    if (err) {
      throw err;
    }
    callback(noteMetadata.notes);
  });
}

evernote.prototype.getNote = function (options, callback) {
  if (!options.guid) {
    throw new Error("Can not read property 'guid' of undefined.");
  }

  var guid = options.guid;
  var withContent = options.withContent || null;
  var withRecource = options.withRecource || null;

  this.noteStore.getNote(guid, withContent, withRecource, false, false, function (err, note) {
    if (err) {
      throw err;
    }
    callback(note);
  });
}

module.exports = evernote;

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
  this._getTitleGuid(options, function (title, guid) {
    var note = new Evernote.Note();

    note.title = title;
    note.guid = guid;
    note.active = false;

    this.noteStore.updateNote(note, function (err, deletedNote) {
      if (err) {
        throw err;
      }
      callback(deletedNote);
    });
  }.bind(this));
}

evernote.prototype.getNoteMetadata = function (options, callback) {
  if (!options.word) {
    throw new Error("Can not read property 'word' of undefined.");
  }

  var filter = new Evernote.NoteFilter();

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

evernote.prototype.restoreNote = function (options, callback) {
  this._getTitleGuid(options, function (title, guid) {
    var note = new Evernote.Note();

    note.title = title;
    note.guid = guid;
    note.active = true;

    this.noteStore.updateNote(note, function(err, restoredNote) {
      if (err) {
        throw err;
      }
      callback(restoredNote);
    });
  }.bind(this));
}

evernote.prototype.expungeNote = function (guid, callback) {
  this.noteStore.expungeNote(guid, function (err, result) {
    if (err) {
      throw err;
    };
    callback(result);
  });
}

evernote.prototype.createNotebook = function (options, callback) {
  if (!options.name) {
    throw new Error("You should set 'name' property.");
  }

  notebook = new Evernote.Notebook;
  notebook.name = options.name;

  this.noteStore.createNotebook(notebook, function (err, createdNotebook) {
    if (err) {
      throw err;
    }
    callback(createdNotebook);
  });
}

evernote.prototype.expungeNotebook = function (guid, callback) {
  if (!guid) {
    throw new Error("You should set 'guid' property.");
  }

  this.noteStore.expungeNotebook(guid, function (err, seqNum) {
    if (err) {
      throw err;
    }
    callback(seqNum);
  });
}

evernote.prototype.getNotebook = function (options, callback) {
  var matchNotebook;

  this.noteStore.listNotebooks(function (err, notebookList) {
    if (err) {
      throw err;
    }
    notebookList.forEach(function (notebook) {
      if (notebook.name.indexOf(options.name) !== -1) {
        matchNotebook = notebook;
      }
    });
    callback(matchNotebook);
  });
}

evernote.prototype._getTitleGuid = function (options, callback) {
  if (!options.title && !options.guid) {
    throw new Error("You shold set 'title' or 'guid'.");
  }

  async.series([
    function (cb) {
      if (!options.title) {
        this.getNote({guid: options.guid}, function (note) {
          cb(null, note.title);
        });
      } else {
        cb(null, options.title);
      }
    }.bind(this),
    function (cb) {
      if (!options.guid) {
        this.getNoteMetadata({word: options.title}, function (metadataList) {
          cb(null, metadataList[0].guid);
        });
      } else {
        cb(null, options.guid);
      }
    }.bind(this)
  ], function (err, results) {
    if (err) {
      throw err;
    }
    callback(results[0], results[1]);
  });
}

module.exports = evernote;

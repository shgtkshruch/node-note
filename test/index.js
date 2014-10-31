var config = require('../config.json');
var nodeNote = require('../index');
var path = require('path');
var assert = require('assert');

describe('Evernote', function () {
  var evernote;
  var createdNote;

  before(function () {
    evernote = new nodeNote(config);
  });

  describe('createNote', function () {
    var options = {
      title: new Date().getTime(),
      body: 'Here is the Evernote logo',
      file: './test/test.png'
    }

    before(function (done) {
      evernote.createNote(options, function (note) {
        createdNote = note;
        done();
      });
    });

    it('should create new note.', function () {
      assert.deepEqual(createdNote.title, options.title);
      assert.deepEqual(createdNote.resources[0].attributes.fileName, path.basename(options.file));
    });
  });

  describe('deleteNote', function () {
    var deletedNote;

    before(function (done) {
      var options = {
        title: createdNote.title,
        guid: createdNote.guid
      }

      evernote.deleteNote(options, function (note) {
        deletedNote = note;
        done();
      });
    });

    it('should delete note.', function () {
      assert.deepEqual(createdNote.guid, deletedNote.guid);
      assert.deepEqual(deletedNote.active, false);
    });
  });

});

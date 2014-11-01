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

  describe('getNoteMetadata', function () {
    var matchNote;

    before(function (done) {
      var options = {
        word: 'Evernote'
      }
      evernote.getNoteMetadata(options, function (metadataList) {
        matchNote = metadataList[0];
        done();
      });
    });

    it('should return note metadata that match the word.', function () {
      assert.deepEqual(matchNote.guid, createdNote.guid);
      assert.deepEqual(matchNote.title, createdNote.title);
      assert.deepEqual(matchNote.created, createdNote.created);
      assert.deepEqual(matchNote.notebookGuid, createdNote.notebookGuid);
    });
  });

  describe('deleteNote', function () {
    var deletedNote;

    before(function (done) {
      var options = {
        title: createdNote.title
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

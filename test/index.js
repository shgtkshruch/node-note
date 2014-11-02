var config = require('../config.json');
var nodeNote = require('../index');
var path = require('path');
var assert = require('assert');

describe('Evernote', function () {
  var evernote;
  var createdNotebook;
  var createdNote;

  before(function () {
    evernote = new nodeNote(config);
  });

  describe('Create & Read method', function () {

    var options = {
      title: 'new note',
      body: 'Here is the Evernote logo',
      file: './test/test.png'
    }

    describe('createNotebook', function () {
      var options = {
        name: 'new note book'
      }

      before(function (done) {
        evernote.createNotebook(options, function (notebook) {
          createdNotebook = notebook;
          done();
        });
      });

      it('should create new notebook.', function () {
        assert.deepEqual(createdNotebook.name, options.name);
      });
    });

    describe('createNote', function () {
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

      it('should resulturn note metadata that match the word.', function () {
        assert.deepEqual(matchNote.guid, createdNote.guid);
        assert.deepEqual(matchNote.title, options.title);
        assert.deepEqual(matchNote.created, createdNote.created);
        assert.deepEqual(matchNote.notebookGuid, createdNote.notebookGuid);
      });
    });

    describe('getNote', function () {
      var getNote;

      before(function (done) {
        var options = {
          guid: createdNote.guid,
          withContent: true
        }

        evernote.getNote(options, function (note) {
          getNote = note;
          done();
        });
      });

      it('should resulturn note data.', function () {
        assert.deepEqual(getNote.guid, createdNote.guid);
        assert.deepEqual(getNote.title, options.title);
        assert.deepEqual(getNote.content.indexOf(options.body) > -1, true);
      });
    });
  });

  describe('Update & Delete method', function () {
    var deletedNote;

    describe('deleteNote with title', function () {
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
        assert.deepEqual(createdNote.title, deletedNote.title);
        assert.deepEqual(deletedNote.active, false);
      });
    });

    describe('restoreNote', function () {
      var restoredNote;

      before(function (done) {
        var options = {
          guid: deletedNote.guid
        }

        evernote.restoreNote(options, function (note) {
          restoredNote = note;
          done();
        });
      });

      it('shold restore inactive note.', function () {
        assert.deepEqual(restoredNote.active, true);
        assert.deepEqual(restoredNote.guid, deletedNote.guid);
        assert.deepEqual(restoredNote.title, deletedNote.title);
      });
    });

    describe('deleteNote with guid', function () {
      before(function (done) {
        var options = {
          guid: createdNote.guid
        }

        evernote.deleteNote(options, function (note) {
          deletedNote = note;
          done();
        });
      });

      it('should delete note.', function () {
        assert.deepEqual(createdNote.guid, deletedNote.guid);
        assert.deepEqual(createdNote.title, deletedNote.title);
        assert.deepEqual(deletedNote.active, false);
      });
    });

    describe('expungeNote', function () {
      var result;

      before(function (done) {
        evernote.expungeNote(createdNote.guid, function (seqNum) {
          result = seqNum;
          done();
        });
      });

      it('shold expunge note.', function () {
        assert.deepEqual(typeof result, 'number');
      });
    });

    describe('expungeNotebook', function () {
      var result;

      before(function (done) {
        evernote.expungeNotebook(createdNotebook.guid, function (seqNum) {
          result = seqNum;
          done();
        });
      });

      it('should delete notebook.', function () {
        assert.deepEqual(typeof result, 'number');
      });
    });
  });

});

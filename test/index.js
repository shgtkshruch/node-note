var config = require('../config.json');
var nodeNote = require('../index');
var path = require('path');
var assert = require('assert');

describe('Evernote', function () {
  var evernote,
      createdNotebook,
      createdNote,
      notebookOptions = {
        name: 'new note book'
      },
      noteOptions = {
        title: 'new note',
        body: 'Here is the Evernote logo',
        file: './test/test.png',
        notebookName: notebookOptions.name
      };

  before(function () {
    evernote = new nodeNote(config);
  });

  describe('Create', function () {
    describe('notebook', function () {
      before(function (done) {
        evernote.createNotebook(notebookOptions, function (notebook) {
          createdNotebook = notebook;
          done();
        });
      });

      it('should create new notebook.', function () {
        assert.deepEqual(createdNotebook.name, notebookOptions.name);
      });
    });

    describe('note', function () {
      before(function (done) {
        evernote.createNote(noteOptions, function (note) {
          createdNote = note;
          done();
        });
      });

      it('should create new note.', function () {
        assert.deepEqual(createdNote.title, noteOptions.title);
        assert.deepEqual(createdNote.notebookGuid, createdNotebook.guid);
        assert.deepEqual(createdNote.resources[0].attributes.fileName, path.basename(noteOptions.file));
      });
    });
  });

  describe('Read', function () {
    describe('getNoteMetadata', function () {
      var matchNote;

      before(function (done) {
        var options = {
          word: 'Evernote'
        };

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

    describe('getNote', function () {
      var getNote;

      before(function (done) {
        var options = {
          guid: createdNote.guid,
          withContent: true
        };

        evernote.getNote(options, function (note) {
          getNote = note;
          done();
        });
      });

      it('should return note data.', function () {
        assert.deepEqual(getNote.guid, createdNote.guid);
        assert.deepEqual(getNote.title, createdNote.title);
        assert.deepEqual(getNote.content.indexOf(noteOptions.body) > -1, true);
      });
    });

    describe('getNotebook', function () {
      var notebook;

      before(function (done) {
        evernote.getNotebook(notebookOptions, function (matchNotebook) {
          notebook = matchNotebook;
          done();
        });
      });

      it('should return notebook that matched the name.', function () {
        assert.deepEqual(notebook.guid, createdNotebook.guid);
        assert.deepEqual(notebook.name, createdNotebook.name);
      });
    });
  });

  describe('Delete', function () {
    describe('note with title', function () {
      var deletedNote;

      before(function (done) {
        var options = {
          title: createdNote.title
        };

        evernote.deleteNote(options, function (note) {
          deletedNote = note;
          done();
        });
      });

      it('should delete note.', function () {
        assert.deepEqual(deletedNote.guid, createdNote.guid);
        assert.deepEqual(deletedNote.title, createdNote.title);
        assert.deepEqual(deletedNote.active, false);
      });
    });

    describe('restoreNote', function () {
      var restoredNote;

      before(function (done) {
        var options = {
          guid: createdNote.guid
        };

        evernote.restoreNote(options, function (note) {
          restoredNote = note;
          done();
        });
      });

      it('shold restore inactive note.', function () {
        assert.deepEqual(restoredNote.active, true);
        assert.deepEqual(restoredNote.guid, createdNote.guid);
        assert.deepEqual(restoredNote.title, createdNote.title);
      });
    });

    describe('deleteNote with guid', function () {
      var deletedNote;

      before(function (done) {
        var options = {
          guid: createdNote.guid
        };

        evernote.deleteNote(options, function (note) {
          deletedNote = note;
          done();
        });
      });

      it('should delete note.', function () {
        assert.deepEqual(deletedNote.guid, createdNote.guid);
        assert.deepEqual(deletedNote.title, createdNote.title);
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

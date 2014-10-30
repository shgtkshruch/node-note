var Evernote = require('../index');
var assert = require('assert');

describe('Evernote', function () {
  var createdNote;
  var options = {
    title: new Date().getTime(),
    body: 'Here is the Evernote logo',
    file: './test/test.png'
  }

  describe('createNote', function () {
    before(function (done) {
      Evernote.createNote(options, function (note) {
        createdNote = note;
        done();
      });
    });

    it('should create new note.', function () {
      assert.deepEqual(createdNote.title, options.title);
    });
  });

  describe('deleteNote', function () {
    var deletedNote;

    before(function (done) {
      var options = {
        title: createdNote.title,
        guid: createdNote.guid
      }

      Evernote.deleteNote(options, function (note) {
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

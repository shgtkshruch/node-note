var Evernote = require('../index');
var assert = require('assert');

describe('Evernote', function () {
  var createdNote;
  var options = {
    title: 'Test note',
    body: 'Here is the Evernote logo',
    file: './test/enlogo.png'
  }

  describe('create new note', function () {
    before(function (done) {
      Evernote.createNote(options, function (note) {
        createdNote = note;
        done();
      });
    });

    it('createaNote should create note', function () {
      assert.deepEqual(createdNote.title, options.title);
    });
  });

  describe('delete note', function () {
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

    it('should delete note', function () {
      assert.deepEqual(createdNote.guid, deletedNote.guid);
      assert.deepEqual(deletedNote.active, false);
    });
  });

});

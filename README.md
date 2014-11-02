[![Build Status](https://travis-ci.org/shgtkshruch/node-note.svg?branch=master)](https://travis-ci.org/shgtkshruch/node-note)

# node-note

Evernote wrapper.

## Install

```sh
$ npm install --save node-note
```

## Configuration

You need [Evernote API Key](https://dev.evernote.com/) and `config.json`, like this.

```json
{
  "develop": {
    "token": "DEVELOPER_TOKEN_FOR_SANDBOX"
  },
  "production": {
    "token": "DEVELOPER_TOKEN_FOR_PRODUCTION"
  }
}
```

## Usage

```js
var config = require('./config.json');
var nodeNote = require('node-note');

var evernote = new nodeNote(config);

// Create new note
var options = {
  title: 'New Note created by node-note',
  body: 'Here is the Evernote logo',
  file: './ev-logo.png'
}

evernote.createNote(options, function (createdNote) {
  console.log('Create new note ' + createdNote.guid);
});

// Delete note
var options = {
  title: 'note title'
}

evernote.deleteNote(options, function (deletedNote) {
  console.log('Delete note ' + deletedNote.guid);
});
```

If development environment, run command like this.  
```sh
$ node index.js
```

If production environment, run command like this.  
```sh
$ NODE_ENV=production node index.js
```

## API

### evernote.createNote(options, callback)

Create new note.

#### options

##### title

*Required*  
Type: `String`

Note title.

##### body

Type: `String`

Note body.

##### file

Type: `String`

Attachement file.

#### callback(createdNote)

Type: `Function`

##### createdNote

Type: `Object`

Return created note. Represents a [single note](https://dev.evernote.com/doc/reference/Types.html#Struct_Note) in the user's account.

### evernote.deleteNote(options, callback)

Delete note.

#### options

Required `title` or `guid` field.  
If you can set both field, set both field.

##### title

Type: `String`

Note title.

##### guid

Type: `String`

Note guid.

#### callback(deletedNote)

Type: `Function`

#### deletedNote

Type: `Object`

Return deleted note. Represents a [single note](https://dev.evernote.com/doc/reference/Types.html#Struct_Note) in the user's account.

### evernote.getNoteMetadata(options, callback)

Get note metadata.

#### options

##### word

Type: `String`

If present, a search query string that will filter the set of notes to be returned.

##### maxNotes

Type: `Number`

The mximum notes to return in this query.

#### callback(noteMetadataList)

Type: `Function`

##### noteMetadataList

Type: `List`

Return the [metadata list](https://dev.evernote.com/doc/reference/NoteStore.html#Struct_NotesMetadataList) of notes that match the criteria.

### evernote.getNote(options, callback)

Get note.

#### options

##### guid

*Required*  
Type: `String`

The GUID of the note to be retrieved.

##### withContent

Type: `Bool`

If true, the note will include the ENML contents of its 'content' field.

##### withRecouce

Type: `Bool`

If true, any Resource elements in this Note will include the binary contents of their 'data' field's body.

#### callback(note)

Type: `Function`

##### note

Type: `Object`

Returns the current state of the [note](https://dev.evernote.com/doc/reference/Types.html#Struct_Note) in the service.

### evenote.restoreNote(options, callback)

Restore note in trash.

#### options

Required `title` or `guid` field.  
If you can set both field, set both field.

##### title

Type: `String`

note's title.

##### guid

Type: `String`

note's guid.

#### callback(restoredNote)

Type: `Function`

##### restoredNote

Type: `Object`

Return restored [note](https://dev.evernote.com/doc/reference/Types.html#Struct_Note).

### evernote.expungeNote(guid, callback)

Permanently removes a Note, and all of its Resources, from the service.

#### options

##### guid

*Required*  
Type: `String`

Note guid.

#### callback(sequenceNum)

Type: `Function`

##### sequenceNum

Type: `Number`

The Update Sequence Number for this change within the account.

### evernote.createNotebook(options, callback)

Create new notebook.

#### options

##### name

*Required*  
Type: `String`

Notebook name.

#### callback(createdNotebook)

Type: `Function`

##### createdNotebook

Type: `Object`

### evernote.expungeNotebook(guid, callback)

Permanently removes a Notebook from the service.

#### guid

Type: `String`

Note guid.

#### callback(sequenceNum)

Type: `Function`

##### sequencenum

Type: `Number`

The Update Sequence Number for this change within the account.

## LICENSE

MIT

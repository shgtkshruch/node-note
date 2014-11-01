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

You should set title or guid.

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

## LICENCE

MIT

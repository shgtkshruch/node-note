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
  title: 'note title',
  guid: 'note guid'
}

evernote.deleteNote(options, function (deletedNote) {
  console.log('Delete note ' + deletedNote.guid);
});
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

Return created note. Represents a [single note](https://dev.evernote.com/doc/reference/Types.html#Struct_Note) in the user's account.

### evernote.deleteNote(options, callback)

Delete note.

#### options

##### title

*Required*  
Type: `String`

Note title.

##### guid

*Required*  
Type: `String`

Note guid.

#### callback(deletedNote)

Type: `Function`

Return deleted note. Represents a [single note](https://dev.evernote.com/doc/reference/Types.html#Struct_Note) in the user's account.

## LICENCE

MIT

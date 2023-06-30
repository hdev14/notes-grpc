const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const notesDefinition = protoLoader.loadSync(path.resolve(__dirname, '../proto/notes.proto'));
const notesObject = grpc.loadPackageDefinition(notesDefinition);

const notes = [
  { id: 1, title: 'Note 1', description: 'Content 1' },
  { id: 2, title: 'Note 2', description: 'Content 2' }
];

function List(_, callback) {
  return callback(null, { notes });
}

function Find({ request }, callback) {
  const note = notes.find((note) => note.id === request.id);
  if (!note) {
    return callback(new Error('Not found'));
  }

  return callback(null, { note });
}

const server = new grpc.Server();
server.addService(notesObject.NoteService.service, { List, Find });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log('Server is runnning...');
});


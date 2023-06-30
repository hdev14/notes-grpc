const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { promisify } = require('util')

const notesDefinition = protoLoader.loadSync(path.resolve(__dirname, '../proto/notes.proto'));
const notesObject = grpc.loadPackageDefinition(notesDefinition);

const noteServiceStub = new notesObject.NoteService('localhost:50051', grpc.credentials.createInsecure());

const listAsync = promisify(noteServiceStub.list.bind(noteServiceStub));
const findAsync = promisify(noteServiceStub.find.bind(noteServiceStub));

listAsync({})
  .then((response) => console.log('listAsync', response))
  .catch((error) => console.error('listAsync', error));

findAsync({ id: 1 })
  .then((response) => console.log('findAsync', response))
  .catch((error) => console.error('findAsync', error));

noteServiceStub.list({}, (error, response) => {
  if (error) throw error;
  console.log(response);
});

noteServiceStub.find({ id: 2 }, (error, response) => {
  if (error) throw error;
  console.log(response);
});
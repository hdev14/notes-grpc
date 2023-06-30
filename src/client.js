const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { promisify } = require('util')

const notesDefinition = protoLoader.loadSync(path.resolve(__dirname, '../proto/notes.proto'));
const notesObject = grpc.loadPackageDefinition(notesDefinition);

const noteServiceStub = new notesObject.NoteService('localhost:50051', grpc.credentials.createInsecure());

noteServiceStub.list({}, (error, response) => {
  if (error) throw error;
  console.log(response);
});

noteServiceStub.find({ id: 2 }, (error, response) => {
  if (error) throw error;
  console.log(response);
});
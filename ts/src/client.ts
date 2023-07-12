import { Metadata, credentials } from "@grpc/grpc-js";
import { readFileSync } from "fs";
import { resolve } from 'path';
import { NotesClient } from "../proto/notes_grpc_pb";
import { NoteFindRequest, Void } from "../proto/notes_pb";

const rootCert = readFileSync(resolve(__dirname, '../../ca-cert.pem'));

const channelCreds = credentials.createSsl(rootCert);
// const metaCallback = (_: any, callback: Function) => {
//   const meta = new Metadata();
//   meta.add('custom-header', 'test');
//   callback(null, meta);
// }

// const callCreds = credentials.createFromMetadataGenerator(metaCallback);
// const combCreds = credentials.combineChannelCredentials(channelCreds, callCreds);

const notesClient = new NotesClient('0.0.0.0:50052', channelCreds);

notesClient.list(new Void(), (err, response) => {
  if (err) {
    return console.error(err);
  }
  console.log(response.toObject());
});

const metadata = new Metadata();
metadata.add('Authorization', 'test');

notesClient.find(new NoteFindRequest().setId(2), metadata, {}, (err, response) => {
  if (err) {
    return console.error(err);
  }

  console.log(response.toObject());
});
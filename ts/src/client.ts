import { ChannelCredentials } from "@grpc/grpc-js";
import { NotesClient } from "../proto/notes_grpc_pb";
import { NoteFindRequest, Void } from "../proto/notes_pb";

const notesClient = new NotesClient('0.0.0.0:50052', ChannelCredentials.createInsecure());

notesClient.list(new Void(), (err, response) => {
  if (err) {
    return console.error(err);
  }
  console.log(response.toObject());
});

notesClient.find(new NoteFindRequest().setId(2), (err, response) => {
  if (err) {
    return console.error(err);
  }

  console.log(response.toObject());
});
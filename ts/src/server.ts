import { Server, ServerCredentials, ServerUnaryCall, UntypedHandleCall, sendUnaryData } from '@grpc/grpc-js';
import { INotesServer, NotesService } from '../proto/notes_grpc_pb';
import { Note, NoteFindRequest, NoteFindResponse, NoteListResponse, Void } from '../proto/notes_pb';

const notes: Note.AsObject[] = [
  { id: 1, title: 'Note 1', description: 'Content 1' },
  { id: 2, title: 'Note 2', description: 'Content 2' }
];

class NotesServer implements INotesServer {

  [name: string]: UntypedHandleCall;

  list(_: ServerUnaryCall<Void, NoteListResponse>, callback: sendUnaryData<NoteListResponse>) {
    const response = new NoteListResponse();

    notes.forEach(({ id, title, description }) => {
      const note = new Note()
        .setId(id)
        .setTitle(title)
        .setDescription(description);

      response.addNotes(note);
    });

    return callback(null, response);
  }

  find(call: ServerUnaryCall<NoteFindRequest, NoteFindResponse>, callback: sendUnaryData<NoteFindResponse>) {
    const id = call.request.getId();

    const foundNote = notes.find((note) => note.id === id);

    if (!foundNote) {
      return callback(new Error('Not found'));
    }

    const response = new NoteFindResponse();
    response.setNote(
      new Note()
        .setId(foundNote.id)
        .setTitle(foundNote.title)
        .setDescription(foundNote.description)
    );

    return callback(null, response);
  }
}

const server = new Server();
server.addService(NotesService, new NotesServer());

server.bindAsync('0.0.0.0:50052', ServerCredentials.createInsecure(), (err, port) => {
  if (err) throw err;
  console.log(`Server is running on port ${port}`);
  server.start();
});

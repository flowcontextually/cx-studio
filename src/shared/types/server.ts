// Define the shape of the data that comes back from the server
// for data-producing commands. We don't know all keys, so
// we use a Record type.
export type DataPayload = Record<string, unknown>;

export interface CommandResultPayload {
  result: DataPayload | DataPayload[] | string | null;
  new_session_state: {
    connections: { alias: string; source: string }[];
    variables: { name: string; type: string; preview: string }[];
  };
}

export interface ErrorPayload {
  error: string;
}

export type InboundPayload =
  | CommandResultPayload
  | ErrorPayload
  | DataPayload
  | DataPayload[];

export interface InboundMessage {
  type:
    | "COMMAND_STARTED"
    | "RESULT_SUCCESS"
    | "RESULT_ERROR"
    | "SESSION_LOADED"
    | "FATAL_ERROR";
  command_id: string;
  payload: InboundPayload;
}

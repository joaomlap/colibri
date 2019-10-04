enum Response { Ok, Error };

export interface IEventStore {
  // createEventStream: () => Event[];
  writeToEventStream: (event: Event, streamId: string) => Response;
  // publishEvent: (event: Event) => Response;
  // getEventStream: () => Event[];
  // more
}
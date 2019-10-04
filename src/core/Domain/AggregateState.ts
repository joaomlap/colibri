export default interface AggregateState {
  handlers: Function[];
  registerHandler: () => void;
  unregisterHandler: () => void;
  apply: (event: Event) => AggregateState;
  getState: () => AggregateState;
}
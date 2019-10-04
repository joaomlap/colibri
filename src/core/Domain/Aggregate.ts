import Event from './Event'

export default abstract class Aggregate {
  id: string;

  events: Event[] = [];
}
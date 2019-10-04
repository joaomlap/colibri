import IEvent from 'core/Domain/event';
import uuid from 'uuid';

export class CreateTask implements IEvent {
  id: string = uuid();
  dateTime: Date = new Date();

  
}
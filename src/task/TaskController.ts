import Express from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import IController from 'core/Application/IController';
import uuid from 'uuid';
// import CommandHandlers from './CommandHandlers'

// type Task = {
//   id: string;
//   type: string;
// }

export default class TaskController implements IController {
  public path = '/tasks';
  public router = Express.Router();

  constructor() {
    this.initialiseHandlers()
  }

  async createTask(oix: any) {
    const eventId = uuid.v4();

    console.log('oix', oix)

    const options = {
      url: 'http://127.0.0.1:2113/streams/tasks',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'ES-EventType': 'createTask',
        'ES-EventId': eventId,
      },
      auth: {
        username: 'admin',
        password: 'changeit'
      },
      data: JSON.stringify([{
        eventId,
        eventType: 'taskCreated',
        data: {
          something: 'oix'
        }
      }])
    } as AxiosRequestConfig;

    try {
      const response = await axios.request(options);
      console.log(response)
    } catch (err) {
      console.error(err)
    }
  }

  initialiseHandlers() {
    this.router.post(`${this.path}/createTask`, this.createTask);
  }
}
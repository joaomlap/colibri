export class TaskDetails {
  id: string;
  label: string;
  options: object;
}

export enum TaskStatus {
  New,
  Cancelled,
  Assigned,
  Completed
}

export enum TaskUrgency {
  Routine,
  Urgent,
  Emergency
}

export class Task {
  id: string;
  type: TaskType;
  status: TaskStatus;
  urgency: TaskUrgency;
}

export class TaskType {
  id: string;
  version: number;
}

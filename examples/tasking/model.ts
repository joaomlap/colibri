export type PropsSchema = {
  id: string;
  type: string;
  label: string;
  props?: Record<string, unknown>;
};

export type ComponentOptions = {
  label: string;
  type: string;
  icon: string;
  propsSchema: PropsSchema[];
};

export type Module = {
  id: string;
  name: string;
  label: string;
  components: PropsSchema[];
};

export type TaskStep = {
  id: string;
  type: string;
  details: Module;
};

export type Task = {
  id: string;
  steps: TaskStep[];
};

import { TaskStatus } from './TaskStatus';

export type Task = {
    id: number;
    name: string;
    description: string;
    priority: number;
    createdAt: string;
    completeAt: string;
    duration: any;
    status: TaskStatus;
};

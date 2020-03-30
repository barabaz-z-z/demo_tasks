import React from 'react';
import moment from 'moment';
import {
    TableContainer,
    Paper,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Table,
    Toolbar,
    Fab,
    Typography
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import AddIcon from '@material-ui/icons/Add';
import { TableTaskRow } from './table-task-row';
import { Task } from '../models/Task';
import { TaskStatus } from '../models/TaskStatus';
import { AddTaskModal } from './add-task-modal';

const prepareTask = (task: Task) => {
    const now = moment();
    const completeAtMoment = moment(task.completeAt);
    const duration = moment.duration(completeAtMoment.diff(now), 'seconds');

    task.duration = moment.duration(0);

    if (duration.seconds() > 0) {
        task.duration = duration;
    }

    return task;
};

export class TaskTable extends React.Component {
    state = {
        isOpened: false,
        tasks: {
            activeAndCompleted: new Array<Task>(),
            removed: new Array<Task>()
        }
    };

    async componentDidMount() {
        const response = await fetch('http://localhost:5000/api/tasks');
        const tasks: Array<Task> = await response.json();
        const removedTasks = tasks.filter(t => t.status === TaskStatus.Removed);
        const restTasks = tasks.filter(t => !removedTasks.includes(t));

        this.setState({
            tasks: {
                activeAndCompleted: restTasks.map(prepareTask),
                removed: removedTasks
            }
        });

        // TODO: get an intervalId to remove the interval when countdown reaches 0
        // TODO: do not apply an interval for big duration when a lot of days etc

        // setInterval(() => {
        //     const {
        //         tasks: { activeAndCompleted, removed }
        //     } = this.state;

        //     this.setState({
        //         tasks: {
        //             removed,
        //             activeAndCompleted: activeAndCompleted.map(t => {
        //                 if (t.duration.seconds() > 0) {
        //                     t.duration = t.duration.subtract(1, 'second');
        //                 } else {
        //                     t.duration = moment.duration(0);
        //                 }

        //                 return t;
        //             })
        //         }
        //     });
        // }, 1000);
    }

    hasTasks() {
        const {
            tasks: { activeAndCompleted }
        } = this.state;

        return activeAndCompleted.length !== 0;
    }

    onTaskRemoving = (task: Task) => {
        const {
            tasks: { activeAndCompleted, removed }
        } = this.state;

        this.setState({
            tasks: {
                activeAndCompleted: activeAndCompleted.filter(
                    t => t.id !== task.id
                ),
                removed: [...removed, task]
            }
        });
    };

    openAddTaskModal = () => {
        this.setState({
            isOpened: true
        });
    };
    handleAddTask = (task: Task) => {
        const { tasks } = this.state;
        const preparedTask = prepareTask(task);

        const maxId = tasks.activeAndCompleted.sort(
            (t1, t2) => t2.id - t1.id
        )[0].id;
        const newId = maxId + 1;

        this.setState({
            isOpened: false,
            tasks: {
                ...tasks,
                activeAndCompleted: [
                    { ...preparedTask, id: newId },
                    ...tasks.activeAndCompleted
                ]
            }
        });

        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preparedTask)
        };

        fetch('http://localhost:5000/api/tasks', options)
            .then(async response => {
                const { tasks } = this.state;
                const data = await response.json();

                const preparedTasks = tasks.activeAndCompleted.map(t =>
                    t.id === newId
                        ? {
                              ...t,
                              id: data.id,
                              status: TaskStatus.Active
                          }
                        : t
                );

                this.setState({
                    isOpened: false,
                    tasks: {
                        ...tasks,
                        activeAndCompleted: [...preparedTasks]
                    }
                });
            })
            .catch(error => {
                const { tasks } = this.state;

                console.log(error);

                this.setState({
                    ...this.state,
                    tasks: {
                        ...tasks,
                        activeAndCompleted: tasks.activeAndCompleted.filter(
                            t => t.id !== newId
                        )
                    }
                });
            });
    };
    handleCancel = () => {
        this.setState({
            isOpened: false
        });
    };

    render() {
        const {
            isOpened,
            tasks: { activeAndCompleted }
        } = this.state;

        return (
            <>
                <Toolbar>
                    <Typography variant="h6">Tasks</Typography>
                    <Fab
                        color="primary"
                        size="small"
                        onClick={this.openAddTaskModal}
                    >
                        <AddIcon />
                    </Fab>
                </Toolbar>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="center">Priority</TableCell>
                                <TableCell align="center">Added</TableCell>
                                <TableCell align="center">
                                    Time to complete
                                </TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!this.hasTasks() &&
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6}>
                                            <Skeleton variant="text" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            {this.hasTasks() &&
                                activeAndCompleted.map(t => {
                                    return (
                                        <TableTaskRow
                                            key={t.id}
                                            task={t}
                                            remove={this.onTaskRemoving}
                                        ></TableTaskRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <AddTaskModal
                    isOpened={isOpened}
                    addHandler={this.handleAddTask}
                    cancelHandler={this.handleCancel}
                />
            </>
        );
    }
}

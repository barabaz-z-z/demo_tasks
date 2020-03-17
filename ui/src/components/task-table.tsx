import React from 'react';
import moment from 'moment';
import {
    TableContainer,
    Paper,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Table
} from '@material-ui/core';
import { TableTaskRow } from './table-task-row';
import { Task } from '../models/Task';
import { TaskStatus } from '../models/TaskStatus';
import Skeleton from '@material-ui/lab/Skeleton';

export class TaskTable extends React.Component {
    state = {
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
                activeAndCompleted: restTasks.map(t => {
                    const now = moment();
                    const completeAtMoment = moment(t.completeAt);
                    const duration = moment.duration(
                        now.diff(completeAtMoment),
                        's'
                    );

                    t.duration = moment.duration(0);

                    if (duration.seconds() > 0) {
                        t.duration = duration;
                    }

                    return t;
                }),
                removed: removedTasks
            }
        });

        // TODO: get an intervalId to remove the interval when countdown reaches 0
        // TODO: do not apply an interval for big duration when a lot of days etc

        setInterval(() => {
            const {
                tasks: { activeAndCompleted, removed }
            } = this.state;

            this.setState({
                tasks: {
                    removed,
                    activeAndCompleted: activeAndCompleted.map(t => {
                        if (t.duration.seconds() > 0) {
                            t.duration = t.duration.subtract(1, 'second');
                        } else {
                            t.duration = moment.duration(0);
                        }

                        return t;
                    })
                }
            });
        }, 1000);
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

    render() {
        const {
            tasks: { activeAndCompleted }
        } = this.state;

        return (
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
                                        key={t.name}
                                        task={t}
                                        remove={this.onTaskRemoving}
                                    ></TableTaskRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

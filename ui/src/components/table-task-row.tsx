import React from 'react';
import moment from 'moment';
import {
    TableRow,
    TableCell,
    Chip,
    Button,
    CircularProgress
} from '@material-ui/core';
import { Task } from '../models/Task';
import { TaskStatus } from '../models/TaskStatus';

type Props = {
    task: Task;
    remove: (task: Task) => any;
};

type State = {
    task: Task;
};

export class TableTaskRow extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            task: props.task
        };
    }

    completeTask = () => {
        const { task } = this.state;
        this.setState({ task: { ...task, status: TaskStatus.Completed } });
    };

    removeTask = () => {
        const { task } = this.state;
        this.setState({ task: { ...task, status: TaskStatus.Removed } });

        this.props.remove(task);
    };

    render() {
        const { task } = this.state;

        return (
            <TableRow>
                <TableCell component="th" scope="row">
                    {task.name}
                </TableCell>
                <TableCell align="center">{task.priority}</TableCell>
                <TableCell align="center">
                    {moment(task.createdAt).format('L')}
                </TableCell>
                <TableCell align="center">
                    {`${task.duration.hours()}:${task.duration.minutes()}:${task.duration.seconds()}`}
                </TableCell>
                <TableCell align="center">
                    <Chip label={TaskStatus[task.status]} />
                </TableCell>
                <TableCell align="center">
                    {task.status === TaskStatus.Adding && <CircularProgress />}
                    {task.status === TaskStatus.Completed && (
                        <Button onClick={this.removeTask}>Remove</Button>
                    )}
                    {task.status === TaskStatus.Active && (
                        <Button onClick={this.completeTask}>Complete</Button>
                    )}
                </TableCell>
            </TableRow>
        );
    }
}

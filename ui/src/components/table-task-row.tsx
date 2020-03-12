import React from 'react';
import moment from 'moment';
import { TableRow, TableCell, Chip, Button } from '@material-ui/core';
import { Task } from '../models/Task';

type Props = {
    task: Task
};

type State = {
    task: Task
}

export class TableTaskRow extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            task: props.task
        };
    }

    completeTask = () => {
        const { task } = this.state;
        this.setState({ task: { ...task, isCompleted: !task.isCompleted } });
    };

    render() {
        const { task } = this.state;
        return (
            <TableRow>
                <TableCell component="th" scope="row">{task.name}</TableCell>
                <TableCell align="center">{task.priority}</TableCell>
                <TableCell align="center">
                    {moment(task.createdAt).format('L')}
                </TableCell>
                <TableCell align="center">
                    {`${task.duration.hours()}:${task.duration.minutes()}:${task.duration.seconds()}`}
                </TableCell>
                <TableCell align="center">
                    <Chip label={task.isCompleted ? 'Completed' : 'Active'} />
                </TableCell>
                <TableCell align="center">
                    {task.isCompleted && <Button>Remove</Button>}
                    {!task.isCompleted && <Button onClick={this.completeTask}>Complete</Button>}
                </TableCell>
            </TableRow >
        );
    }
};

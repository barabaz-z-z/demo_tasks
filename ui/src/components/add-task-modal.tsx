import React, { useState, ChangeEvent } from 'react';
import { Task } from '../models/Task';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Slide,
    MenuItem
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import moment from 'moment';
import { TaskStatus } from '../models/TaskStatus';

type Props = {
    isOpened: boolean;
    addHandler: (task: Task) => void;
    cancelHandler: () => void;
};

const Transition = React.forwardRef<unknown, TransitionProps>(
    function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    }
);

const priorities = [1, 2, 3];

const initTask = () => {
    return {
        name: '',
        description: '',
        priority: 1,
        completeAt: moment().format('YYYY-MM-DDThh:mm'),
        status: TaskStatus.Adding
    };
};

export const AddTaskModal: React.FC<Props> = ({
    isOpened,
    cancelHandler,
    addHandler
}) => {
    const [task, setTask] = useState<Task>(initTask() as Task);

    const handleEnter = () => {
        setTask(initTask() as Task);
    };

    const handleAdd = () => {
        addHandler({
            ...task,
            createdAt: moment().format()
        });
    };
    const handleClose = () => {
        cancelHandler();
    };

    const onNameChanged = ({
        target: { value }
    }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTask({
            ...task,
            name: value
        });
    };

    const onDescriptionChanged = ({
        target: { value }
    }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTask({
            ...task,
            description: value
        });
    };

    const onPriorityChanged = ({
        target: { value }
    }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTask({
            ...task,
            priority: Number(value)
        });
    };

    const onTimeToCompleteChanged = ({
        target: { value }
    }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTask({
            ...task,
            completeAt: value
        });
    };

    return (
        <Dialog
            onEnter={handleEnter}
            open={isOpened}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            TransitionComponent={Transition}
        >
            <DialogTitle id="form-dialog-title">Add new task</DialogTitle>
            <DialogContent>
                <TextField
                    variant="outlined"
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    fullWidth
                    onChange={onNameChanged}
                    value={task.name}
                />
                <TextField
                    variant="outlined"
                    multiline
                    margin="dense"
                    id="description"
                    label="Descrpition"
                    fullWidth
                    rows="4"
                    onChange={onDescriptionChanged}
                    value={task.description}
                />
                <TextField
                    variant="outlined"
                    select
                    margin="dense"
                    id="priority"
                    label="Priority"
                    fullWidth
                    onChange={onPriorityChanged}
                    value={task.priority}
                >
                    {priorities.map(p => (
                        <MenuItem key={p} value={p}>
                            {p}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    type="datetime-local"
                    margin="dense"
                    id="completeTime"
                    label="Time to complete"
                    fullWidth
                    value={task.completeAt}
                    InputLabelProps={{
                        shrink: true
                    }}
                    inputProps={{
                        step: 300 // 5 min
                    }}
                    onChange={onTimeToCompleteChanged}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAdd} variant="contained" color="primary">
                    Add task
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

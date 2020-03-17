import React from 'react';
import moment from 'moment';
import './App.css';
import {
    Container,
    Table,
    Paper,
    TableContainer,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
    Toolbar,
    Fab,
    Typography
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Skeleton from '@material-ui/lab/Skeleton';
import { Task } from './models/Task';
import { TableTaskRow } from './components/table-task-row';
import { TaskStatus } from './models/TaskStatus';
import { AddTaskModal } from './components/add-task-modal';
import { TaskTable } from './components/task-table';

class App extends React.Component {
    state = {
        isOpened: false
    };

    openAddTaskModal = () => {
        this.setState({
            isOpened: true
        });
    };
    handleAddTask = (task: Task) => {
        this.setState({
            isOpened: false
        });
    };
    handleCancel = () => {
        this.setState({
            isOpened: false
        });
    };

    render() {
        const { isOpened } = this.state;

        return (
            <Container>
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
                <TaskTable />
                <AddTaskModal
                    isOpened={isOpened}
                    addHandler={this.handleAddTask}
                    cancelHandler={this.handleCancel}
                />
            </Container>
        );
    }
}

export default App;

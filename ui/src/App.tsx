import React from 'react';
import './App.css';
import { Container } from '@material-ui/core';
import { TaskTable } from './components/task-table';

class App extends React.Component {
    render() {
        return (
            <Container>
                <TaskTable />
            </Container>
        );
    }
}

export default App;

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
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Skeleton from '@material-ui/lab/Skeleton';
import { Task } from './models/Task';
import { TableTaskRow } from './components/table-task-row';

class App extends React.Component {
  state = {
    tasks: new Array<Task>()
  }

  async componentDidMount() {
    const response = await fetch('http://localhost:5000/api/tasks');
    const tasks: Array<Task> = await response.json();

    this.setState({
      ...this.state, tasks: tasks.map(t => {
        const now = moment();
        const completeAtMoment = moment(t.completeAt);
        const duration = moment.duration(now.diff(completeAtMoment), 's');

        t.duration = duration;

        return t;
      })
    });

    // TODO: get an intervalId to remove the interval when countdown reaches 0
    // TODO: do not apply an interval for big duration when a lot of days etc

    setInterval(() => {
      this.setState({
        ...this.state, tasks: tasks.map(t => {
          t.duration = t.duration.subtract(1, 'second');

          return t;
        })
      });
    }, 1000);
  }

  addTask() {
    console.log('add');
  }

  hasTasks() {
    return this.state.tasks && this.state.tasks.length !== 0;
  }

  render() {
    const { tasks } = this.state;

    return (
      <Container>
        <Toolbar>
          <Typography variant="h6" id="tableTitle">
            Tasks
          </Typography>
          <Fab color="primary" size="small" onClick={this.addTask}>
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
                <TableCell align="center">Time to complete</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!this.hasTasks() &&
                [...Array(5)].map((_, i) =>
                  (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <Skeleton variant="text" />
                      </TableCell>
                    </TableRow>)
                )
              }
              {this.hasTasks() && tasks.map(t => {
                return (<TableTaskRow key={t.name} task={t}></TableTaskRow>);
              })}
            </TableBody>
          </Table>
        </TableContainer >
      </Container >
    );
  }
}

export default App;

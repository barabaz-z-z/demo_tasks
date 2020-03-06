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
  Button,
  Chip,
  Toolbar,
  Fab,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Skeleton from '@material-ui/lab/Skeleton';

type Task = {
  id: number,
  name: string,
  priority: number,
  createdAt: string,
  completeAt: string,
  duration: any,
  isCompleted: boolean
};

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
        const duration = moment.duration(completeAtMoment.diff(now), 'milliseconds');

        t.duration = duration;

        return t;
      })
    });
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
                [...Array(5)].map((v, i) =>
                  (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <Skeleton variant="text" />
                      </TableCell>
                    </TableRow>)
                )
              }
              {this.hasTasks() && tasks.map(t => {
                return (
                  <TableRow key={t.name}>
                    <TableCell component="th" scope="row">{t.name}</TableCell>
                    <TableCell align="center">{t.priority}</TableCell>
                    <TableCell align="center">
                      {moment(t.createdAt).format('L')}
                    </TableCell>
                    <TableCell align="center">
                      {moment(t.completeAt).format('L')}{t.duration.humanize(true)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={t.isCompleted ? 'Completed' : 'Active'} />
                    </TableCell>
                    <TableCell align="center">
                      {t.isCompleted && <Button>Remove</Button>}
                      {!t.isCompleted && <Button>Complete</Button>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer >
      </Container >
    );
  }
}

export default App;

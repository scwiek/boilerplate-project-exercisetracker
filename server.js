const express = require('express');
const app = express();
const cors = require('cors');
const {
  v4: uuidv4
} = require('uuid');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({
  extended: true
}));

var users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/users', (req, res) => {
  let username = req.body.username;
  let uuid = uuidv4();
  let user = {
    username: username,
    _id: uuid,
    log: []
  };
  users.push(user);
  res.json((({
    username,
    _id
  }) => ({
    username,
    _id
  }))(user));
});

app.get('/api/users', (req, res) => {
  let userList = [];
  users.forEach(x => userList.push({
    username: x.username,
    _id: x._id
  }));
  res.json(userList);
});

app.post('/api/users/:_id/exercises', (req, res) => {
  let uid = req.params._id;
  let selectedUser = users.find(({
    _id
  }) => _id === uid);
  let selectedUserName = selectedUser.username;
  let desc = req.body.description;
  let dur = req.body.duration;
  let inputDate = req.body.date;
  let fullDate = new Date(inputDate);
  if (fullDate.toString() === "Invalid Date") {
    // In order to pass tests, must set to current date if GMT is already the next day.
    let todayDate = new Date();
    fullDate = todayDate;
  }
  let exercise = {
    description: desc,
    duration: Number(dur),
    date: fullDate
  };
  selectedUser.log.push(exercise);
  res.json({
    username: selectedUserName,  
    description: desc,
    duration: Number(dur),
    date: fullDate.toDateString(),
     _id: uid
  });
});

app.get('/api/users/:_id/logs', (req, res) => {
  let filtLogs = [];
  let uid = req.params._id;
  let selectedUser = users.find(({
    _id
  }) => _id === uid);
  const logs = selectedUser.log;
  let fromDate = req.query.from;
  let toDate = req.query.to;
  let resLimit = req.query.limit;
  const reDate = /\d{4}-\d{2}-\d{2}/;
  // TODO: Is the filter modifying the original array?  It shouldn't be.  Maybe filtLogs is in the wrong place?
  if (fromDate) {
    const validFrom = reDate.test(fromDate);
    if (validFrom) {
      const fd = new Date(fromDate);
      let lowBound = logs.filter(x => x.date >= fd);
      lowBound.forEach(x => filtLogs.push(x));
    }
  } else {
    filtLogs = logs;
  }
  if (toDate) {
    const validTo = reDate.test(toDate);
    if (validTo) {
      const td = new Date(toDate);
      let highBound = filtLogs.filter(x => x.date <= td);
      filtLogs = highBound;
    }
  }
  filtLogs.forEach(x => {
    if (typeof x.date === "string") {
    } else {
      x.date = x.date.toDateString();
    }
  });
  if (resLimit) {
    let limitedLog = filtLogs.slice(0, resLimit);
    let retUser = {
      username: selectedUser.username,
      count: limitedLog.length,
      _id: uid,
      log: limitedLog
    };
    res.json(retUser);
  } else {
    let retUser = {
      username: selectedUser.username,
      count: filtLogs.length,
      _id: uid,
      log: filtLogs
    };
    res.json(retUser);
  }
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
const express = require('express')
const app = express()
const cors = require('cors')
const {
  v4: uuidv4
} = require('uuid');
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({
  extended: true
}));

var users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
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
  res.json((({username, _id}) => ({username, _id}))(user));
});

app.get('/api/users', (req, res) => {
  console.log(users);
  let userList = [];
  users.forEach(x => userList.push({user: x.user, _id: x._id}));
  res.json(userList);
});

app.post('/api/users/:_id/exercises', (req, res) => {
  let uid = req.params._id;
  let selectedUser = users.find( ({_id}) => _id === uid);
  let selectedUserName = selectedUser.username;
  console.log(selectedUserName);
  console.log(selectedUser);
  let desc = req.body.description;
  let dur = req.body.duration;
  let inputDate = req.body.date;
  let fullDate = new Date(inputDate).toDateString();
  if (!fullDate) {
    let todayDate = new Date();
    fullDate = todayDate.toDateString();
  }
  let exercise = {
    description: desc,
    duration: Number(dur),
    date: Date(fullDate)
  };
  selectedUser.log.push(exercise);
  console.log(selectedUser);
  // res.json({
  //   username: selectedUserName, 
  //   _id: uid,
  //   description: desc,
  //   duration: dur,
  //   date: fullDate
  // });
  res.json(selectedUser);
});

app.get('/api/users/:_id/logs', (req, res) => {
  let fromDate = req.query.from;
  let toDate = req.query.to;
  let resLimit = req.query.limit;
  console.log(resLimit);
  let uid = req.params._id;
  let selectedUser = users.find( ({_id}) => _id === uid);
  selectedUser.count = selectedUser.log.length;
  // TODO: Add options from, to
  if (resLimit) {
    retUser = {username: selectedUser.username, _id: uid, log: selectedUser.log.slice(0,resLimit)};
    res.json(retUser);
  } else {
    console.log(selectedUser);
    res.json(selectedUser);
  }
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
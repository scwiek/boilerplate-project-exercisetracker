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
    user: username,
    _id: uuid
  };
  users.push(user);
  res.json(user);
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users/:_id/exercises', (req, res) => {
  // TODO: More date formatting/validation
  let uid = req.params._id;
  let desc = req.body.description;
  let dur = req.body.duration;
  let fullDate = req.body.date;
  if (!fullDate) {
    let todayDate = new Date();
    let year = todayDate.getFullYear();
    let month = ((todayDate.getMonth() + 1).toString().length) === 1 ? '0' + (todayDate.getMonth() + 1) : (todayDate.getMonth() + 1);
    let monthDate = (todayDate.getDate().toString().length) === 1 ? '0' + todayDate.getDate() : todayDate.getDate();
    fullDate = `${year}-${month}-${monthDate}`;
  }
  res.json({
    _id: uid,
    description: desc,
    duration: dur,
    date: fullDate
  });
});

app.get('/api/users/:_id/logs', (req, res) => {

});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
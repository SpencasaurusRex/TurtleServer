const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs');
const app = express()


var runQueues = {}

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static('programs'));

app.post('/dequeueRun', function(req, res)
{
  console.log(`/dequeueRun ${req.body.id}`);
  let queue = runQueues[req.body.id];
  let response = '';
  if (queue !== undefined && queue.runs.length > 0)
  {
    let run = queue.runs.shift();
    response = `${run.program} ${run.args}`;
  }
  res.send(response);
});

app.post('/enqueueRun', function(req, res)
{
  console.log(`/enqueueRun ${req.body.id} ${req.body.program} ${req.body.args}`);
  let queue = runQueues[req.body.id];
  if (queue === undefined)
  {
    queue = runQueues[req.body.id] = {};
    queue.runs = [];
  }
  let run = {}
  run.program = req.body.program;
  run.args = req.body.args;
  queue.runs.push(run)
  res.send("ACK");
});

app.post('/writeFile', function(req,res)
{
  console.log(`/writeFile ${req.body.filename}`);
  fs.unlink('programs/' + req.body.filename, function(){
    fs.writeFile('programs/' + req.body.filename, req.body.data, 'utf8', function(){
      res.send("ACK");
    });
  });
});

app.get('/', function(req, res)
{
  res.sendFile('index.html', { root: '.' });
});
app.listen(3000);
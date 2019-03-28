var express = require('express'),
  cors = require('cors'),
  app = express(),
  port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./messages.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
  });
db.run('CREATE TABLE IF NOT EXISTS Messages(sender,text,timestamp)');

app.get('/', (req, res) => res.send('Hello 0xFF!'));

app.get('/add-message/:sender/:text', cors(corsOptions), function (req, res) {
    try {
      db.run('INSERT INTO Messages (sender,text,timestamp) VALUES (?, ?, ?)',[req.params.sender,req.params.text, new Date().toISOString()]);
      console.log('Received: ' + req.params.sender +' '+ req.params.text);
      res.sendStatus(200)
    } catch(err){
        next(err);
    };
})

app.post('/add-message', cors(corsOptions), function (req, res) {
    try {
        db.run('INSERT INTO Messages (sender,text,timestamp) VALUES (?, ?, ?)',[req.body.sender,req.body.text, new Date().toISOString()]);
        console.log('Received: ' + req.body.sender +' '+ req.body.text);
        res.sendStatus(200)
      } catch(err){
          res.sendStatus(500);
      };
})

app.get('/messages', cors(corsOptions), function(req, res){
    db.all("SELECT * FROM Messages ORDER BY timestamp DESC", function(err, rows){
        res.send(rows);
    });
});

app.listen(port);

console.log('Server running on port: ' + port);

// db.close((err) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     console.log('Close the database connection.');
//   });
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

const db  = require('./models');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Notedb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

mongoose.set('debug', true);

// A user has been created already for our activity purposes
db.User.create({ name: 'ddd' })
  .then(dbUser => {
    console.log(dbUser);
  })
  .catch(({ message }) => {
    console.log(message);
  });

// Retrieve all thoughts
app.get('/thought', (req, res) => {
  db.Thought.find({})
    .then(dbNote => {
      res.json(dbNote);
    })
    .catch(err => {
      res.json(err);
    });
});

// Retrieve all users
app.get('/user', (req, res) => {
  db.User.find({})
    .then(dbUser => {
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});

// Create a new note and associate it with user
app.post('/submit', ({ body }, res) => {
  db.Thought.create(body)
    .then(({ _id }) =>
      db.User.findOneAndUpdate({}, { $push: { notes: _id } }, { new: true })
    )
    .then(dbUser => {
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get('/populate', (req, res) => {
  db.User.find({})
    .populate({
      path: 'notes',
      select: '-__v'
    })
    .select('-__v')
    .then(dbUser => {
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get('/all', (req, res) => {
  db.Thought.find({})
    .then(dbNote => {
      res.json(dbNote);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post('/update/:id', ({ params, body }, res) => {
  db.Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
    .then(dbNote => {
      if (!dbNote) {
        res.json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbNote);
    })
    .catch(err => {
      res.json(err);
    });
});

app.delete('/delete/:id', ({ params }, res) => {
  db.Thought.findOneAndDelete({ _id: params.id })
    .then(dbNote => {
      if (!dbNote) {
        res.json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbNote);
    })
    .catch(err => {
      res.json(err);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

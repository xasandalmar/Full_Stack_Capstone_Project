const express = require('express'); 

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Form Express!');
});
 // GET route
app.get('/admin', (req, res) => {
  res.send('Hello, Admin !');
});


app.use(express.json()); // Middleware to parse JSON request bodies
// POST route
app.post('/users', (req, res) => {
  const userData = req.body;
  res.send(`User created with name: ${userData.name}`);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

// PUT route
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;
  res.send(`User ${userId} updated with name: ${updatedData.name}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },

];

app.get('/items', (req, res) => {
  res.status(200).json(items);
});

app.get('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = items.find((item) => item.id === itemId);

  if (item) {
    res.status(200).json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});


app.post(
  '/items',
  [
    body('name').notEmpty().withMessage('Name is required for a new item'),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    const newItem = {
      id: items.length + 1,
      name: name,
    };

    items.push(newItem);

    res.status(201).json(newItem);
  }
);

app.put('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const { id: updatedId, name: updatedName } = req.body;

    const index = items.findIndex((item) => item.id === itemId);

    
    if (index !== -1) {
      items[index].id = updatedId;
      items[index].name = updatedName;
  
      res.status(200).json(items[index]);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  });
  
  
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});


app.patch('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const { name: updatedName } = req.body;
  

    const index = items.findIndex((item) => item.id === itemId);

    if (index !== -1) {
      if (updatedName) {
        items[index].name = updatedName;
      }
  
      res.status(200).json(items[index]);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  });


app.delete('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
  
  
    const index = items.findIndex((item) => item.id === itemId);
  
   
    if (index !== -1) {

      items.splice(index, 1);
      res.status(200).json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  });
  
const express = require('express');
const morgan = require('morgan');

const app = express();
const playstore = require('./playstore');

app.use(morgan('dev'));

app.get('/apps', (req, res) => {
    const { sort }= req.query;
    // let apps = [];
    // playstore.map(app => console.log(app));
    if (sort) {
        if (!['app', 'rating'].includes(sort)) {
          return res
            .status(400)
            .send('Sort must be one of app or rating');
        }
      }

    // let apps = playstore.filter(app =>
    //     app 
    //         .App
    //         .toLowerCase()
    //         .includes(sort.toLowerCase())
    // );
    let results = playstore;  
    if  (sort) {
        results.sort((a, b) => {
          return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
      }
  

    res.json(results);
    
})

app.listen(8000, () => {
    console.log('server started on PORT 8000');
});
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res)=> {
  var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];

  res.render('pages/about.ejs',{drinks :drinks});
});

module.exports = router;

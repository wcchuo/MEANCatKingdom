var path = require("path");
var express = require("express");
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/cats');
var CatSchema = new mongoose.Schema({
	genetic_classification: String,
  lineage: String,
  subfamily: String,
  genus: String,
  scientific_name: String,
  name: String,
  description: String,
  photo: String,
  comment: String,
  datetime: String
})
var Cat = mongoose.model('Cat', CatSchema);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, "./static")));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.post('/add', function(req, res) {
  console.log("POST DATA", req.body);

  var cat = new Cat({
    genetic_classification: req.body.genetic_classification,
    lineage: req.body.lineage,
    subfamily: req.body.subfamily,
    genus: req.body.genus,
    scientific_name: req.body.scientific_name,
    name: req.body.name,
    description: req.body.description,
    photo: req.body.photo,
    comment: req.body.comment,
    datetime: req.body.datetime
});

cat.save(function(err) {
    if(err) {
      console.log('something went wrong');
    } else { 
      console.log('successfully added a cat!');
    }
  })
 res.redirect('/');
})

app.get('/new', function(req, res) {
 res.render('new');
})

app.get('/', function(req, res) {
  Cat.find({}, function(err, cats) {
     if(err) {
      console.log('Failed to connect to database or there is no data.');
    } else { 
      console.log('Successfully display cats!');
    }
    res.render('index', {cats : cats});
  })
})

app.get('/:id/view', function (req, res){
    Cat.findOne({_id: req.params.id}, function (err, cats) {
        res.render('view', {cats: cats});
    })
})

app.get('/:id/edit', function (req, res){
    Cat.findOne({_id: req.params.id}, function (err, cats) {
        res.render('edit', {cats: cats});
    })
})

app.post('/edit/:id', function (req, res){
    Cat.update({_id: req.params.id}, {
        genetic_classification: req.body.genetic_classification,
        lineage: req.body.lineage,
        subfamily: req.body.subfamily,
        genus: req.body.genus,
        scientific_name: req.body.scientific_name,
        name: req.body.name,
        description: req.body.description,
        photo: req.body.photo,
        comment: req.body.comment,
        datetime: req.body.datetime
      }, function (err, cats){
        res.redirect('/');
    })
})

app.get('/:id/delete', function (req, res){
  Cat.remove({_id: req.params.id}, function (err, cats){
    res.redirect('/');
  })
})

app.listen(8007, function() {
 console.log("listening on port 8007");
})
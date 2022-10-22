const express = require('express');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.engine('html', require('ejs').renderFile);

const path = `${__dirname}/views/`;
const url = "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json";

app.set('views', path);
app.set('view engine', 'ejs');

let iterator = 0;
function nextHero(){
  if(iterator == 562){
    iterator = 0;
  }
  else{
    iterator++;
  }
}

function previousHero() {
  if (iterator == 0) {
    iterator = 562;
  }
  else {
    iterator--;
  }
}

app.get("/",(req,res)=>{
  request(url, (err, response, body)=>{
    if (!err){
      const users = JSON.parse(body);
      iterator = 0;
      res.render("home", {
        id: users[iterator]["id"],
        name: users[iterator]["name"], 
        imageHeroe: users[iterator]["images"]["md"],
        fullname: users[iterator]["biography"]["fullName"] ,
        placeOfBirth: users[iterator]["biography"]["placeOfBirth"],
        aliases: users[iterator]["biography"]["aliases"],
        smallBiography : users[iterator]["work"]["occupation"],
        powerstats : users[iterator]["powerstats"],
        appearance : users[iterator]["appearance"]
      });
    }  
  });
});

app.post("/next", (req, res) => {
  request(url, (err, response, body)=>{
    if (!err){
      const users = JSON.parse(body);
      nextHero();
      res.render("home", {
        id: users[iterator]["id"],
        name: users[iterator]["name"], 
        imageHeroe: users[iterator]["images"]["md"],
        fullname: users[iterator]["biography"]["fullName"] ,
        placeOfBirth: users[iterator]["biography"]["placeOfBirth"],
        aliases: users[iterator]["biography"]["aliases"],
        smallBiography : users[iterator]["work"]["occupation"],
        powerstats : users[iterator]["powerstats"],
        appearance : users[iterator]["appearance"]
      });
    }  
  });
});

app.post("/previous", (req, res) => {
  request(url, (err, response, body)=>{
    if (!err){
      const users = JSON.parse(body);
      previousHero();
      res.render("home", {
        id: users[iterator]["id"],
        name: users[iterator]["name"], 
        imageHeroe: users[iterator]["images"]["md"],
        fullname: users[iterator]["biography"]["fullName"] ,
        placeOfBirth: users[iterator]["biography"]["placeOfBirth"],
        aliases: users[iterator]["biography"]["aliases"],
        smallBiography : users[iterator]["work"]["occupation"],
        powerstats : users[iterator]["powerstats"],
        appearance : users[iterator]["appearance"]
      });
    }  
  });
});

app.post("/search",(req, res)=>{
  let names = [];
  let indexes = 0;
  let searchBar = req.body.heroSearch.toLowerCase();
  request(url, (err, response, body)=>{
    if (!err){
      const users = JSON.parse(body);
      users.forEach(function(hero, index) {
        names.push(users[index]["name"].toLowerCase());
      });
      if (names.includes(searchBar)) {
        indexes = names.indexOf(searchBar);
        res.render("home", {
          id: users[indexes]["id"],
          name: users[indexes]["name"], 
          imageHeroe: users[indexes]["images"]["md"],
          fullname: users[indexes]["biography"]["fullName"] ,
          placeOfBirth: users[indexes]["biography"]["placeOfBirth"],
          aliases: users[indexes]["biography"]["aliases"],
          smallBiography : users[indexes]["work"]["occupation"],
          powerstats : users[indexes]["powerstats"],
          appearance : users[indexes]["appearance"]
      });
      }
      else {
        res.render("error");
      }
    }
    iterator = indexes;
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});

//Al buscar debe aparecer el nombre de los superheroes que coinciden y picarle y te pondra el superheroe
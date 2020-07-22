var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const path = require("path");
const TokenGenerator = require('uuid-token-generator');
const db = require("quick.db")
const bodyparser = require("body-parser")



app
.use(bodyparser.json())
.use(bodyparser.urlencoded({ extended: true }))
.engine("html", require("ejs").renderFile)
.set("view engine", "ejs")

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});




app.get('/chat/:name/:password', async function(req, res) {
const username = req.params.name
const password = req.params.password
const list = await db.fetch('playerList')

const result = await db.fetch(username)

   let prohibidos = ["exun", "ID2"];
    
    if(prohibidos.includes(username)) return res.redirect(`/banned/${username}`)

if(password !== result) return res.redirect("/failed2/" + username)

console.log(`${username} has logged in`)
  
    res.render('web.ejs', {
        user: username,
      pass: password,
      list: list
    });
  
  
  app.post('/chat/pfp/:username/:password', async(req, res) => {
    
    const url = req.body.pfp
    const user = req.params.username
    const pass = req.params.password
    
 
    
    
    
    if(url.endsWith["png", "jpg", "gif"]){
      
      db.set(`${user}_pfp`, url)
      console.log(url)
      res.redirect(`/chat/${user}/${pass}`)
      
    } else return res.send(`

<strong> NO PUEDES PONERTE ESTE LINK, LA URL NO ES UNA FOTO </strong>

`)
    
    
  });
  
});


app.get('/register', function(req, res) {

  const abc = "abc"
    res.render('register.ejs', {
        user: abc,
    });
  
  app.post('/register/form', async(req, res) => {
      
    const user = req.body.user
    const pass = req.body.pass
    console.log(req.body)
    
    const already = db.has(user)
    
    if(already === true) return res.redirect("/failed/"+ user)
    if(already === false){
      
      db.set(user, pass)
      db.push('playerList', user)
      console.log(`${user} registered with password: ${pass}`)
      res.redirect(`/chat/${user}/${pass}`)
    }
    
    
    



})
  
});


app.get('/failed/:user', function(req, res) {
const username = req.params.user
   const abc = "abc"
    res.render('failed.ejs', {
        user: username,
    });
  
});


app.get('/banned/:user', function(req, res) {
const username = req.params.user
   const abc = "abc"
    res.render('banned.ejs', {
        user: username,
    });
  
});


app.get('/failed2/:user', function(req, res) {
const username = req.params.user
   const abc = "abc"
    res.render('failed2.ejs', {
        user: username,
    });
  
});



http.listen(3000, () => {
  console.log('listening on *:3000');
});

io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});



io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', `${msg}`)
  });
});
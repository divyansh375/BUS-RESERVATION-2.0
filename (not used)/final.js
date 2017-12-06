var express=require('express');
var app=express();
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://adminsys:@ds231725.mlab.com:31725/bus";
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
app.use(express.static('webtech'));
app.get('/sign up',function(req,res)
{
res.sendFile(__dirname+"/"+"sign up.html");
});
app.get('/get_pro',function(req,res)
{
req.session.user="hello";
req.session.user=req.query.username;
req.session.password=req.query.password;



MongoClient.connect(url, function(err, db) {
 if (err) throw err;

db.collection("user").insertOne({username:req.query.username,password:req.query.password},function(err,res)
{
if(err) throw err;
console.log("done");
db.close();
});
});

res.send("Thank you "+req.session.username+" you have successfully created account");





});

app.get('/My Ticket',function(req,res)
{
res.sendFile(_dirname+"/"+"My Ticket,html");
});

app.get('/pro_get1',function(req,res)
{
















MongoClient.connect(url, function(err, db) {
 if (err) throw err;

db.collection("user").findOne({username:req.query.username,password:req.query.password},function(err,result){
if(req.query.username==result.username && req.query.password==result.password)
{
console.log("logged in");
res.redirect('after login.html');
}
else
{
console.log("login failed");
res.send("failed");

}
db.close();
});
});











});

app.get('/after login.html',function(req,res)
{
res.sendFile(__dirname+"/"+"after login.html");
});

app.get('/book new ticket.html',function(req,res)
{
res.sendfile(__dirname+"/"+"book new ticket.html");
});


app.get('/pro_get4',function(req,res)
{

req.session.from=req.query.from;
req.session.to=req.query.to;
req.session.date=req.query.date;



MongoClient.connect(url, function(err, db) {
 if (err) throw err;
db.collection("bus_details").findOne({from:"Bihar"},function(err,result){





db.collection("bus_details").updateOne({from:"Bihar"},{from:"Bihar",to:"Mumbai",Total_Seats:result.Total_Seats-1},function(err,res)
{
if(err) throw err;
console.log("done");


db.close();
});




});





res.send('you have succesfully booked the ticket');


});














});

app.get('/pro_get2',function(req,res)
{
if(req.session.from=='null')
{
res.send('no ticket has been booked');
}
else
{

res.send("from:" + " " + req.session.from + "\n" + "to:" + " " + req.session.to + "\n" + " date " +" " + req.session.date);
}
});








app.listen(8081,'127.0.0.1');

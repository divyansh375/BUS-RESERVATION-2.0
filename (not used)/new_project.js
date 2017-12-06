var express=require('express');
var app=express();
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://adminsys:@ds231725.mlab.com:31725/bus";
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
app.use(express.static('webtech'));

var engines = require('consolidate');
app.set('views', __dirname + '/webtech');
app.engine('html', engines.mustache);
app.set('view engine', 'html');










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

res.send("Thank you "+req.query.username+" you have successfully created account");





});

app.get('/My Ticket',function(req,res)
{
res.sendFile(_dirname+"/"+"My Ticket.html");
});


app.get('/pro_get1',function(req,res)
{

MongoClient.connect(url, function(err, db) {
 if (err) throw err;

db.collection("user").findOne({username:req.query.username,password:req.query.password},function(err,result){

if(req.query.username=='divyansh' && req.query.password=='hello')
{
console.log('logged in as admin');

res.redirect('admi_page.html');
return(false);
}



if(req.query.username==result.username && req.query.password==result.password && req.query.username!='divyansh' && req.query.password!='hello')
{
console.log("logged in");


res.render('welcome page.html',
{
name:result.username});




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

app.get("/go_to_check_availability",function(req,res)
{

res.redirect("/check_availability.html");
});



app.get("/check_availability",function(req,res)
{

MongoClient.connect(url, function(err, db) {
 if (err) throw err;
db.collection("bus_details").findOne({from:req.query.from},function(err,result){

res.send(result);
});
});
});

app.get('/pro_get4',function(req,res)
{

req.session.from=req.query.from;
req.session.to=req.query.to;
req.session.date=req.query.date;



MongoClient.connect(url, function(err, db) {
 if (err) throw err;
db.collection("bus_details").findOne({from:"Bihar"},function(err,result){

req.session.fare=result.total_fare;
req.session.seat_no='';
req.session.seats_total=result.Total_Seats;

req.session.r_middle=0;
req.session.r_window=0;

if(req.query.pre=="middle")
{
req.session.r_middle=1;
req.session.seat_no=req.session.seat_no+req.session.seats_total.toString() +'M';
}
else if(req.query.pre=="window")
{
req.session.r_window=1;
req.session.seat_no=req.session.seat_no+req.session.seats_total.toString() +'W';
}

db.collection("invoice").insertOne({name:req.query.passenger,fare:req.session.fare,seat_no:req.session.seat_no,from:req.query.from,to:req.session.to});
res.redirect("/pay.html");


db.collection("bus_details").updateOne({from:"Bihar"},{from:"Bihar",to:"Mumbai",Total_Seats:result.Total_Seats-1,total_fare:200,seat_no:result.Total_Seats,middle:result.middle-req.session.r_middle,window:result.window-req.session.r_window},function(err,res)
{
if(err) throw err;
console.log("done");


db.close();
});

db.collection("user_payment").insertOne({passenger:req.query.passenger,fare:req.session.fare,card_comp:req.query.card,card_no:req.query.card_no},function(err,res)
{
if(err) throw err;
console.log("done");
db.close();
});


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




app.get('/pro_get10',function(req,res)
{








MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("enquiry").find({}).toArray(function(err, result) {
    if (err) throw err;
    
 res.send(result);


    db.close();
  });
});

});

app.get('/pro_get11',function(req,res)
{

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("enquiry").insertOne({email:req.query.email,question:req.query.question}, function(err, result) {
    if (err) throw err;
    res.send("your enquiry  has been send. You will get the response soon in your email");
console.log("enquiry sent");
    db.close();
  });
});


});


app.get("/go_to_sign_up",function(req,res)
{
res.redirect("sign up.html");
});

app.get("/book_my_ticket",function(req,res){
res.redirect("book new ticket.html");
});

app.listen(8081,'127.0.0.1');

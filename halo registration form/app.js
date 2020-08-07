var express=require("express"); 
var bodyParser=require("body-parser");
var port = 3000; 

const mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/gfg'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
	console.log("connection succeeded"); 
}) 

var app=express() 


app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
	extended: true
})); 

app.post('/sign_up', function(req,res){ 
	var name = req.body.oname; 
	var pass = req.body.pass;
	var cpass = req.body.cpass;
	var address = req.body.address;
	var email =req.body.mail;  
	var phone =req.body.phone; 

	var data = { 
		"name": name, 
		"password":pass,
		"confirm password":cpass,
		"address":address,
		"email": email, 
		"phone":phone 
	} 
db.collection('details').insertOne(data,function(err, collection){ 
		if (err) throw err; 
		console.log("Record inserted Successfully"); 
			
	}); 
		
	return res.sendFile(__dirname + "/signup_success.html"); 
}) 


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/halo_orph_registration.html");
});


app.listen(port, () => {
    console.log("Server listening on port " + port);
});

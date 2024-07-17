const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const app = express()
app.use(cors());
app.use(express.json());

const con = mysql.createConnection({
	host : "sql12.freesqldatabase.com",
	user : "sql12720264",
	password : "5Rp19BxNG7",
	database : "sql12720264"
});

//set up multer for file uploads
const storage = multer.diskStorage({
	destination : (req, file, cb) => {
		cb(null, 'uploads/');	//destination folder for uploads
	},
	filename:(req, file, cb)=> {
		cb(null, Date.now() + path.extname(file.originalname));	//unique filename
	},	
	
});

const upload = multer({storage});

//serve uploaded files statically
app.use('/uploads', express.static('uploads'));

app.post("/save", upload.single('file'), (req,res) => {
	let data = [req.body.rno, req.body.name, req.body.marks, req.file.filename];
	console.log(data);
	let sql = "insert into student values(?,?,?,?)";
	con.query(sql, data, (err, result) => {
		if(err)		res.send(err);
		else		res.send(result);
	});
});

app.get("/read", (req,res) => {
	let sql = "select * from student";
	con.query(sql, (err, result) => {
		if(err)		res.send(err);
		else		res.send(result);
	});
});


app.delete("/remove", (req,res) => {
	let data = [req.body.rno];
	fs.unlink("./uploads/" + req.body.file, () => {});
	let sql = "delete from student where rno = ?";
	con.query(sql,data, (err, result) => {
		if(err)		res.send(err);
		else		res.send(result);
	});
});

app.listen(9000, () => {console.log("ready @ 9000");});


















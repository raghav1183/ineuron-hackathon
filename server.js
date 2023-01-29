const express = require("express")
const app = express()
const port = 3001
const fs = require("fs")
const path = require("path")
const Client = require("pg").Client;
const bcrypt = require("bcrypt")

app.use(express.static(path.join(__dirname, '/')));
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',//securely provide password
    port: 5432,
})

async function connect(){
    await client.connect()
    
};
connect();

const goal_params = `
id serial primary key,
user_id int,
bmi float,
fat float,
steps int
`

console.log(
    (async function (){
    await client.query(`create table if not exists users(
        id serial primary key,
        name varchar(50),
        email varchar(50),
        password varchar(50),
        age int)`)
   //create table for set health goals
    await client.query(`create table if not exists goals(${goal_params})`)
   //create table for current health parameters
    await client.query(`create table if not exists health(${goal_params})`)
})()
    );



// app.use(express.static(path.join(__dirname,"../")))

app.get("/record",(req,res)=>{
    const option = req.query.option;
    //better: implement json parsing
    const query = `insert into ${option}(user_id,bmi,fat,steps) values(${req.query.user_id},${req.query.bmi},${req.query.fat},${req.query.steps})`
    client.query(query,(err,result)=>{
        if(result) res.send("done")
         else res.send("failed");
     } 
     
     )})
 


app.get("/createuser",(req,res)=>{
    //img also?
    //duplication prevention
    const query = `insert into users(name,email,password,age) values('${req.query.name}','${req.query.email}','${hash(req.query.password)}',${req.query.age})`;
    client.query(query);
    res.send("done");
})

// default page
app.get("/",(req,res)=>
    fs.readFile("frontend/html/index.html",
    "utf8",
    function (err,text){
        res.send(text)
    })
)

app.get("/login",(req,res)=>{
    const query = `select * from users where email='${req.query.email}'`
    const result = client.query(query)
    result.then((result)=>{
        console.log(result.rows[0])
        result.rowCount > 0 ? hash(req.query.password) == (result.rows[0])["password"]? res.send("success") : res.send("wp") : res.send("failed")
})
}
)


function hash(password){
   bcrypt.hash(password,10,(err,hash)=>{
         return hash;
    })
   

}


//data processing
//0-20.........80-100

// Fat = totaldiet/bpscore*agrp*weight
// water consumption = 0.7*weight
// delta result

//imp:dietary preferences






app.listen(port,()=>console.log("Server started!!!! \n \delay10s yippie! maza aaaaa gaya"))

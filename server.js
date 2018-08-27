const express = require('express');
const port = 3002;
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const Sequelize = require('sequelize');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));


const server = app.listen(port, (error) => {
    if(error){
        return console.log(`Error:${error}`)
    }
    console.log(`App listening on port ${server.address().port}`);
});


const sequelize = new Sequelize('test', 'root', 'sinister', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,
  storage: '/usr/local/var/mysql/test.mysql',
  define: {
    timestamps: false
    }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


//define model
const Hotel = sequelize.define('hotels',{
    h_id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    h_name :{
        type: Sequelize.STRING,
        unique : true
    },
    h_room:{
     type : Sequelize.INTEGER   
    }
});

const Rooms = sequelize.define('rooms',{
    r_id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    hotel_id :{
        type: Sequelize.INTEGER,
        foreignKey : true
    },
    r_no:{
        type : Sequelize.INTEGER
    },
    capacity:{
        type : Sequelize.INTEGER
    }
});

const Users = sequelize.define('users',{
    u_id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    u_name :{
        type: Sequelize.STRING,
    },
    u_email:{
        type : Sequelize.STRING
    }
});


//-----------------------------hotels---------------------//
app.get('/hotels',(req,res)=>{
    Hotel.findAll().then(result => {
        return res.send(result);
      });
});

app.post('/hotels',(req,res)=>{
    Hotel.build({h_name : req.body.h_name, h_room : req.body.h_room}).save();
    return res.send('successfully inserted into db');
});

app.put('/hotels/:id',(req,res)=>{
    Hotel.update({h_name: req.body.h_name, h_room: req.body.h_room},{where : {h_id:req.params.id}}, {fields: ['h_name','h_room']});
    return res.send('successfully updated into db');
});

app.delete('/hotels/:id',(req,res)=>{
    Hotel.destroy({where:{h_id : req.params.id}});
    return res.send('successfully deleted from db');
});

//------------------------------rooms---------------------//

app.get('/hotels/:h_id',(req,res)=>{
    Rooms.findAll({where:{hotel_id:req.params.h_id}}).then(result => {
        return res.send(result);
      });
});

app.post('/hotels/:h_id/rooms',(req,res)=>{
    Rooms.build({hotel_id : req.params.h_id, r_no : req.body.r_no, capacity: req.body.capacity}).save();
    return res.send('successfully inserted into db');
});

app.put('/hotels/:h_id/rooms/:r_id',(req,res)=>{
    Rooms.update({r_no: req.body.r_no, capacity: req.body.capacity},{where : {r_id:req.params.r_id}}, {fields: ['r_no','capacity']});
    return res.send('successfully updated into db');
});

app.delete('/hotels/:h_id/rooms/:r_id',(req,res)=>{
    Rooms.destroy({where:{r_id : req.params.r_id}});
    return res.send('successfully deleted from db');
});


//-----------------------------users--------------------------------//

app.get('/users',(req,res)=>{
    Users.findAll().then(result => {
        return res.send(result);
      });
});

app.post('/users',(req,res)=>{
    Users.build({u_name : req.body.u_name, u_email : req.body.u_email}).save();
    return res.send('successfully inserted into db');
});

app.put('/users/:u_id',(req,res)=>{
    Users.update({u_name: req.body.u_name, u_email: req.body.u_email},{where : {u_id:req.params.u_id}}, {fields: ['u_name','u_email']});
    return res.send('successfully updated into db');
});

app.delete('/users/:u_id',(req,res)=>{
    Users.destroy({where:{u_id : req.params.u_id}});
    return res.send('successfully deleted from db');
});
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());  
app.use(express.json());

const{connectToDb,getDb}=require('./db');
let db;

connectToDb((err)=>{
    if(!err){
        app.listen(3001, () => {
            console.log("connected to database");
        });
        db=getDb();
    }
})


//app.get
app.get('/users',(req,res)=>{
    let users=[];
    db.collection('users')
    .find()
    .forEach((user)=>users.push(user))
    .then(()=>{
        res.status(200).json(users);
    })
    .catch(()=>{
        res.status(500).json({msg:'error in something'});
    })
})


//app.get using id
app.get('/users/:id',(req,res)=>{
    const userID=parseInt(req.params.id);
    if(!isNaN(userID))
    {
        db.collection('users')
        .findOne({id:userID})
        .then((user)=>{
            if(user){
                res.status(200).json(user);
            }
            else{
                res.status(500).json({msg:'student not found'});
            }
        })
        .catch(()=>{
            res.status(500).json({msg:'something went wrong'});
        })
    }
    else{
        res.status(500).json({msg:'not a number'});
    }
})

//app.post
app.post('/users',(req,res)=>{
    const user=req.body;
    db.collection('users')
    .insertOne(user)
    .then((result)=>{
        res.status(200).json({result});
    })
    .catch(()=>{
        res.status(500).json({msg:'error in inserting the data'});
    })
})

//app.patch
app.patch('/users/:id',(req,res)=>{
    let update=req.body;
    const userID = parseInt(req.params.id);
    if(!isNaN(userID))
    {
        db.collection('users')
        .updateOne({id:userID},{$set:update})
        .then((result)=>{
            res.status(200).json({result});
        })
        .catch(()=>{
            res.status(500).json({msg:'error in updating the data'});
        })
    }
    else
    {
        res.status(500).json({msg:'not a number'});
    }
})


//app.delete
app.delete('/users/:id',(req,res)=>{
    const userID = parseInt(req.params.id);
    if(!isNaN(userID))
    {
        db.collection('users')
        .deleteOne({id:userID})
        .then((result)=>{
            res.status(200).json({result});
        })
        .catch(()=>{
            res.status(500).json({msg:'error in deleting the data'});
        })
    }
    else
    {
        res.status(500).json({msg:'not a number'});
    }
})

const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cors=require('cors');
const app=express();
app.use(cors());
dotenv.config();


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/v1/users",require("./routes/user"));

app.get('/',(req,res)=>{
    res.status(200).json({
message:"Welcome to apis",
api1:"visit /api/v1/users/register",
api2:"visit /api/v1/users/login",
    })
})

app.all('*',(req,res)=>{
    res.status(404).json({status:'fail',message:'route does not exist'});
});


mongoose.connect(process.env.MONGOOSE_URI_STRING)
.then(()=>console.log('db is connected'))
.catch((err)=>{console.log('error while connecting to db',err)});

app.listen(process.env.PORT,()=>{
    console.log('server is running on port',process.env.PORT);
})
const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cors=require('cors');
const app=express();
const errorHandler=require("./middleware/errorHandler")
app.use(cors());
dotenv.config();


app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/forms", require("./routes/formRoutes"));
app.use("/api/v1/folders", require("./routes/folderRoutes"));

app.use(errorHandler);


app.get('/',(req,res)=>{
    res.status(200).json({
message:"Welcome to apis",
api1:"visit /api/v1/auth/register",
api2:"visit /api/v1/auth/login",
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
const express=require('express')
const app=express()
const path=require('path')
app.use(express.static('public'))
const ejs=require('ejs')
const session=require('express-session')
const mongoose=require('mongoose')
const Mongodbstore=require('connect-mongo')(session)
const passport=require('passport')
const authController=require('./app/controllers/authController')
const farmController=require('./app/controllers/farmController')
const userController=require('./app/controllers/userController')
////////////////////////////////////
var multer = require('multer');
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });
//////////////////////////////
//const expressLayouts=require('express-ejs-layouts')
let bodyParser = require('body-parser')
app.use(express.json())

app.use(bodyParser.urlencoded({ extended: false }));

//template engine

//app.use(expressLayouts)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

const url="mongodb://127.0.0.1:27017/mandi";
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:false})
const connection=mongoose.connection

connection.once('open',()=>{
    console.log('Established')
}).catch((e)=>{
    console.log('Not')
})


let mongoStore=new Mongodbstore({
    mongooseConnection:connection,
    collection:'sessions'
})
//const eventEmitter=new Emitter()
//app.set('eventEmitter',eventEmitter)
//session
//app.use(flash())
app.use(session({
    secret:'thisismysecret',
    resave:false,
    store:mongoStore,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24}
}))
const passportInit=require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())
//global middleware to use data in frontend
app.use((req,res,next)=>{
    res.locals.session=req.session;
    res.locals.user=req.user;
    next()
})


// All Routes
app.get('/',(req,res)=>{
    res.redirect('/login')
})
app.get('/register',authController().register)
app.post('/register',authController().postRegister)
app.get('/login',authController().login)
app.post('/login',authController().postLogin)
app.get('/user',userController().getItem)
app.get('/farmer/upload',farmController().upload)
app.post('/upload',upload.single('image'),farmController().postUpload)
app.get('/farmer',farmController().farmerItem)
app.post('/logout',authController().logout)
app.post('/view/:id',userController().show)
app.post('/user/order',userController().order)
app.get('/farmer/orders',farmController().showorders)
app.get('/user/orders',userController().myOrder)
app.post('/farmer/updateStatus',farmController().changeStatus)
app.post('/farmer/vegetableStatus',farmController().vegetableStatus)
app.listen(3000,()=>{
    console.log('connected')
})



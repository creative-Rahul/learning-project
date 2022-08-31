require('dotenv').config()
const hbs = require("hbs");
const express = require("express");
const path = require("path");
const app = express();
require("./db/conn")
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
const auth = require("./middleware/auth")

const Register = require("./models/registers");
const async = require("hbs/lib/async");

const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

// console.log(process.env.SECRET_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", template_path)
hbs.registerPartials(partial_path);



app.get("/", (req, res) => {
    res.render("index")
})
app.get("/logout",auth, async(req, res) => {
    try {
        // console.log(req.user);

        // for single device logout
        // req.user.tokens = req.user.tokens.filter((currElement)=>{
        //     return currElement.token !== req.token;
        // })

        // logout from all devices
        req.user.tokens = [];

        res.clearCookie("jwt")
        console.log("Logout Successfully");
        await req.user.save()
        res.render("login")
    } catch (error) {
        res.status(500).send(error)
    }

})
app.get("/secret", auth,(req, res) => {
    // console.log(`the cookie is ${req.cookies.jwt}`)
    res.render("secret")
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/register", (req, res) => {
    res.render("register")
})

// Create a new user in our database
app.post("/register", async (req, res) => {
    try {
        // console.log(req.body.firstname);
        // res.send(req.body.firstname)
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.mobile,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })
            const registered = await registerEmployee.save();
            console.log(registered);
            
            const token = await registerEmployee.generateAuthToken();
            console.log("the token part " + token)

            res.cookie("jwt", token,{
                expires : new Date(Date.now()+ 30000),
                httpOnly: true
            })
            // console.log(cokkie);

            res.status(201).render("index")
        }
        else {
            res.send("password are not matching");
        }
    } catch (error) {
        res.status(400).send(error);
    }
})


app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password

        const useremail = await Register.findOne({ email: email });

        const token = await useremail.generateAuthToken();
        console.log("the token part " + token)
        
        res.cookie("jwt", token,{
            expires : new Date(Date.now()+ (3*60000)),
            httpOnly: true,
            // secure:true
        })

        if (useremail.password === password) {
            res.status(201).render("index");
        } else {
            res.send("Wrong Password")
        }
    } catch (error) {
        res.status(400).send("Invalid Email")
    }
})

// const createToken = async ()=>{
//     const token = await jwt.sign({_id:"630db246e230484da7e22cb3"}, "mynameisrahulyadav")
//     console.log(token)
//     const verifyUser = await jwt.verify(token,"mynameisrahulyadav")
//     console.log(verifyUser);
// }

// createToken()


app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
})

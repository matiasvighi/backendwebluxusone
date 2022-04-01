const e = require('express')
const mongoose = require('mongoose')
const conectionString = `mongodb+srv://mvighi:Delfina31@matytest.jn9p5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`


//conection to mongodb

mongoose.connect(conectionString)
.then(() => {
    console.log("conetado re piola ala db")
}).catch(err => {
    console.error(err)
})

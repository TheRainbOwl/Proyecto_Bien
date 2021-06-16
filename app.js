/* 
    Este archivo solo sirve para poner los archivos estáticos y corre
    el servidor, no hace falta tocar este.

*/

const express = require("express")
const app = express()
const PORT = 3000

// STATIC FILES
app.use("/views", express.static(__dirname))
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// ROUTES
app.use(require("./routes/index"))

// PORT
app.listen(PORT, () =>{
    console.log(`Listen in the port http://localhost:${PORT}`)
})

const {dateConverter, currentDay} = require("./views/helpers/helpers");

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const hbs = require('express-handlebars')
const routes = require('./routes/todos')

const PORT = process.env.PORT || 3000

const app = express()
const handle = hbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: {
        "pubtime": dateConverter,
        'today': currentDay,
    }
})

app.engine('hbs', handle.engine)
app.set('view engine', 'hbs')
app.set('layouts', 'layouts')

app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(routes)


async function start() {
    try {
        await mongoose.connect('mongodb+srv://escarbon:escarbon@cluster0-nvy9d.mongodb.net/todos', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => {
            console.log('Server has been started...')
        })
    } catch (e) {
        console.log('Error: ' + e)
    }
}

start();

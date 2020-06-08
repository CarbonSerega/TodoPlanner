const {Router} = require('express')

const router = Router()
const Todo = require('../models/Todo')
let isSortedByCompleted = true;

router.get('/', async (req, res) => {
    let allCompleted;
    let atLeastOneCompleted;
    const todos = await Todo.find({})
        .lean()
        .exec()
        .catch((error) => console.log("Error getting todos: "+ error))

    await todos.filter(t => t.lastChange.getDay() < new Date().getDay())
        .forEach((t) => Todo.findById({_id: t._id}).deleteOne().lean().exec())


    if(todos.every(t => t.completed===true)) allCompleted = true
    else if(todos.every(t => t.completed===false)) allCompleted = false

    atLeastOneCompleted = todos.filter(t => t.completed).length !== 0

        res.render('index', {
            title: 'Todos list',
            isIndex: true,
            todos,
            allCompleted,
            atLeastOneCompleted,
            isEmpty: todos.length === 0
        })

    })
    .get('/create', (req, res) => {
        res.render('create', {
            title: 'Create your Todo',
            isCreate: true
        })
    })
    .post('/create', async (req, resp) => {
        const todo = new Todo({
            title: req.body.title,
            lastChange: new Date()
        })

        await todo.save()
        resp.redirect('/')
    })
    .post('/complete', async (req, resp) => {
        const todo = await Todo.findById(req.body.id)
        todo.completed = req.body.completed
        await  todo.save()

        resp.redirect('/')
    })
    .post('/complete/all', async (req, resp) => {
        let allCompleted;
        const todos = await Todo.find({}).lean().exec()
            .catch((error) => console.log('Error getting todos: ' + error))

        if(todos.every(t => t.completed===true)) allCompleted = true
        else if(todos.every(t => t.completed===false)) allCompleted = false


        await Todo.updateMany({completed: !allCompleted})
            .lean()
            .exec()
            .catch((error) => console.log('Error updating todos: '+error))

        resp.send({isAllCompleted: true})
    })
    .post('/delete', async (req, resp) => {
        await Todo.findById({_id: req.body['remove_id']})
            .deleteOne()
            .catch((e) => console.log("Rejected: " + e))

        resp.redirect('/')
    })
    .post('/delete/selected', async (req, resp) => {
        await Todo.deleteMany({completed: true})
            .lean()
            .exec()
            .catch((e) => console.log("Rejected: " + e))

        resp.redirect('/')
    })
    .post('/sort/completion', async (req, resp) => {
        isSortedByCompleted = !isSortedByCompleted
        const old = await Todo
            .find({})
            .exec()
            .catch((e) => console.log("Rejected: " + e))

        const todos = await Todo
            .find({})
            .sort({completed: isSortedByCompleted ? 1 : -1})
            .exec()
            .catch((e) => console.log("Rejected: " + e))

        for(let i = 0; i < old.length; i++) {
            if(old[i] !== todos[i]) {
                await Todo.findById({_id: old[i]._id})
                    .updateOne({
                        title: todos[i].title,
                        completed: todos[i].completed,
                        lastChange: todos[i].lastChange
                    })
                    .exec()
                    .catch((e) => console.log("Rejected: " + e))
            }
        }

        // await Todo.deleteMany()
        //     .lean()
        //     .exec()
        //     .catch((e) => console.log("Rejected: " + e))
        //
        // await Todo.insertMany(todos)
        //     .catch((e) => console.log("Rejected: " + e))

        resp.redirect('/')
    })

module.exports = router

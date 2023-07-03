const express = require('express');
const app=express();
const path=require('path');
const methodOvveride= require('method-override')
const {Thread,Board,Reply}=require('./database.js')
const { mongoose } = require("mongoose");

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded({extended: true}))
app.use(methodOvveride('_method'))

app.get('/',(req,res)=>{
    res.render('home.ejs')
})
app.get('/api/threads/:board',()=> res.redirect(`/b/${board}`))

app.get('/b/:board', async (req,res) => {
    const {board}=req.params;
    let boardThread=await Board.findOne({name:board}).exec()
    res.render('board.ejs',{name:boardThread.name, listOfThreads:boardThread.listOfThreads})
})

app.post('/api/threads/:board',async (req,res) => {
        let {board,text,password}=req.body
        const newThread= new Thread({board:board,text:text,password:password})
        Board.findOne({name:board})
        .then(async (boardThread)=>{
            boardThread.listOfThreads.push(newThread)
            await boardThread.save()
            res.redirect(`/b/${board}`)
            }
        )
        .catch(err=>{
            Board.insertMany({name:board, listOfThreads:[newThread]})
            res.redirect(`/b/${board}`)
            }
    )
})

app.put('/api/threads/:board',async(req,res)=>{
    const {board, idThread}=req.body
    boardOfThisThread= await Board.findOne({name: board}).exec()
    boardOfThisThread.listOfThreads.find(value => value._id.toString()=== idThread).report= true
    boardOfThisThread.markModified('listOfThreads')
    await boardOfThisThread.save()
    res.redirect('back')
})

app.delete('/api/threads/:board',async(req,res)=>{
    let {board, idThread,password}=req.body
    boardOfThisThread= await Board.findOne({name: board}).exec()
    boardOfThisThread.listOfThreads=boardOfThisThread.listOfThreads.filter((value) => !(value._id.toString()=== idThread && value.password===password))
    await boardOfThisThread.save()
    res.redirect('back')
})

app.post('/api/replies/:board',async (req,res) => {
    let {board,idThread,text,password}=req.body
    const newReply= new Reply({board:board,idThread: idThread,text:text,password:password})
    boardOfThisThread= await Board.findOne({name: board}).exec()
    threadOfThisReply= boardOfThisThread.listOfThreads.find(value => value._id.toString()===idThread)
    threadOfThisReply.listOfReplies.push(newReply)
    await boardOfThisThread.save()
    res.redirect(`/b/${board}`)
})

app.put('/api/replies/:board',async(req,res)=>{
    const {board, idThread,  idReply}=req.body
    boardOfThisThread= await Board.findOne({name: board}).exec()
    threadOfThisReply= boardOfThisThread.listOfThreads.find(value => value._id.toString()=== idThread)
    threadOfThisReply.listOfReplies.find(value => value._id.toString()=== idReply).report=true
    boardOfThisThread.markModified('listOfThreads')
    await boardOfThisThread.save()
    res.redirect('back')
})

app.delete('/api/replies/:board',async(req,res)=>{
    let {board, idThread,password, idReply}=req.body
    boardOfThisThread= await Board.findOne({name: board}).exec()
    threadOfThisReply= boardOfThisThread.listOfThreads.find(value => value._id.toString()=== idThread)
    threadOfThisReply.listOfReplies= threadOfThisReply.listOfReplies.filter((value) => !(value._id.toString()=== idReply && value.password===password))
    await boardOfThisThread.save()
    res.redirect('back')
})

app.listen(8080,()=>{
    console.log('listening on port 8080');
});

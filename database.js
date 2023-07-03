const mongoose = require('mongoose');
var Schema=mongoose.Schema;
async function connecting(){
    try {
    await mongoose.connect('mongodb://127.0.0.1:27017/messageBoard')
    console.log("Connection Successfully")
    }
    catch (err){
        console.log('Connection Failed');
        console.log(err)
    }
}
connecting();
const replySchema = new Schema({
    board: {
        type:String,
        required: true,
    },
    idThread: {
        type:String,
        required: true,
    },
    text: {
        type: String
    },
    password: {
        type:String,
        required: true,
    },
    report: {
        type:Boolean,
        default: false,
    },
},
    {timestamps:true}
)

const threadSchema = new Schema({
    board: {
        type:String,
        required: true,
    },
    text: {
        type: String
    },
    password: {
        type:String,
        required: true,
    },
    report: {
        type:Boolean,
        default: false,
    },
    listOfReplies:{
        type:[replySchema]
    },
},
    {timestamps:true}
)

const boardSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    listOfThreads:{
        type: [threadSchema]
    }
})

const Thread= mongoose.model('Thread',threadSchema)
const Board=mongoose.model('Board',boardSchema)
const Reply=mongoose.model('Reply',replySchema)
exports.Thread=Thread;
exports.Board=Board;
exports.Reply=Reply;

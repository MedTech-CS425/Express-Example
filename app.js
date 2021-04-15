const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


app.use(express.json());


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/students', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  console.log('Connected to database');
});


const StudentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    skills: [String],
    age: Number
});
const Student = mongoose.model('Student', StudentSchema);

const auth = (req, res, next) => {
    try {
        const {id} = jwt.verify(req.get('Authorization'), 'anysecret');
        const student = Student.findById(id);
        req.user = student;
        next();
    } catch (error) {
        res.send('Unauthorized Access')
    }
}

app.post('/students', async (req, res)=> {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 12);
        await Student.create(req.body);
        res.send('Student Created Succesfully');   
    } catch (error) {
        res.send('Problem with server');
    }

});
app.get('/students', auth ,async(req, res)=> {
    res.json(await Student.find());
});
app.get('/students/:id', auth ,async (req, res)=> {
    res.json(await Student.findById(req.params.id));
});
app.post('/login', async (req, res)=> {
    try {
        const student = await Student.findOne({email: req.body.email});
        const match = await bcrypt.compare(req.body.password, student.password)
        if(!match){
            res.send('Wrong Password')
        }else{
            res.send(jwt.sign({id: student._id}, 'anysecret'))
        }
    } catch (error) {
        console.error(error);
        res.send('Wrong Email')
    }

});
app.delete('/students', async (req, res, next) => {
    await Student.deleteMany();
    res.send('Deleted All Students')
});
app.delete('/students/:id', async (req, res, next) => {
    await Student.findByIdAndDelete(req.params.id);
    res.send('Student Deleted')
})

app.listen(3000, ()=>{
    console.log('App Listening on Port 3000');
})
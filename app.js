const express = require('express');
const app = express();

app.use(express.json())

const students = [];

app.post('/students', (req, res, next)=> {
    students.push(req.body);
    console.log('1st call');
    next();
});
app.post('/students', (req, res, next) => {
    console.log('2nd call');
    res.send('Students Added');
})
app.get('/students', (req, res, next)=> {
    res.json(students)
});
app.get('/students/:index', (req, res, next)=> {
    res.json(students[req.params.index])
});
app.delete('/students', (req, res, next) => {
    students.length = 0;
    res.send('All students are deleted')
});
app.delete('/students/:index', (req, res, next) => {
    students.splice(req.params.index, 1);
    res.json(students)
})

app.listen(3000, ()=>{
    console.log('App Listening on Port 3000');
})
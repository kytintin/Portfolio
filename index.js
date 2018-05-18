const Joi = require('joi');

const express = require('express');

//Express constant
const app = express();
/** Use EJS as a view */
app.set('view engine', 'ejs');

// return middleware 
app.use(express.json());
app.use('/assets', express.static('assets'));
/** Add Bootstrap */
app.use('/css', express.static('/node_modules/bootstrap/dist/css'));

const courses = [
    {id: 1, name: 'Laravel', teacher: 'Jeffery Way',
        topic: ['What is Laravel?', 'Eloquent Models', 'Lara Magic']},
    {id: 2, name: 'Node Js', teacher: 'Mosh',
        topic: ['What is Node.Js?', 'Node.Js\'s Frameworks', 'Express Js']},
    {id: 3, name: 'How to stay lazy af', teacher: 'Kyaw Thit Lwin',
        topic: ['Nothing At All']},
];

/* Define Routes */
app.get('/', (req, res) => {
    console.log(`Current Url ${req.url}`)
    res.render('index', {current: req.url} );
});


app.get('/api/courses', (req,res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req,res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id))

    if(!course) //404
    {
        return res.status(404).send('The given id was not found');
    }

    res.render('profile', {course: course});

});

//create course
app.post('/api/courses', (req,res) => {

    //Validate
    //return 400, if validation errors
    const { error } = courseValidation(req.body); //result.error

    if(error)
    {
        return res.status(400).send(error.details[0].message);
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name,
        teacher: req.body.teacher
    };

    courses.push(course);

    res.send(course);
})


/** Update Coursers */
app.put('/api/courses/:id', (req,res) => {

    //Look up the course
    //Return 404, if not exists
    const course = courses.find(c => c.id === parseInt(req.params.id))

    if(!course) //404
    {
        return res.status(404).send('The given id was not found');
    }

    //Validate
    //return 400, if validation errors
    const { error } = courseValidation(req.body); //result.error

    if(error)
    {
        return res.status(400).send(error.details[0].message);
    }

    //update course
    course.name = req.body.name;
    course.teacher = req.body.teacher;

    //Return the updated courses
    res.send(course);
})


/** Delete course */
app.delete('/api/courses/:id', (req,res) => {

    //Look up the course
    //Return 404, if not exists
    const course = courses.find(c => c.id === parseInt(req.params.id))

    if(!course) //404
    {
        return res.status(404).send('The given id was not found');
    }

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
})

/** 400 Bad Request */
function courseValidation(course)
{
    const schema = {
        name: Joi.string().min(5).required(),
        teacher: Joi.string().required()
    }

    return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listing on port ${port}`));

const express = require('express')
const Task = require('../models/tasks')
const auth = require('../middleware/auth');
const { Mongoose } = require('mongoose');

const router = new express.Router()

router.post("/tasks", auth ,async (req, res) => {
  // const task = new Task(req.body);

  const task = new Task({
    ...req.body,
    Author:req.user._id
  })
  // task.save().then(()=>{
  //    res.status(201).send(task)
  // }).catch((e)=>{
  //     res.status(400).send(e)
  // })
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});
// "GET /tasks?completed=false"
// GET /tasks?limit=3&skip=3
// GET /tasks?sortBy=createdAt:asc or desc
router.get("/tasks", auth ,async (req, res) => {
  // Task.find({}).then((tasks)=>{
  //     res.send(tasks)
  // }).catch((e)=>{
  //     res.status(500).send(e)
  // })
    const match = {}
    const sort = {}

    if (req.query.completed) {
      
      match.Completed = req.query.completed === "true"; 
    
    }

    if(req.query.sortBy){

      const parts = req.query.sortBy.split(':')
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1

    }
  try {
    // const tasks = await Task.find({Author:req.user._id})
    await req.user.populate({
      path:'tasks',
      match,
      options:{
        limit:parseInt(req.query.limit),
        skip:parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/tasks/:id", auth , async (req, res) => {
 const  _id = req.params.id;

  // Task.findById(_id).then((task)=>{
  //     if(!task){
  //         return res.status(404).send()
  //     }

  //     res.send(task);
  // }).catch((e)=>{
  //     res.status(500).send(e)
  // })

  try {
    
    const task = await Task.findOne({_id,Author:req.user._id})

    if (!task) 
      return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/tasks/:id", auth , async (req, res) => {
  const allowedUpdates = ["Completed", "Description"];
  const Updates = Object.keys(req.body);
  const isValidOperation = Updates.every((updates) =>
    allowedUpdates.includes(updates)
  );
  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid Updates!" });
  try {
    // const task = await Task.findById(req.params.id)
    const task =await Task.findOne({_id:req.params.id,Author:req.user._id})
    
    if (!task) {
      return res.status(404).send();
    }
    Updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id", auth ,async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({_id:req.params.id,Author:req.user._id})

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router
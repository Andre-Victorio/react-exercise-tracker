const express = require("express");
const app = express();
const ExerciseModel = require("./model/Exercise.js");
const mong = require("mongoose");
const cors = require("cors");
require("./.env");
app.use(express.json());
app.use(cors());

mong.connect(MONG_CONNECT);

app.get("/getExercises", (req, res)=>{
  ExerciseModel.find({}).then((exercise)=>{
    res.json(exercise);
  }).catch((err)=>{
    res.json(err);
  }) 
});

app.post("/createExercise",async (req, res)=>{
  const exercise = req.body;
  const newExercise = new ExerciseModel(exercise);
  await newExercise.save().catch((err)=>{
    console.log(err)
  });
   res.json(exercise);
})


app.listen(3001, ()=>{
  console.log("SERVER IS OPEN!");
});

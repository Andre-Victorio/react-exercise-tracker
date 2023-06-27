const express = require("express");
const app = express();
const ExerciseModel = require("./model/Exercise.js");
const mong = require("mongoose");
const cors = require("cors");

app.use(express.json());
app.use(cors());

mong.connect("mongodb+srv://victorioandre78:Ju57dr3_200o@cluster0.66wb2bc.mongodb.net/exerice-tracker");

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

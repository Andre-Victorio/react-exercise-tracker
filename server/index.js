const express = require("express");
const app = express();
const ExerciseModel = require("./model/Exercise.js");
const mong = require("mongoose");
const cors = require("cors");
require("./.ENV");
app.use(express.json());
app.use(cors());

mong.connect(MONG_CONNECT);

app.get("/getExercises", (req, res)=>{
   ExerciseModel.find().then((exercise)=>{
    res.json(exercise);
  }).catch((err)=>{
    res.json(err + "retrieve Error");
  }) 
});

app.post("/getExercisesOnDate", async(req, res)=>{
  const date = req.body;
  // console.log(date.date);
  // console.log(new Date(date.date));
  let today = new Date(date.date);
  let toDate = new Date(date.date);
  let tomDate = new Date(toDate.setDate(toDate.getDate() + 1));
  await ExerciseModel.find({"date":
    {$gt: today,
    $lt:tomDate}}
  ).then((exercise)=>{
    // console.log(exercise);
    (exercise.length > 1)?console.log("hello"):console.log("world");
    res.json(exercise);
  }).catch((err)=>{
    res.json(err + "retrieve Error");
  }) 
});

app.post("/createExercise",async (req, res)=>{
  const exercise = req.body;
  const newExercise = new ExerciseModel(exercise);
  await newExercise.save().catch((err)=>{
    console.log(err + "create Error");
  });
})

app.post("/deleteExercise",(req, res)=>{
  const toDel = req.body;
  if(ExerciseModel.find({"_id":toDel._id})){
    ExerciseModel.deleteOne({"_id":toDel._id}).maxTimeMS(10).then(()=>{
      res.json(toDel);
      return;
    }).catch((err)=>{
      console.log(err);
    });
  }
})


app.listen(3001, ()=>{
  console.log("SERVER IS OPEN!");
});



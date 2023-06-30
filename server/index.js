const express = require("express");
const app = express();
const ExerciseModel = require("./model/Exercise.js");
const mong = require("mongoose");
const cors = require("cors");
require("./.ENV");
app.use(express.json());
app.use(cors());

mong.connect(MONG_CONNECT);

app.get("/getExercises", async(req, res)=>{
  await ExerciseModel.find({}).then((exercise)=>{
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



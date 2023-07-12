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
  let today = new Date(date.date);
  let toDate = new Date(date.date);
  let tomDate = new Date(toDate.setDate(toDate.getDate() + 1));
  await ExerciseModel.find({"date":
    {$gt: today,
    $lt:tomDate}}
  ).then((exercise)=>{
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
app.put("/editExercise", async(req, res)=>{
  const reqBody = req.body;
  await ExerciseModel.updateOne({"_id":reqBody._id}, {set:reqBody.set, name:reqBody.name, reps:reqBody.reps}).then(()=>{
    console.log("Entry Updated");
  }).catch((err)=>{
    console.log(err);
  })
})

app.post("/getExerciseById", (req, res)=>{
  const toFind = req.body;
  ExerciseModel.find({"_id":toFind._id}).then((result)=>{
    res.json(result);
  }).catch((err)=>{
      console.log(err);
  })
})

app.listen(3001, ()=>{
  console.log("SERVER IS OPEN!");
});



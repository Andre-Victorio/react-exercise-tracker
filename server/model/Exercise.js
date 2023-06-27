const mong = require('mongoose');

const ExerciseSchema = new mong.Schema({
  name:{
    type: String,
    required: true,
  },
  set:{
    type: Number,
    required:true,
  },
  reps:{
    type: Number,
    required: true,
  },
  date:{
    type: Date,
    required: false,
  },
});

const ExerciseModel = mong.model("exercises", ExerciseSchema);
module.exports = ExerciseModel;




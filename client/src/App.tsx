import "./App.css";
import { useState, useEffect,} from "react";
import Axios from 'axios'
import ExerciseDisplay from "./components/ExerciseDisplay.tsx";
import CreateButton from "./components/CreateButton.tsx"
function App(){
  const [exerciseList, setExerciseList] = useState<any[]>([]);
  const [exerciseName, setExerciseName] = useState<string>();
  const [exerciseSet, setExerciseSet] = useState<number>();
  const [exerciseReps, setExerciseReps] = useState<number>();
  useEffect(()=>{
  Axios.get("http://localhost:3001/getExercises").then((response)=>{
    setExerciseList(response.data);
  });
  },[]);                                                        
  const createExercise = ()=>{
     Axios.post("http://localhost:3001/createExercise",{name: exerciseName, set: exerciseSet, reps:exerciseReps, date:new Date()}).then((res)=>{
    })
  }        
  const exitModal = () =>{
    if(modal!=null){
      modal.close();
    }
  }
  const deleteExercise = (id:string) =>{
    Axios.post("http://localhost:3001/deleteExercise",{_id:id}).then((res)=>{
      setExerciseList(exerciseList.filter((exercise)=>{return exercise._id !== id}));
    });
  }
  const modal = document.querySelector("[data-modal]") as HTMLDialogElement | null;
  return(
    <>
    <div className="appBody">
      <div className="exerciseHeader" >
      <h1>Exercise Tracker</h1>
      <CreateButton  name="Create an Exercise" onClick={()=>{
          if(modal!=null){
            modal.show();
        }}}/>
      <dialog  data-modal className="data-modal">
        <form className="modalBody">
          <p>Exercise:
              <input type="text" placeholder="Exercise..." onChange={(event)=>{
                setExerciseName(event.target.value);
            }}/>
          </p>
          <input type="number" placeholder="Set..." onChange={(event)=>{setExerciseSet(event.target.value as unknown as number);}}/>
          <input type="number" placeholder="Reps..." onChange={(event)=>{setExerciseReps(event.target.value as unknown as number);}}/>
          <button  name="Close" onClick={exitModal}>Close</button>
          <CreateButton name="Add Entry" onClick={createExercise}/>
        </form> 
        </dialog>
      </div>
    </div>
    <div className="exerciseList">
      {
        exerciseList.map((exercise)=>{
          return(
          <div key={exercise._id}>
          <ExerciseDisplay  name={exercise.name} set={exercise.set} reps={exercise.reps} date={exercise.date} />
          <CreateButton name="&#10006;" onClick={()=>{
            deleteExercise(exercise._id);
          }} />
          </div>
        ); 
      })
        }
    </div>
    </>
  );
}

export default App;

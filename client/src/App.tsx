import "./App.css";
import { useState, useEffect, useRef,} from "react";
import Axios from 'axios'
import ExerciseDisplay from "./components/ExerciseDisplay.tsx";
import CreateButton from "./components/CreateButton.tsx"
function App(){
  const [exerciseList, setExerciseList] = useState<any[]>([]);
  const [nameError, setNameError] = useState<boolean>();
  const [setError, setSetError] = useState<boolean>();
  const [repsError, setRepsError] = useState<boolean>();
  const inputName = useRef("");
  const inputSet = useRef();
  const inputReps = useRef();
  useEffect(()=>{
  Axios.get("http://localhost:3001/getExercises").then((response)=>{
    setExerciseList(response.data);
  });
  },[]);                                                        

  const createExercise = ()=>{
     Axios.post("http://localhost:3001/createExercise",{name: inputName.current, set: inputSet.current as unknown as number, reps:inputName.current as unknown as number, date:new Date()}).then((res)=>{
    })
  }        
  const textToRef = (text:string, ref:any) =>{
    ref.current =+ text;
  }
  const exitModal = () =>{
    if(modal!=null){
      event?.preventDefault();
      modal.close();
      setNameError(false);
      setSetError(false);
      setRepsError(false);
    }
  }
  const deleteExercise = (id:string) =>{
    Axios.post("http://localhost:3001/deleteExercise",{_id:id}).then((res)=>{
      setExerciseList(exerciseList.filter((exercise)=>{return exercise._id !== id}));
    });
  }

  const validateName = () =>{
    return (inputName.current.length != 0)? true:  false;
  }

  const validateSet = () =>{
    return (inputSet.current as unknown as number > 0)? true: false;
  }
  
  const validateReps = () =>{
    return (inputReps.current as unknown as number >  0)? true: false;
  }

  const validateForm = () =>{
    let errorCount = 0;
    
    if(validateName()){
      errorCount;
      setNameError(false);
    }else{
      errorCount++;
      setNameError(true);
    }
    if(validateSet()){
      errorCount;
      setSetError(false);
    }else{
      errorCount++;
      setSetError(true);
    }
    if(validateReps()){
      errorCount;
      setRepsError(false);
    }else{
      errorCount++;
      setRepsError(true);
    }
    
    if (errorCount < 1){
      createExercise();
    }else{
      event?.preventDefault();
      alert("There are form errors, please check if they're correct.");
    }
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
          <article>  
            <p>Exercise:
                  <input type="text" placeholder="Exercise..." onChange={(e)=>{textToRef(e.target.value, inputName)}}/>
                  {(nameError)?<span className="error-valid">Name is not valid, please try again</span>:<></>}
            </p>
            <p>Sets:
                <input type="number" placeholder="Set..." onChange={(e)=>{textToRef(e.target.value, inputSet)}}/>
                  {(setError)?<span className="error-valid">Set number is not valid, please try again</span>:<></>}
            </p>
            <p>Reps:
            <input type="number" placeholder="Reps..." onChange={(e)=>{textToRef(e.target.value, inputReps)}}/>
                  {(repsError)?<span className="error-valid">Rep number is not valid, please try again</span>:<></>}
            </p>
            <footer>
              <CreateButton name="&#10006;" onClick={exitModal}/>
              <CreateButton name="Add Entry" onClick={validateForm}/>
            </footer>
          </article>
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

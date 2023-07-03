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
  const [visibleModal, setVisibleModal] = useState<string>();
  const [dateSelect, setDateSelect] = useState<Date>();
  const [messageModal, setMessageModal] = useState<string>();
  const inputName = useRef<string>("");
  const inputSet = useRef<number>();
  const inputReps = useRef<number>();

  useEffect(()=>{
  Axios.get("http://localhost:3001/getExercises").then((response)=>{
    setExerciseList(response.data);
  });
  },[]);                                                        

  const createExercise = ()=>{
    Axios.post("http://localhost:3001/createExercise",{name: inputName.current, set: inputSet.current as unknown as number, reps:inputReps.current as unknown as number, date:new Date()}).then((res)=>{
    })
  }        
  const textToRef = (text:string, ref:any) =>{
    ref.current = text;
  }
  const exitModal = () =>{
    if(modal!=null){
      event?.preventDefault();
      modal.close();
      setVisibleModal("none");
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

  const getExerciseOnDate = (date:Date) =>{
    if(date != undefined){
      Axios.post("http://localhost:3001/getExercisesOnDate",{date:date}).then((res)=>{
        if(res.data.length==0){
          setMessageModal("There is no exercise in " + dateSelect); 
          noExerToday.show();
          noExerToday.style.opacity = 1 as unknown as string;
          Axios.get("http://localhost:3001/getExercises").then((response)=>{
              setExerciseList(response.data);
          });
          noExerClose();
        }else{
          setExerciseList(res.data);
        }
      }).catch((err)=>{
        console.log(err);
      })
    }else{
      setMessageModal("Date is undefined, please try again"); 
      noExerToday.show();
      noExerToday.style.opacity = 1 as unknown as string;
      Axios.get("http://localhost:3001/getExercises").then((response)=>{
        setExerciseList(response.data);
      });
      noExerClose();
    }
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
    }
  }
  const modal = document.querySelector("[data-modal]") as HTMLDialogElement | null;
  const noExerToday = document.querySelector(".noExerciseTodayModal") as HTMLDialogElement;

  const noExerClose = () =>{
    setTimeout(()=>{
      const fadeInterval = setInterval(()=>{
        let opacity = parseFloat(noExerToday.style.opacity);
        if(opacity > 0){
          opacity -= 0.1;
          noExerToday.style.opacity = opacity.toString();
        }else{
            clearInterval(fadeInterval);
          }
        }
    , 50);
      setTimeout(()=>{clearInterval(fadeInterval);}, 1000);
    },5000);
    if(noExerToday.style.opacity as unknown as number == 0){
      noExerToday.close();
    }
  }

  return(
  <>
    <div className="appHeader">
      <div className="exerciseHeader" >
        <h1>Exercise Tracker</h1>
        <CreateButton borderRadius="30px" backgroundColor="#d07cd0" fontColor="#6b3696" borderColor="#956eb5" name="Create an Exercise" onClick={()=>{
            if(modal!=null){
              modal.showModal();
                setVisibleModal("flex");
          }}}/>
        <div className="dateSelectorDiv">
          <input type="date" className="dateSelector" onChange={(e)=>{setDateSelect(e.target.value as unknown as Date)} }/>
          <CreateButton name="select" onClick={()=>{getExerciseOnDate(dateSelect as unknown as Date)}} borderRadius="30px" backgroundColor="#d07cd0" fontColor="#6b3696" borderColor="#956eb5"/>
        </div>
      </div>
    </div>
    <div className="modalDiv">
      <dialog  data-modal className="data-modal" style={{display:visibleModal}}>
        <form className="modalBody">
          <article>  
            <p>Exercise:
              {(nameError)?<>
              <input type="text" style={{borderColor:"red"}} placeholder="Exercise..." onChange={(e)=>{textToRef(e.target.value, inputName)}}/>
              <span className="error-valid">Name is not valid, please try again</span>
              </>:<>
              <input type="text" style={{borderColor:"#6b3696"}} placeholder="Exercise..." onChange={(e)=>{textToRef(e.target.value, inputName)}}/>
              </>}
            </p>
            <p>Sets:
            {(setError)?<>
              <input type="number" style={{borderColor:"red"}} placeholder="Set..." onChange={(e)=>{textToRef(e.target.value, inputSet)}}/>
              <span className="error-valid">Number is not valid, please try again</span>
              </>:<>
              <input type="number" style={{borderColor:"#6b3696"}} placeholder="Set..." onChange={(e)=>{textToRef(e.target.value, inputSet)}}/>
            </>}
            </p>
            <p>Reps:
              {(repsError)?<>
              <input style={{borderColor:"red"}} type="number" placeholder="Reps..." onChange={(e)=>{textToRef(e.target.value, inputReps)}}/>
              <span className="error-valid">Number is not valid, please try again</span>
              </>:<>
              <input style={{borderColor:"#6b3696"}} type="number" placeholder="Reps..." onChange={(e)=>{textToRef(e.target.value, inputReps)}}/>
              </>}
            </p>
            <footer className="exitModalFooter">
              <CreateButton borderRadius="10px" backgroundColor="#d07cd0" fontColor="#6b3696" borderColor="#956eb5" floatPos="left" name="Cancel" onClick={exitModal}/>
            </footer>
            <footer className="addEntryFooter">
              <CreateButton borderRadius="10px" backgroundColor="#d07cd0" fontColor="#6b3696" borderColor="#956eb5" floatPos="right" name="Add Entry" onClick={validateForm}/>
            </footer>
          </article>
        </form> 
      </dialog>
      <div className="noExerModalContainer">
        <dialog className="noExerciseTodayModal" style={{opacity:"1"}}>
            <p>{messageModal}</p>
        </dialog>
      </div>
    </div>
    <div className="exerciseContainer">
      <div className="exerciseList">
        {
          exerciseList.map((exercise)=>{
            return(
            <div key={exercise._id} className="exerciseDiv">
            <CreateButton borderRadius="20px" backgroundColor="#d07cd0" fontColor="#6b3696" borderColor="#956eb5" name="&#10006;" floatPos="right" onClick={()=>{
              deleteExercise(exercise._id);
            }} />
            <ExerciseDisplay  name={exercise.name} set={exercise.set} reps={exercise.reps} date={exercise.date} />
            </div>
          ); 
        })
          }
      </div>
    </div>
    </>
  );
}

export default App;

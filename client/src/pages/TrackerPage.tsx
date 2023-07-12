import "./TrackerPage.css";
import { useState, useEffect, useRef,} from "react";
import Axios from 'axios'
import ExerciseDisplay from "../components/ExerciseDisplay.tsx";
import CreateButton from "../components/CreateButton.tsx"
import { RingLoader } from "react-spinners";
function TrackerPage(){
  const [exerciseList, setExerciseList] = useState<any[]>([]);
  const [nameError, setNameError] = useState<boolean>();
  const [setError, setSetError] = useState<boolean>();
  const [repsError, setRepsError] = useState<boolean>();
  const [visibleModal, setVisibleModal] = useState<string>();
  const [dateSelect, setDateSelect] = useState<Date>();
  const [messageModal, setMessageModal] = useState<string>();
  const [createOrUpdate, setCreateOrUpdate] = useState<string>();
  const [updateID, setUpdateId] = useState<string>();
  const [deleteID, setDeleteId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const inputName = useRef<string>("");
  const inputSet = useRef<number>();
  const inputReps = useRef<number>();

  useEffect(()=>{
    fetchData();
  },[]);                                                        

  const fetchData = async () =>{
    setLoading(true);
    await Axios.get("https://exercise-tracker-x05u.onrender.com/getExercises").then((response)=>{
      setExerciseList(response.data);
    });
    setLoading(false);
  }
  // Updating useRefs to text box (might not be that good of a solution tbh)
  const textToRef = (text:string, ref:any) =>{
    ref.current = text;
  }
  // axios functions
  const createExercise = ()=>{
    Axios.post("https://exercise-tracker-x05u.onrender.com/createExercise",{name: inputName.current, set: inputSet.current as unknown as number, reps:inputReps.current as unknown as number, date:new Date()}).then(()=>{
    })
  }        

  const deleteExercise = (id:string) =>{
    Axios.post("https://exercise-tracker-x05u.onrender.com/deleteExercise",{_id:id}).then(()=>{
      setExerciseList(exerciseList.filter((exercise)=>{return exercise._id !== id}));
    });
  }

  const getExerciseOnDate = (date:string) =>{
    if(date!=undefined && date != ""){
      Axios.post("https://exercise-tracker-x05u.onrender.com/getExercisesOnDate",{date:date}).then((res)=>{
        if(res.data.length==0){
          setMessageModal("There is no exercise in " + dateSelect); 
          noExerToday.show();
          noExerToday.style.opacity = 1 as unknown as string;
          fetchData();
          noExerClose();
        }else{
          setExerciseList(res.data);
        }
      }).catch((err)=>{
        console.log(err);
      })
    }else{
      setMessageModal("Date is undefined, please try again"); 
      noExerToday.style.opacity = 1 as unknown as string;
      noExerToday.show();
      fetchData();
      noExerClose();
    }
  }
  const editExercise = async (id:string) =>{
    await Axios.post("https://exercise-tracker-x05u.onrender.com/getExerciseById",{_id:id}).then((res)=>{
      const exerRes = res.data[0];
      const nameBox = document.querySelector("#nameInputBox");
      const setBox = document.querySelector("#setInputBox");
      const repsBox = document.querySelector("#repsInputBox");
      textToRef(exerRes.name, inputName);
      nameBox?.setAttribute("value", exerRes.name);
      textToRef(exerRes.set, inputSet);
      setBox?.setAttribute("value", exerRes.set);
      textToRef(exerRes.reps, inputReps);
      repsBox?.setAttribute("value", exerRes.reps);
      setUpdateId(exerRes._id);
      setCreateOrUpdate("Update");
      modal?.showModal();
      setVisibleModal("flex");
    })
  }

  const updateExercise = () => {
    Axios.put("https://exercise-tracker-x05u.onrender.com/editExercise", {_id:updateID, name:inputName.current, set:inputSet.current, reps: inputReps.current}).then(()=>{

    })
  }
  // Validation Functions
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
      if(createOrUpdate == "Create"){
        createExercise();
      }if(createOrUpdate == "Update"){
        updateExercise();
        console.log("Update Sent")
      }
    }else{
     event?.preventDefault();
    }
  }

  const exitCreationModal = () =>{
    if(modal!=null){
      event?.preventDefault();
      modal.close();
      setVisibleModal("none");
      setNameError(false);
      setSetError(false);
      setRepsError(false);
    }
  }

  // Modal Declaration
  const modal = document.querySelector("[data-modal]") as HTMLDialogElement | null;
  const noExerToday = document.querySelector(".noExerciseTodayModal") as HTMLDialogElement;
  const deletionModal = document.getElementById("deleteConfirmationModal") as HTMLDialogElement; 

  // Modal Functions
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
    },1000);
    if(noExerToday.style.opacity as unknown as number == 0){
      noExerToday.close();
    }
  }

  const openDeletionModal = (id:string) =>{
    setDeleteId(id);
    deletionModal.showModal();
  }
  return(
  <>
    <div className="appHeader">
      <div className="exerciseHeader" >
        <h1>Exercise Tracker</h1>
        <CreateButton borderRadius="30px" backgroundColor="#d07cd0" fontColor="#6b3696" borderColor="#956eb5" name="Create an Exercise" onClick={()=>{
            if(modal!=null){
              setCreateOrUpdate("Create");
              modal.showModal();
              setVisibleModal("flex");
          }}}/>
        <div className="dateSelectorDiv">
          <input type="date" className="dateSelector" required onChange={(e)=>{setDateSelect(e.target.value as unknown as Date)} }/>
          <CreateButton name="select" onClick={()=>{getExerciseOnDate(dateSelect as unknown as string)}} borderRadius="30px" backgroundColor="#d07cd0" fontColor="#6b3696" borderColor="#956eb5"/>
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
              <input type="text" id="nameInputBox" style={{borderColor:"#7b3696"}} placeholder="Exercise..." onChange={(e)=>{textToRef(e.target.value, inputName)}}/>
              </>}
            </p>
            <p>Sets:
            {(setError)?<>
              <input type="number" style={{borderColor:"red"}} placeholder="Set..." onChange={(e)=>{textToRef(e.target.value, inputSet)}}/>
              <span className="error-valid">Number is not valid, please try again</span>
              </>:<>
              <input type="number" id="setInputBox" style={{borderColor:"#6b3696"}} placeholder="Set..." onChange={(e)=>{textToRef(e.target.value, inputSet)}}/>
            </>}
            </p>
            <p>Reps:
              {(repsError)?<>
              <input style={{borderColor:"red"}} type="number" placeholder="Reps..." onChange={(e)=>{textToRef(e.target.value, inputReps)}}/>
              <span className="error-valid">Number is not valid, please try again</span>
              </>:<>
              <input style={{borderColor:"#6b3696"}} id="repsInputBox" type="number" placeholder="Reps..." onChange={(e)=>{textToRef(e.target.value, inputReps)}}/>
              </>}
            </p>
            <footer className="exitModalFooter">
              <CreateButton borderRadius="10px" backgroundColor="#d07cd0" fontColor="#6b3696" borderColor="#956eb5" floatPos="left" name="Cancel" onClick={exitCreationModal}/>
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
        <div>
          <dialog id="deleteConfirmationModal">
            <p>Are you sure you want to delete this entry?</p>
              <CreateButton borderRadius="10px" backgroundColor="#d07cd0" fontColor="#6b3696" borderColor="#956eb5" floatPos="right" name="Delete" onClick={()=>{
              deleteExercise(deleteID as unknown as string);
              deletionModal.close();
            }}/>
              <CreateButton borderRadius="10px" backgroundColor="#d07cd0" fontColor="#6b3696" borderColor="#956eb5" floatPos="left" name="Close" onClick={()=>{
              event?.preventDefault();
              deletionModal.close();
            }}/>
          </dialog>
        </div >
    </div>
    <div className="exerciseContainer">
      <div className="exerciseList">
          {loading && (
            <div>
              <RingLoader color="#6b3696" loading={loading} size={50}/>
            </div>
          )}
        {
          exerciseList.map((exercise)=>{
            return(
            <div key={exercise._id} className="exerciseDiv">
            <CreateButton borderRadius="20px" backgroundColor="#d07cd0" fontColor="#6b3696" borderColor="#956eb5" name="&#10006;" floatPos="right" onClick={()=>{
              openDeletionModal(exercise._id);
            }} />
            <ExerciseDisplay  name={exercise.name} set={exercise.set} reps={exercise.reps} date={exercise.date} />
            <CreateButton borderRadius="20px" backgroundColor="#d07cd0" fontColor="#6b3696" borderColor="#956eb5" name="&#10006;" floatPos="right" onClick={()=>{
              editExercise(exercise._id);
            }} />
            </div>
          ); 
        })
          }
      </div>
    </div>
    </>
  );
}

export default TrackerPage;

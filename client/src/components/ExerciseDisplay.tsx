import "./ExerciseDisplay.css"
interface Props{
  name: string;
  set: number;
  reps: number;
  date: Date;
}

const ExerciseDisplay = ({name, set, reps, date}:Props) =>{
  return(
    <>
      
        <h3>Exercise: {name}</h3>
        <h3>Sets: {set}</h3>
        <h3>Reps: {reps}</h3>
        <h3>Date: {date.split('T').shift()}</h3>
    </>
  )
}

export default ExerciseDisplay;

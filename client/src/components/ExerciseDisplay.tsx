
interface Props{
  name: string;
  set: number;
  reps: number;
  date: Date;
}

const ExerciseDisplay = ({name, set, reps, date}:Props) =>{
  return(
    <>
      
        <h1>Exercise: {name}</h1>
        <h1>Sets: {set}</h1>
        <h1>Reps: {reps}</h1>
        <h1>Date: {date.split('T').shift()}</h1>
    </>
  )
}

export default ExerciseDisplay;


interface Props{
  name:string;
  onClick:() => void;
}

const CreateButton = ({name, onClick}:Props) =>{
  return(
    <button onClick={onClick}>{name}</button>
  );
}


export default CreateButton;







interface Props{
  name:string;
  onClick:() => void;
  borderRadius?:string;
  backgroundColor?:string;
  fontColor?:string;
  borderColor?:string;
  floatPos?:string | any;
}

const CreateButton = ({name, onClick, borderRadius, backgroundColor, fontColor, borderColor, floatPos}:Props) =>{
  return(
    <button style={{borderRadius:borderRadius,backgroundColor:backgroundColor, color:fontColor, borderColor:borderColor,float:floatPos,position:"static"}}onClick={onClick}>{name}</button>
  );
}


export default CreateButton;







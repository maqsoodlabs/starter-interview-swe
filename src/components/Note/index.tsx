import { LoginStatus } from "../Login/authslice";
import useNoteUpdate from "./note.hooks";

export function Note() {
  const {authStatus,note,setNote, online} = useNoteUpdate()
  
  if (authStatus !== LoginStatus.LOGGED_IN) return null;
  
  return (
    <div>
      <NoteField note = {note} setNote= {setNote} />
      {online?(<p style={{color:'green'}}>Online</p>):(<p style={{color:'red'}}>Offline</p>)}
    </div>
  );
}


function NoteField(props: {note : string|undefined, setNote: (arg0: string) => void}) {
  return <textarea value={props.note} onChange={(e)=>props.setNote?.(e.target.value||'')}></textarea>;
}

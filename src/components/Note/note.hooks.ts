
import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../Login/authslice";
import { User } from "../../models";
import { LoginStatus } from "../Login/authslice";

import * as _ from "lodash";

const saveNote = async (user:User,note:string|undefined,apiToken:string|undefined ) => {
  const userData = {...user, note}
  console.log("****************sending request out ***********************", note)

  /**TODO: error handling, get a callback which is called in case of error to report to user. */
  await fetch(
  `https://60b793ec17d1dc0017b8a6bc.mockapi.io/users/${user.id}`,
    {
      method: "PUT",
      headers: { "content-type": "application/json", "Authorization": "Bearer " + apiToken},
      body: JSON.stringify(userData),
    }
  );
} 

const debouncedNoteSave =  _.debounce(saveNote, 1000)

const useNoteUpdate = () =>{
  const {status, apiToken,user} = useAppSelector(selectAuth);
  const [note, setNote] = useState(user?.note);
  const [online, setOnline] = useState(true);

  useEffect(()=>{
    if(user && apiToken && online){
      console.log("bouncing")
      debouncedNoteSave(user,note, apiToken);
    }
    //TODO: checks for reducing unnecessary API calls although we have throttling in place (debouncing) but still. 
  },[apiToken, note, user,online])

  useEffect(()=>{
    if(status === LoginStatus.LOGGED_IN){
      setNote(user?.note)
    }
  },[status,user])

  useEffect(() => {
    function changeStatus() {
      console.log("network status", navigator.onLine);
      /** TODO: should revalidate auth token */ 
      setOnline(navigator.onLine);
    }
    window.addEventListener("online", changeStatus);
    window.addEventListener("offline", changeStatus);
    return () => {
      window.removeEventListener("online", changeStatus);
      window.removeEventListener("offline", changeStatus);

      /**cancel the debounce in case */
      debouncedNoteSave.cancel();
    };
  }, []);
  return {authStatus: status, note,setNote,online}
}

export default useNoteUpdate;
import { useContext } from "react";
import { DeviceWidthContext } from "../../context/deviceWidthContext";

import TextEditor from "./TextEditor";
import NoteDetailsFormSmall from "./NoteDetailsSmall";
import NoteDetailsForm from "./NoteDetailsForm";
function WriteNote() {
  const width = useContext(DeviceWidthContext);
  return (
    <>
      <TextEditor />
      {width > 1200 ? <NoteDetailsForm/> : <NoteDetailsFormSmall />}
    </>
  );
}

export default WriteNote;

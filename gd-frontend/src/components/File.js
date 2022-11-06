import { useRef, useState } from "react";
import "./File.css";
import { useOutsideClick } from "../hooks/useOutsideClick";

const File = (props) => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [rmenuOpen, setRMenuOpen] = useState(false);
    const [rmenuPos, setRMenuPos] = useState([0, 0]);
    const [renameMode, setRenameMode] = useState(false);
    const [fileName, _setFileName] = useState({initial: props.info.name, current: props.info.name});

    const fileNameRef = useRef(fileName);

    const ref = useOutsideClick((e) => {
        // console.log(e.target);
        // console.log(textBox.current);
        setMenuOpen(false);
        // console.log(e.target)
        setRMenuOpen(false);
        // console.log(textBox.current);
        // if(renameModeRef.current && (e.target !== textBox.current)) {
        //     console.log("yems rename");
        //     renameFile(e);
        // }
    });

    const refText = useOutsideClick((e) => {
        // if(renameMode) {
            exitRenameMode(e);
        // }
    });

    
    // function that ensures setFileName changes value of state as well as that of similarly named ref 
    // (trick to ensure value of state does not freeze inside setEventListener)
    const setFileName = (val) => {
        // console.log(`val passed to function; ${val}`);
        fileNameRef.current = val;
        // console.log(`rename mode ref modified: ${fileNameRef.current}`);
        _setFileName(val);
    }
    
    const menuOpenClose = (e) => {
        // console.log(e);
        setMenuOpen(!menuOpen);
        // e.stopPropagation();
    }


    const exitRenameMode = (e) => {
        console.log("Exiting rename mode");

        // prevent default behaviour of submitting form 
        // (the rename textbox 'form' does not have a submit button, but pressing
        // enter after changing the name defaults to submitting the form)
        e.preventDefault();
        
        // console.log(`File Name inside event listener: ${fileName}`);
        // console.log(`FileNameRef: ${fileNameRef.current}`);

        console.log(`Initial file name: ${fileName.initial}`);
        console.log(`Current file name: ${fileName.current}`);
        console.log(`FileRef file name: ${fileNameRef.current.current}`);

        setRenameMode(false);
        
        // if filename has actually been changed
        if(fileNameRef.current.current !== fileName.initial) {
            alert("File name changed");
            console.log(fileName.current);

            // TODO: first make sure there is no duplicate file by sending appropriate GET request
            
            // Send rename request to server
            
            fetch(`/renamefile`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    id: props.info._id,
                    newFileName: fileNameRef.current.current
                })
            })
            .then((res) => {
                if(res.error) {
                    console.log(`ERROR: ${res.error}`);
                }
                console.log("Renamed file");
    
                // set 'initial' file name to be the new name
                setFileName({
                    ...fileNameRef.current,
                    initial: fileNameRef.current.current
                });
            })
        }
    };

    const enterRenameMode = (e) => {  
        // close side menu
        setMenuOpen(false);
        
        // we use renameModeRef instead of the renameModeState. This is because 
        // we also use this function inside the window click listener. The value 
        // of the renameMode state freezes inside window event listeners and 
        // cannot be changed, and for some reason, the same applies to functions 
        // defined outside the event listener but called by the event listeners
        // from inside.
        // TL;DR: we use ref cuz regular state doesn't work with window event listener
        
        setRenameMode(true);
        
        e.stopPropagation();

    }

    const deleteFile = () => {
        if(window.confirm("Do you want to delete this file?")) {
            // console.log("true");
            fetch(`/deletefile/${props.info._id}`, {
                method: "DELETE",
            })
            .then(() => {
                console.log("Deleted file");
                alert("File deleted");
                props.setDependencies(true); // to force reload of home page
            })
            .catch((err) => {
                console.log("ERROR deleting file: " + err);
            });
        }
    }

    return ( 
        <div className="fileItem" onContextMenu={(e) => {
            // console.log(e);
            e.preventDefault();
            setRMenuPos([e.pageX, e.pageY]);
            setRMenuOpen(true);
        }
        }>
            <form onSubmit={exitRenameMode}>
            <div className="fileName">
                <span className="nameText">
                    {!renameMode && fileName.current}
                </span>
                {renameMode && <input 
                    type="text" 
                    name="fileName" 
                    id="fileNameInput" 
                    value={fileName.current}
                    ref={refText}
                    onChange={(e) => {setFileName({...fileName, current: e.target.value})}}
                />}
                <span className="nameText">
                    {props.info.type}
                </span>
            </div>
            </form>
            {/* <div className="fileType">
                {props.info.type}
            </div> */}
            <div className="fileMenu">
                <i className="bi bi-three-dots-vertical" ref={ref} onClick={menuOpenClose}></i>
                {/* <i className="material-icons">more_vert</i> */}
                {menuOpen && <div className="menu" onClick={(e) => e.preventDefault()}>
                    <ul>
                        <li onClick={enterRenameMode}>Rename</li>
                        <hr />
                        <li onClick={deleteFile}>Delete</li>
                    </ul>
                </div>}
                <div className="menu rightClickMenu" style={{display: (rmenuOpen ? "block" : "none"), left: rmenuPos[0], top: rmenuPos[1]}}>
                    <ul>
                        <li>Rename</li>
                        <hr />
                        <li onClick={deleteFile}>Delete</li>
                    </ul>
                </div>
            </div>
        </div>
     );
}
 
export default File;
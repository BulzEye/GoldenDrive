import { useEffect, useRef, useState } from "react";
import "./File.css";

const File = (props) => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [rmenuOpen, setRMenuOpen] = useState(false);
    const [rmenuPos, setRMenuPos] = useState([0, 0]);
    const [renameMode, _setRenameMode] = useState(false);
    const renameModeRef = useRef(renameMode);
    const [fileName, setFileName] = useState({initial: props.info.name, current: props.info.name});
    const textBox = useRef(null);

    const setRenameMode = (val) => {
        console.log(`val passed to function; ${val}`);
        renameModeRef.current = val;
        console.log(`rename mode ref modified: ${renameModeRef.current}`);
        _setRenameMode(val);
    }

    const menuOpenClose = (e) => {
        // console.log(e);
        setMenuOpen(!menuOpen);
        e.stopPropagation();
    }

    useEffect(() => {
        window.addEventListener("click", (e) => {
            // console.log(e.target);
            // console.log(textBox.current);
            setMenuOpen(false);
            setRMenuOpen(false);
            console.log(`Rename Mode inside event listener: ${renameMode}`);
            console.log(`RenameModeRef: ${renameModeRef.current}`);
            console.log(e.target)
            console.log(textBox.current);
            if(renameModeRef.current && (e.target !== textBox.current)) {
                console.log("yems rename");
                renameFile(e);
            }
        });
    }, []);

    const renameFile = (e) => {
        // prevent default behaviour of submitting form 
        // (the rename textbox 'form' does not have a submit button, but pressing
        // enter after changing the name defaults to submitting the form)
        e.preventDefault();

        
        // close side menu
        setMenuOpen(false);
        
        // we use renameModeRef instead of the renameModeState. This is because 
        // we also use this function inside the window click listener. The value 
        // of the renameMode state freezes inside window event listeners and 
        // cannot be changed, and for some reason, the same applies to functions 
        // defined outside the event listener but called by the event listeners
        // from inside.
        // TL;DR: we use ref cuz regular state doesn't work with window event listener
        
        console.log(`Rename mode: ${renameModeRef.current}`);
        setRenameMode(!(renameModeRef.current));
        
        // e.stopPropagation();

        console.log(`Initial file name: ${fileName.initial}`);
        console.log(`Current file name: ${fileName.current}`);
        
        // if filename has actually been changed
        if(fileName.current !== fileName.initial) {
            alert("File name changed");
            console.log(fileName.current);
            
            // Send rename request to server
            
            fetch(`/renamefile`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    id: props.info._id,
                    newFileName: fileName.current
                })
            })
            .then((res) => {
                if(res.error) {
                    console.log(`ERROR: ${res.error}`);
                }
                console.log("Renamed file");

                // set 'initial' file name to be the new name
                setFileName({
                    ...fileName,
                    initial: fileName.current
                });
            })
        }
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
            <form onSubmit={renameFile}>
            <div className="fileName">
                <span className="nameText">
                    {!renameMode && fileName.current}
                </span>
                {renameMode && <input 
                    type="text" 
                    name="fileName" 
                    id="fileNameInput" 
                    value={fileName.current}
                    ref={textBox}
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
                <i className="bi bi-three-dots-vertical" onClick={menuOpenClose}></i>
                {/* <i className="material-icons">more_vert</i> */}
                {menuOpen && <div className="menu" onClick={(e) => e.preventDefault()}>
                    <ul>
                        <li onClick={renameFile}>Rename</li>
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
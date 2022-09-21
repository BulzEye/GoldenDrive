import { useState } from "react";
import "./File.css";

const File = (props) => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [rmenuOpen, setRMenuOpen] = useState(false);
    const [rmenuPos, setRMenuPos] = useState([0, 0]);
    const [renameMode, setRenameMode] = useState(false);
    const [fileName, setFileName] = useState({initial: props.info.name, current: props.info.name});

    const menuOpenClose = (e) => {
        setMenuOpen(!menuOpen);
        e.stopPropagation();
    }

    document.addEventListener("click", () => {setMenuOpen(false); setRMenuOpen(false)});

    const renameFile = () => {
        setFileName({
            ...fileName,
            initial: fileName.current
        })
        setRenameMode(!renameMode);
        if(fileName.current !== fileName.initial) {
            alert("File name changed");
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
            console.log(e);
            e.preventDefault();
            setRMenuPos([e.pageX, e.pageY]);
            setRMenuOpen(true);
        }
        }>
            <form>
            <div className="fileName">
                <span className="nameText">
                    {!renameMode && fileName.current}
                </span>
                {renameMode && <input 
                    type="text" 
                    name="fileName" 
                    id="fileNameInput" 
                    value={fileName.current}
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
                {menuOpen && <div className="menu">
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
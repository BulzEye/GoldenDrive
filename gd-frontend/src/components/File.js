import { useState } from "react";
import "./File.css";

const File = (props) => {

    const [menuOpen, setMenuOpen] = useState(false);

    const menuOpenClose = (shouldOpen) => {
        if(shouldOpen) {
            setMenuOpen(true);
        }
        else {
            setMenuOpen(false);
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
        <div className="fileItem">
            <div className="fileList">
                <div className="fileName">
                    {props.info.name}
                </div>
                {/* <div className="fileType">
                    {props.info.type}
                </div> */}
                <div className="fileMenu">
                    <i className="bi bi-three-dots-vertical"></i>
                    {/* <i className="material-icons">more_vert</i> */}
                    <div className="menu">
                        <ul>
                            <li>Rename</li>
                            <hr />
                            <li onClick={deleteFile}>Delete</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default File;
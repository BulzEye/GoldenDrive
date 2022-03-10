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
                            <li>Delete</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default File;
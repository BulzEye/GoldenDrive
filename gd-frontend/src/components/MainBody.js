import { useEffect, useState } from "react";
import File from "./File";
import FileUpload from "./FileUpload";
import "./MainBody.css";

const MainBody = () => {
    // let files = [
    //         {
    //       name: "testfile",
    //       type: ".txt"
    //     },
    //     {
    //       name: "vidnew",
    //       type: ".mp4"
    //     }
    // ];

    const [files, setFiles] = useState([]);

    useEffect(() => {
      fetch("/allFiles")
      .then(res => res.json())
      .then((recdFiles) => {
        setFiles(recdFiles);
      });
    }, []);

    return ( 
        <div className="mainBody">
            { files.map((file) => (<File info={file} menuOpen={false}/>)) }
            {/* <File info={}/> */}
            <FileUpload />
        </div>
     );
}
 
export default MainBody;
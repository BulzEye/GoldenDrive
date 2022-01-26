import { useState } from "react";

const FileUpload = () => {
    const [file, setFile] = useState(null);

    // TODO: change it so that file is uploaded immediately after it is selected

    let uploadFile = (event) => {
        console.log(event.target);
        const files = event.target.files;
        const formData = new FormData();
        formData.append('myFile', files[0]);
        setFile(formData);
    }

    let submitFile = () => {
        fetch("/upload", {
            method: "POST",
            body: file
        })
        .then(() => {
            console.log("Uploaded file");
        })
        .catch((err) => {
            console.log("ERROR uploading file: " + err);
        });
    }

    return ( 
        <div className="upload">
            <input type="file" name="fileUpload" id="file" onChange={uploadFile}/>
            <button onClick={submitFile}>Upload File</button>
        </div>
     );
}
 
export default FileUpload;
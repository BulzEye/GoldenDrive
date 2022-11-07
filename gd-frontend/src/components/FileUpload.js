// import { useState } from "react";
import "./FileUpload.css"

const FileUpload = (props) => {
    // const [file, setFile] = useState(null);

    // TODO: change it so that file is uploaded immediately after it is selected

    let uploadFile = (event) => {
        // console.log(event.target);
        const files = event.target.files;
        const formData = new FormData();
        formData.append('myFile', files[0]);
        // setFile(formData);
        // console.log(files[0]);
        fetch(`/uploadCheck/${files[0].name}`)
        .then((res) => res.json())
        .then((response) => {
            console.log(response);
            if(response.isUnique) {
                // fetch file
                console.log("File name unique");
                fetch("/upload", {
                    method: "POST",
                    body: formData
                })
                .then((res) => {
                    console.log("Uploaded file");
                    // console.log(res);
                    if(res.status === 200) {
                        alert("File uploaded");
                    }
                    else {
                        alert(`ERROR ${res.status}: ${res.statusText}`);
                    }
                })
                .catch((err) => {
                    console.log("ERROR uploading file: " + err);
                });
            }
            else {
                // display prompt, do further actions
                console.log("File name not unique");
                let shouldDuplicate = window.confirm("A file with a similar name exists!\nDo you want to keep both files or replace the existing file with the new one?\nPress 'OK' to keep both, or 'Cancel' to replace");
                formData.append("shouldDuplicate", shouldDuplicate);
                // send the response to the server
                fetch("/upload", {
                    method: "POST",
                    body: formData
                })
                .then((res) => {
                    console.log("Uploaded file");
                    console.log(res);
                    if(res.status === 200) {
                        alert("File uploaded");
                    }
                    else {
                        alert(`ERROR ${res.status}: ${res.statusText}`);
                    }
                })
                .catch((err) => {
                    console.log("ERROR uploading file: " + err);
                });
            }
            props.setDependencies(true);
        });
    }

    // let submitFile = () => {
    //     fetch("/upload", {
    //         method: "POST",
    //         body: file
    //     })
    //     .then(() => {
    //         console.log("Uploaded file");
    //     })
    //     .catch((err) => {
    //         console.log("ERROR uploading file: " + err);
    //     });
    // }

    return ( 
        <div className="upload">
            <label htmlFor="fileUpload"><i className="bi bi-arrow-up-short"></i></label>
            <input type="file" name="fileUpload" id="fileUpload" onChange={uploadFile}/>
            {/* <button onClick={submitFile}>Upload File</button> */}
        </div>
     );
}
 
export default FileUpload;
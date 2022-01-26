import "./File.css";

const File = (props) => {
    return ( 
        <div className="fileList">
            <div className="fileName">
                {props.info.name}
            </div>
            <div className="fileType">
                {props.info.type}
            </div>
        </div>
     );
}
 
export default File;
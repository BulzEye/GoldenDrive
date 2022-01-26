// import logo from './logo.svg';
import './App.css';
import File from './File';
import FileUpload from './FileUpload';

function App() {

  let files = [
    {
      name: "testfile",
      type: ".txt"
    },
    {
      name: "vidnew",
      type: ".mp4"
    }
  ]
  return (
    <div className="App">
      <div className="fileContainer">
        { files.map((file) => (<File info={file} />)) }
        {/* <File info={}/> */}
      </div>
      <FileUpload />
    </div>
  );
}

export default App;

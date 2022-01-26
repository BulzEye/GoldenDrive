// import logo from './logo.svg';
import './App.css';
import File from './File';
import FileUpload from './FileUpload';

function App() {
  return (
    <div className="App">
      <div className="fileContainer">
        <File />
      </div>
      <FileUpload />
    </div>
  );
}

export default App;

import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as dcraw from "dcraw";

import "./App.css";

const MyDropZone = () => {
  const [imageURLs, setImageURLs] = useState([]);
  const onDrop = useCallback((acceptedFiles) => {
    // let imageURLs = [];
    const reader = new FileReader();
    acceptedFiles.forEach((file) => {
      reader.onabort = () => console.log("file reading aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = (function (o) {
        return function (e) {
          const buf = new Uint8Array(e.currentTarget.result);
          const thumbnail = dcraw(buf, { extractThumbnail: true });
          const blob = new Blob([thumbnail], { type: "image/jpeg" });
          const imageUrl = URL.createObjectURL(blob);
          console.log("img url", imageUrl);
          setImageURLs([...imageURLs, imageUrl]);
          // imageURLs.append(imageUrl);
          // dropzoneRef.current.innerHTML = (
          //   <div>
          //     <img src={imageUrl} />
          //   </div>
          // );
        };
      })(file);
      reader.readAsArrayBuffer(file);
    });

    // console.log("IMAGE URL ARRAY", imageURLs);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {/* <p ref={dropzoneRef}> */}
      {imageURLs.length ? (
        <div>
          {imageURLs.map((u) => (
            <img src={u} />
          ))}
        </div>
      ) : (
        <div className="dropzone white">
          <p className="f1 fw9 measure">FREE ONLINE RAW FILE VIEWER</p>
          <p className="f3">
            Simple, quick, convenient - 0 wait time
            <br />
            Remove the hassle of downloading!
          </p>
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      )}
    </div>
  );
};

function App() {
  return <div className="App">{MyDropZone()}</div>;
}

export default App;

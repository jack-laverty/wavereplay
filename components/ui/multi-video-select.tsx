import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone, FileRejection, DropzoneOptions } from 'react-dropzone';

interface MultiVideoSelectProps {
  onFilesChange: (files: File[]) => void;
}

const MultiVideoSelect: React.FC<MultiVideoSelectProps> = ({ onFilesChange }) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    const videoFiles = acceptedFiles.filter(file => file.type.startsWith('video/')) as File[];
    const updatedFiles = [...files, ...videoFiles];

    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    if (fileRejections.length > 0) {
      console.log('Rejected files:', fileRejections);
    }
  }, [files, onFilesChange]);

  const removeFile = (file: File) => {
    const updatedFiles = files.filter(f => f !== file);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'video/*': []},
  } as DropzoneOptions);

  return (
    <div className="p-4 text-xs">
      <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the video files here ...</p>
        ) : (
          <p>Drag and drop some video files here, or click to select files</p>
        )}
      </div>
      
      {files.length > 0 && (
        <div className="mt-4">
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center ">
                  <button onClick={() => removeFile(file)} className="bg-gray-100 p-2 rounded hover:text-red-500">{file.name}</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiVideoSelect;
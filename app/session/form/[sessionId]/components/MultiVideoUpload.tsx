import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection, DropzoneOptions } from 'react-dropzone';

interface FileWithPreview extends File {
  preview?: string;
}

const MultiVideoUpload: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    const videoFiles = acceptedFiles.filter(file => file.type.startsWith('video/')) as FileWithPreview[];
    const filesWithPreviews = videoFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFiles(prevFiles => [...prevFiles, ...filesWithPreviews]);
    if (fileRejections.length > 0) {
      console.log('Rejected files:', fileRejections);
    }
  }, []);

  const removeFile = (file: FileWithPreview) => {
    setFiles(prevFiles => prevFiles.filter(f => f !== file));
    URL.revokeObjectURL(file.preview || '');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'video/*': []},
  } as DropzoneOptions);

  React.useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview || ''));
  }, [files]);

  const uploadFiles = async () => {
    setUploading(true);
    const uploadPromises = files.map(file => uploadFile(file));
    await Promise.all(uploadPromises);
    setUploading(false);
    setFiles([]);
  };

  const uploadFile = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      xhr.open('POST', '/api/upload', true);
      xhr.setRequestHeader('X-File-Name', encodeURIComponent(file.name));

    //   xhr.upload.addEventListener('progress', (event) => {
    //     if (event.lengthComputable) {
    //       const progress = Math.round((event.loaded * 100) / event.total);
    //       setUploadProgress(prev => ({...prev, [file.name]: progress}));
    //     }
    //   });

      xhr.onload = () => {
        if (xhr.status === 200) {
          console.log(`${file.name} uploaded successfully`);
          resolve();
        } else {
          console.error(`Error uploading ${file.name}: ${xhr.statusText}`);
          reject(new Error(`HTTP error! status: ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        console.error(`Error uploading ${file.name}: ${xhr.statusText}`);
        reject(new Error('Network error'));
      };

      xhr.send(formData);
    });
  };

  return (
    <div className="p-4 text-sm">
      <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the video files here ...</p>
        ) : (
          <p>Drag 'n' drop some video files here, or click to select files</p>
        )}
      </div>
      
      {files.length > 0 && (
        <div className="mt-4">
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <span>{file.name}</span>
                <div className="flex items-center">
                  <button onClick={() => removeFile(file)} className="text-red-500 hover:text-red-700" disabled={uploading}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiVideoUpload;
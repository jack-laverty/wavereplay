'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Session } from '@/lib/types';
import MultiVideoSelect from './components/MultiVideoSelect';
import BackButton from './components/BackButton';

import { useForm, SubmitHandler } from "react-hook-form"

const SessionForm: React.FC = () => {
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Session>()

  function uploadSessionAndFiles(
    sessionData: Session, 
    files: File[], 
    onProgress: (progress: number) => void
  ) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
  
      formData.append('sessionData', JSON.stringify(sessionData));
      files.forEach((file) => {
        formData.append('files', file);
      });
  
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      });
  
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Upload failed'));
        }
      });
  
      xhr.addEventListener('error', () => {
        reject(new Error('Network error'));
      });
  
      xhr.open('POST', '/api/session-upload');
      xhr.send(formData);
    });
  }
  
  const onSubmit: SubmitHandler<Session> = async (sessionData) => {

    try {
      const result = await uploadSessionAndFiles(sessionData, selectedFiles, (progress) => {
        console.log(`Upload progress: ${progress}%`);
        // Update your UI with the progress here
      });
      console.log('Session created and files uploaded:', result);
      // Handle successful upload (e.g., show success message, reset form)
    } catch (error) {
      console.error('Session creation or upload failed:', error);
      // Handle failure (e.g., show error message)
    }
  };

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  return (
    <div className="bg-gray-100 flex items-center justify-center py-6 sm:px-6 lg:px-8 text-sm">
      <div className="max-w-xs">
        <BackButton/>
        <form className=" bg-white shadow-md rounded-xl p-6 mb-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-[1fr_2fr] gap-4 items-center pb-4">
            <label>Date</label>
            <input className={`form-input border px-2 rounded-md ${errors.date ? 'border-purple-500 border-2' : 'border-gray-300'}`}
              type="date"
              id="date"
              {...register("date", {
                required: "This field is required",
                validate: (value) => value <= today || "Date cannot be in the future",
              })}
              max={today} // Set the maximum allowed date to today
              />
            
            <label>Time</label>
            <input className={`form-input border px-2 rounded-md ${errors.time ? 'border-purple-500 border-2' : 'border-gray-300'}`} type="time" {...register("time", { required: true })} />
            
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <select className={`form-input border px-2 rounded-md ${errors.location ? 'border-purple-500 border-2' : 'border-gray-300'}`} {...register("location", { required: true })}>
              <option value="URBNSURF Sydney">URBNSURF Sydney</option>
              <option value="URBNSURF Melbourne">URBNSURF Melbourne</option>
              <option value="Waco Surf">Waco Surf</option>
              <option value="Fireside Surf">Fireside Surf</option>
              <option value="O2 Surftown MUC">O2 Surftown MUC</option>
              <option value="Revel Surf AZ">Revel Surf AZ</option>
              <option value="Parkwood Village">Parkwood Village</option>
            </select>
            
            <label className="block text-sm font-medium text-gray-700">Wave</label>
            <input
              className={`form-input border px-2 rounded-md ${errors.wave ? 'border-purple-500 border-2' : 'border-gray-300'}`}
              type="text" {...register("wave", { required: true, maxLength: 30 })}
            />

            <label className="block text-sm font-medium text-gray-700">Board</label>
            <input 
              className={`form-input border px-2 rounded-md ${errors.board ? 'border-purple-500 border-2' : 'border-gray-300'}`}
              type="text" {...register("board", { required: true, maxLength: 30 })} 
            />
          </div>

          <MultiVideoSelect onFilesChange={setSelectedFiles} />

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-gray-100 active:bg-gray-300"
          >
            Submit
          </button>

        </form>
      </div>
    </div>
  );
}

export default SessionForm;
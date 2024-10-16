'use client';

import { useRouter, useParams } from 'next/navigation'; // send us back to the dashboard
import { useState, useEffect } from 'react';
import { Session } from '@/lib/types';
import MultiVideoSelect from './components/MultiVideoSelect';
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DatePicker } from "@/components/ui/date-picker"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { Input } from "@/components/ui/input"
import UploadCompleteAnimation from "@/components/ui/upload-complete"
import { useForm, SubmitHandler } from "react-hook-form"
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select"

interface PresignedUrl {
  path: string;
  signedUrl: string;
  token: string;
}


const SessionForm: React.FC = () => {
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setProgress] = useState(0);
  const router = useRouter();

  const ANIMATION_DURATION = 1700; // 1.5 seconds + 200ms buffer

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Session>()

  async function uploadSessionAndFiles(
    sessionData: Session, 
    files: File[], 
    onProgress: (progress: number) => void
  ) {
      // append session data
      const formData = new FormData();
      formData.append('sessionData', JSON.stringify(sessionData));
      
      // append file names
      const fileNames = files.map(file => file.name);
      formData.append('files', JSON.stringify(fileNames));

      const response = await fetch('/api/session-upload', {
        method: 'POST',
        body: formData,
      });

      const jsonResponse = await response.json();
      const presignedUrls: PresignedUrl[] = jsonResponse.urls;

      // Step 2: Upload files directly to Supabase using the presigned URLs
      let fileProgress = new Array(files.length).fill(0); // Track progress for each file

      const uploadPromises = presignedUrls.map((presignedUrl, index) => {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', presignedUrl.signedUrl, true);
          xhr.setRequestHeader('Content-Type', files[index].type);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              // Update progress for this specific file
              fileProgress[index] = (event.loaded / event.total) * 100;
              // Calculate the overall progress
              const totalProgress = fileProgress.reduce((sum, progress) => sum + progress, 0) / files.length;
              onProgress(totalProgress);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(xhr.responseText);
            } else {
              reject(new Error('Upload failed'));
            }
          };

          xhr.onerror = () => reject(new Error('Network error'));

          xhr.send(files[index]);
        });
      });
  }
  
  const onSubmit: SubmitHandler<Session> = async (sessionData) => {

    try {
      const result = await uploadSessionAndFiles(sessionData, selectedFiles, (progress) => {
        setProgress(progress);
      });
      console.log('Session created and presigned upload URLs retrieved:', result);

      if (uploadProgress == 100) {
        console.log('File upload finished, sending user back to dashboard');
        setTimeout(() => {
          router.push('/'); // back to dashboard
        }, ANIMATION_DURATION);
      }
    } catch (error) {
      console.error('Session creation failed or failed to retrieve presigned upload URLs:', error);
      // Handle failure (e.g., show error message)
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center py-6 sm:px-6 lg:px-8 text-sm">
      <div className="max-w-xs">
        <form className=" bg-white shadow-md rounded-xl space-y-4 p-6 mb-4" onSubmit={handleSubmit(onSubmit)}>
          
          <DatePicker />
          
          <Input type="time" disabled={uploadProgress > 0} max={today}/>
          
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="URBNSURF Sydney">URBNSURF Sydney</SelectItem>
              <SelectItem value="URBNSURF Melbourne">URBNSURF Melbourne</SelectItem>
              <SelectItem value="Waco Surf">Waco Surf</SelectItem>
              <SelectItem value="Fireside Surf">Fireside Surf</SelectItem>
              <SelectItem value="O2 Surftown MUC">O2 Surftown MUC</SelectItem>
              <SelectItem value="Revel Surf AZ">Revel Surf AZ</SelectItem>
              <SelectItem value="Parkwood Village">Parkwood Village</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="Wave" disabled={uploadProgress > 0} />
          
          <Input placeholder="Board" disabled={uploadProgress > 0} />
            
          <AnimatePresence mode="wait">
            {uploadProgress > 0 && uploadProgress < 100 ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Uploading... {uploadProgress}%</span>
                </div>
                <Progress className="w-full" value={uploadProgress} />
              </motion.div>
            ) : uploadProgress == 100 ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex flex-col items-center justify-center"
              >
                <UploadCompleteAnimation />
                <span className="text-sm font-medium text-gray-700 mt-2">Upload Complete!</span>
              </motion.div>
            ) : (
              <MultiVideoSelect onFilesChange={setSelectedFiles} />
            )}
          </AnimatePresence>
          <div className="flex justify-between">
            <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SessionForm;


// TODO: UNCOMMENT AND COMMIT THIS CODE WHEN YOU ARE SATISFIED WITH THE FOLLOWING
// Well-designed HTML forms are:

// Well-structured and semantically correct.
// Easy to use and navigate (keyboard).
// Accessible with ARIA attributes and proper labels.
// Has support for client and server side validation.
// Well-styled and consistent with the rest of the application.
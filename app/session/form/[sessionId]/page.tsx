'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getUsername } from '@/lib/supabase/user';
import MultiVideoSelect from '@/components/ui/multi-video-select';
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DatePicker } from "@/components/ui/date-picker"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface PresignedUrl {
  path: string;
  signedUrl: string;
  token: string;
}

const formSchema = z.object({
  date: z.date().refine((val) => val <= new Date(), {
    message: 'Date cannot be in the future'
  }),
  time: z.string().refine((val) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
    message: 'Invalid time format, expected HH:MM (24-hour)',
  }),
  location: z.string().min(1).max(50),
  wave: z.string().min(1).max(50),
  board: z.string().min(1).max(50),
  files: z.array(z.any()),  // TODO: video files, not too large, not too many
});

const SessionForm: React.FC = () => {
  
  const [uploadProgress, setProgress] = useState(0);
  const router = useRouter();

  const ANIMATION_DURATION = 1700; // 1.5 seconds + 200ms buffer

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(), // today
      time: '00:00',
      location: '',
      wave: '',
      board: '',
      files: [],
    },
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await uploadSession(values, (progress) => {

        setProgress(progress);
        console.log('Upload Session:', progress)

        if (progress == 100) {
          console.log('File upload finished, sending user back to dashboard');
          setTimeout(() => {
            const username = getUsername();
            router.push(`/${username}/dashboard`);
          }, ANIMATION_DURATION);
        }
      });
    } catch (error) {
      console.error('Session creation failed or failed to retrieve presigned upload URLs:', error);
      console.error('TODO: handle this and abort mission, rollback transactions etc');
      // Handle failure (e.g., show error message)
    }
  };

  const handleCancel = () => {
    console.log("handling cancel")
    const username = getUsername();
    router.push(`/${username}/dashboard`);
  };

  async function uploadSession(
    session : z.infer<typeof formSchema>, 
    onProgress: (progress: number) => void
  ) {

      // build form to send to route handler
      const formData = new FormData();
      formData.append('date', JSON.stringify(session.date));
      formData.append('time', session.time);
      formData.append('location', session.location);
      formData.append('wave', session.wave);
      formData.append('board', session.board);
      session.files.forEach((file) => {
        formData.append('files', file);
      });
      
      // send and await respoonse containing presigned upload URLs
      const response = await fetch('/api/session-upload', {
        method: 'POST',
        body: formData,
      });

      const jsonResponse = await response.json();
      const presignedUrls: PresignedUrl[] = jsonResponse.urls;

      if (!Array.isArray(presignedUrls)) {
        throw new Error('Invalid presigned URLs:', presignedUrls); // TODO: handle this
      }
        
      // Upload files directly to Supabase using the presigned URLs
      let fileProgress = new Array(session.files.length).fill(0); // Track progress for each file
      const uploadPromises = presignedUrls.map((presignedUrl, index) => {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', presignedUrl.signedUrl, true);
          xhr.setRequestHeader('Content-Type', session.files[index].type);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              fileProgress[index] = (event.loaded / event.total) * 100;
              const totalProgress = Math.round(fileProgress.reduce((sum, progress) => sum + progress, 0) / session.files.length);
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
          xhr.send(session.files[index]);
        });
      });
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-6 text-sm min-w-max">
      <Form {...form}>
        <form className=" bg-white shadow-md rounded-xl space-y-8 p-6 min-w-max" onSubmit={form.handleSubmit(handleSubmit)}>
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Date the session took place
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    value={field.value}
                    onChange={field.onChange}
                    disabled={uploadProgress > 0}
                  />
                </FormControl>
                <FormDescription>
                  Time the session started
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    disabled={uploadProgress > 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Gold Coast" />
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
                </FormControl>
                <FormDescription>
                  The location of the wave
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="wave"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wave</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Snapper Rocks" 
                    value={field.value}
                    onChange={field.onChange}
                    disabled={uploadProgress > 0} 
                  />
                </FormControl>
                <FormDescription>
                  The wave being surfed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="board"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Simon Anderson '5 Spark'" 
                    value={field.value}
                    onChange={field.onChange}
                    disabled={uploadProgress > 0} 
                  />
                </FormControl>
                <FormDescription>
                  The board being ridden
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormControl>
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
                      <MultiVideoSelect 
                        onFilesChange={(files) => {
                          field.onChange(files);
                        }} 
                      />
                    )}
                  </AnimatePresence>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>

        </form>
      </Form>
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
// handle pre uploaded files
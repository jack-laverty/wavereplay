export interface VideoMetadata {
  id: number;
  session: number;
  title: string;
  videoUrl: string;
  duration: number;
  created_at: string;
  updated_at: string;
  order_in_session: number;
  file_size: number;
  format: string;
  resolution: string;
  width: number;
  height: number;
}

export interface Session {
  date: string;
  time: string;
  location: string;
  wave: string;
  surfer: string;
  board: string;
  wave_count: number;
  time_surfed: number;
  id: number;
}
export interface VideoMetadata {
  title: string;
  video_url: string;
  timestamp: string;
  duration: number;
  created_at: string;
  order_in_session: number;
  file_size: number;
  format: string;
  resolution: string;
  session: number;
  id: number;
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
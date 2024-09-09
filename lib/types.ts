export interface Video {
  id: number;
  sessionId: number;
  title: string;
  videoUrl: string;
  timestamp: string;
  duration: number;
  created_at: string;
  updated_at: string;
  order_in_session: number;
  thumbnail_url: string;
  file_size: number;
  format: string;
  resolution: string;
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
  videos_path: string;
  session_id: number;
}
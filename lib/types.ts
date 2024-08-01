export interface Video {
  id: number;
  title: string;
  videoUrl: string;
  timestamp: string;
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
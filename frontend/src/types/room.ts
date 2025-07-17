export interface Room {
  id: number;
  title: string;
  capacity: number;
  type: RoomType;
}

interface RoomType {
  id: number;
  description: string;
  iconUrl?: string;
}

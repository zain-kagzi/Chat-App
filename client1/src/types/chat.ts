export type User = {
  _id: string;
  username: string;
  profilePic?: string;
};

export type Message = {
  _id?: string;
  text: string;
  senderName: string;
  roomId?: string;
  createdAt?: string;
};
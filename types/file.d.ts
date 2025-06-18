interface DBFile {
  _id?: string;
  title: string;
  email?: string;
  url: string;
  type: string;
  size: number;
  description?: string;
  status?: string; // default is "active"
  createdAt?: Date;
  updatedAt?: Date;
}

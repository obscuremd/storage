interface DBFolder {
  _id: string;
  email: string;
  title: string;
  status: string;
  files: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

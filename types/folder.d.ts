interface DBFolder {
  _id: string;
  email: string;
  title: string;
  status: string;
  files: DBFile[];
  createdAt?: Date;
  updatedAt?: Date;
}

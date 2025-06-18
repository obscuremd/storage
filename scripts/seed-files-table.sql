-- Insert sample data into the files table
INSERT INTO files (filename, original_filename, file_path, file_size, content_type, uploaded_by, description) VALUES
('doc_001.pdf', 'project-proposal.pdf', '/uploads/documents/doc_001.pdf', 2048576, 'application/pdf', 'john.doe', 'Project proposal document'),
('img_001.jpg', 'team-photo.jpg', '/uploads/images/img_001.jpg', 1536000, 'image/jpeg', 'jane.smith', 'Team photo from company retreat'),
('data_001.csv', 'sales-report.csv', '/uploads/data/data_001.csv', 512000, 'text/csv', 'mike.johnson', 'Q3 sales report data'),
('video_001.mp4', 'presentation.mp4', '/uploads/videos/video_001.mp4', 52428800, 'video/mp4', 'sarah.wilson', 'Product presentation video'),
('archive_001.zip', 'backup-files.zip', '/uploads/archives/archive_001.zip', 10485760, 'application/zip', 'admin', 'Weekly backup archive');

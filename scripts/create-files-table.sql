-- Create a simple table to store file information
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    uploaded_by VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create an index on filename for faster searches
CREATE INDEX IF NOT EXISTS idx_files_filename ON files(filename);

-- Create an index on upload_date for sorting by date
CREATE INDEX IF NOT EXISTS idx_files_upload_date ON files(upload_date);

-- Create an index on uploaded_by for filtering by user
CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON files(uploaded_by);

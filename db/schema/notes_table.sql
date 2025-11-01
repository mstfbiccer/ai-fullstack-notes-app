-- Notes table schema for Oracle Database
CREATE TABLE notes (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER NOT NULL,
    title VARCHAR2(200) NOT NULL,
    content CLOB,
    completed NUMBER(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for user queries
CREATE INDEX idx_notes_user_id ON notes(user_id);

-- Sample data
INSERT INTO notes (user_id, title, content, completed) VALUES (1, 'Welcome', 'This is your first note!', 0);
INSERT INTO notes (user_id, title, content, completed) VALUES (1, 'Sample Task', 'Complete this task', 0);

COMMIT;


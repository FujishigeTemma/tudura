use `tudura`;

CREATE TABLE IF NOT EXISTS boxes (
    id           VARCHAR(36) NOT NULL PRIMARY KEY,
    name         TEXT NOT NULL,
    hashed_pass  VARCHAR(128),
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at   DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS items (
    id           VARCHAR(36) NOT NULL PRIMARY KEY,
    box_id       VARCHAR(36) NOT NULL,
    name         TEXT NOT NULL,
    expires_at   DATETIME NOT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX index_box_id (`box_id`),
    CONSTRAINT fk_boxes_id
        FOREIGN KEY (`box_id`) 
        REFERENCES boxes (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

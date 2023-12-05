CREATE TABLE user_basic_info (
    id VARCHAR PRIMARY KEY,
    username VARCHAR(100),
    birthdate DATE
);

CREATE TABLE user_contact_info (
    id VARCHAR PRIMARY KEY,
    email VARCHAR(100),
    phone VARCHAR(20)
    -- FOREIGN KEY (id) REFERENCES user_info(id)
);

CREATE TABLE user_account_info (
    id VARCHAR PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(50)
    -- FOREIGN KEY (id) REFERENCES user_info(id)
);

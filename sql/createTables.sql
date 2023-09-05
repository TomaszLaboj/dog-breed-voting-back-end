DROP TABLE IF EXISTS breeds;

CREATE TABLE  breeds (
    breed_name   VARCHAR(255) PRIMARY KEY,
    votes       INT NOT NULL DEFAULT 0
);

INSERT INTO breeds (breed_name) VALUES ('hound-afghan'), ('retriever-golden'), ('eskimo');
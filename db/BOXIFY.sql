CREATE DATABASE Boxify;
USE Boxify;

CREATE TABLE Users (
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
name VARCHAR(45) NOT NULL,
`user` VARCHAR(45) NOT NULL,
email VARCHAR(45) NOT NULL,
`password` VARCHAR(45) NOT NULL
);

CREATE TABLE Box (
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
tittle VARCHAR(45) NOT NULL,
objects JSON NOT NULL,
fk_user_id INT,
    FOREIGN KEY (fk_user_id) REFERENCES Users(id)
);

INSERT INTO Box (tittle, objects) 
VALUES 
("caja invierno", '["gorro", "guantes", "bufandas"]'), 
("caja verano", '["bañadores", "toallas", "chanclas"]');

ALTER TABLE Box
ADD COLUMN image LONGTEXT AFTER tittle;

UPDATE Box
SET objects = '[{"text": "gorro", "checked": false}, {"text": "guantes", "checked": false}, {"text": "bufandas", "checked": false}]'
WHERE tittle = "caja invierno";

UPDATE Box
SET objects = '[{"text": "bañadores", "checked": false}, {"text": "toallas", "checked": false}, {"text": "chanclas", "checked": false}]'
WHERE tittle = "caja verano";

UPDATE Box
SET objects = '[{"text": "gorro", "checked": false}, {"text": "guantes", "checked": false}, {"text": "bufandas", "checked": false}]'
WHERE tittle = "caja invierno" AND id = 1;

UPDATE Box
SET objects = '[{"text": "bañadores", "checked": false}, {"text": "toallas", "checked": false}, {"text": "chanclas", "checked": false}]'
WHERE tittle = "caja verano" AND id= 2;

ALTER TABLE users MODIFY password VARCHAR(255);



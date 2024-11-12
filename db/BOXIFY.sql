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

-- He creado la BD, he añadido una columna a la tabla box, porque no se renderizaba la imagen con el fetch. hay que ponerle el valor fijo de la imagen

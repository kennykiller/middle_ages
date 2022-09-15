-- CREATE DATABASE `middle-ages`;
USE `middle-ages`;
CREATE TABLE users (
    id INT AUTO_INCREMENT,
    name VARCHAR(120),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(80),
    password VARCHAR(150),
    amtVisits INT,
    isAdmin TINYINT DEFAULT '0',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);
CREATE TABLE films (
    id INT AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    ageRestriction VARCHAR(5) NOT NULL,
    posterUrl TEXT,
    description TEXT,
    filmDuration TIME NOT NULL,
    basePrice INT DEFAULT "500",
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);
CREATE TABLE genres (
    id INT AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);
INSERT INTO genres (name)
VALUES ('боевик'),
    ('драма'),
    ('мультфильм'),
    ('комедия'),
    ('триллер'),
    ('ужасы'),
    ('семейный'),
    ('спорт'),
    ('исторический'),
    ('документальный'),
    ('детектив'),
    ('приключения');
CREATE TABLE film_genres (
    id INT AUTO_INCREMENT,
    genreId INT NOT NULL,
    filmId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (filmId) REFERENCES films(id),
    FOREIGN KEY (genreId) REFERENCES genres(id)
);
CREATE UNIQUE INDEX genreId_filmId ON film_genres(genreId, filmId);
CREATE INDEX genreIdIdx ON film_genres(genreId);
CREATE TABLE sessions (
    id INT AUTO_INCREMENT,
    filmStart DATETIME NOT NULL,
    seatsAvailable INT DEFAULT '100',
    price INT NOT NULL DEFAULT '500',
    filmId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (filmId) REFERENCES films(id),
    PRIMARY KEY (`id`)
);
CREATE TABLE statuses (
    id INT AUTO_INCREMENT,
    name VARCHAR(50),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);
INSERT INTO statuses (name)
VALUES ('booked'),
    ('sold'),
    ('free');
CREATE TABLE discounts (
    id INT AUTO_INCREMENT,
    ageRestriction VARCHAR(5),
    name VARCHAR(120),
    posterUrl TEXT,
    discountPercentage INT NOT NULL,
    description TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);
CREATE TABLE orders (
    id INT AUTO_INCREMENT,
    userId INT NOT NULL,
    discountId INT,
    statusId INT NOT NULL DEFAULT '1',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (statusId) REFERENCES statuses(id),
    FOREIGN KEY (discountId) REFERENCES discounts(id),
    PRIMARY KEY (`id`)
);
CREATE TABLE seats (
    id INT AUTO_INCREMENT,
    number INT(200) NOT NULL,
    orderId INT DEFAULT NULL,
    sessionId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sessionId) REFERENCES sessions(id),
    FOREIGN KEY (orderId) REFERENCES orders(id),
    PRIMARY KEY (`id`)
);
CREATE TABLE tickets (
    id INT AUTO_INCREMENT,
    totalPrice DECIMAL(6, 2),
    seatId INT NOT NULL,
    orderId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seatId) REFERENCES seats(id),
    FOREIGN KEY (orderId) REFERENCES orders(id),
    PRIMARY KEY (`id`)
);
CREATE TABLE refresh_tokens (
    id INT AUTO_INCREMENT,
    token VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    expiryDate DATETIME NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    PRIMARY KEY (`id`)
);
CREATE TABLE reset_tokens (
    id INT AUTO_INCREMENT,
    token VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    expiryDate DATETIME NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    PRIMARY KEY (`id`)
);
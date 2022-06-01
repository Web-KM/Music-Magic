
DROP TABLE IF EXISTS songslist;

CREATE TABLE songslist (
id VARCHAR(255),
title_short VARCHAR(255),
artist_name VARCHAR(255),
artist_picture VARCHAR(255),
lyrics TEXT,
audio VARCHAR(255),
comment VARCHAR(255)
);
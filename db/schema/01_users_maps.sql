DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS maps CASCADE;
DROP TABLE IF EXISTS owners CASCADE;
DROP TABLE IF EXISTS favourites CASCADE;
DROP TABLE IF EXISTS points CASCADE;

CREATE TABLE users (

	id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	profile_photo VARCHAR(255)
);

CREATE TABLE maps (
	id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	name VARCHAR(255) NOT NULL,

  description TEXT,
	public_edits BOOLEAN NOT NULL DEFAULT true,
  latitude NUMERIC(21,18) NOT NULL,
  longitude NUMERIC(21,18) NOT NULL,
  zoom SMALLINT NOT NULL
);

CREATE TABLE favourites (
	user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE
);

CREATE TABLE points (
	creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
	title VARCHAR(255) NOT NULL,
	description TEXT NOT NULL,
	image VARCHAR(255) NOT NULL,
	longitude NUMERIC(21,18) NOT NULL,
	latitude NUMERIC(21,18) NOT NULL
);

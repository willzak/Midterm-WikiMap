-- Create new user
-- INSERT INTO users (name, email. password, profile_photo, username)
-- VALUES (obj.name, obj.email, obj.password, obj.profile_photo, obj.username);

-- Create new map
-- INSERT INTO maps (name, owner_id, city, description, public_edits)
-- VALUES (obj.name, obj.public_edits);

-- Create new point
-- INSERT INTO points (map_id, creator_id, title, description, image, longitude, latitude)
-- VALUES (obj.map_id, obj.creator_id, obj.title, obj.description, obj.image, obj.longitude, obj.latitude);

-- Users Starter Data

INSERT INTO users (name, email, password, profile_photo)
VALUES ('Will', 'will@gmail.com', 'password', 'https://miro.medium.com/max/468/1*092gv8hqR61nn90bim4m3Q.png');

INSERT INTO users (name, email, password, profile_photo)
VALUES ('Paul', 'paul@gmail.com', 'password', 'https://image.shutterstock.com/image-vector/male-silhouette-avatar-profile-picture-260nw-199246382.jpg');

INSERT INTO users (name, email, password, profile_photo)
VALUES ('Ian', 'ian@gmail.com', 'password', 'https://cdn.iconscout.com/icon/free/png-512/sloth-1400398-1185970.png');

-- Map Starter Data
INSERT INTO maps (name, owner_id, description, public_edits, latitude, longitude, zoom)
VALUES ('Best Places To Get Coffee', 1002, 'A map of cool and trendy cafes in Vancouver', true, 49.276, -123.121, 8 );

INSERT INTO maps (name, owner_id, description, public_edits, latitude, longitude, zoom)
VALUES ('Coolest Viewpoints in Victoria', 1003, 'Best hikes with views around Victoria', false, 48.492, -123.345, 9 );

INSERT INTO maps (name, owner_id, description, public_edits, latitude, longitude, zoom)
VALUES ('Cheapest Happy Hours in the City!', 1001, 'Best bars in the city for some happy hour specials!', true, 43.654, -79.386, 8);

-- Points Starter Data
INSERT INTO points (map_id, creator_id, title, description, image, latitude, longitude)
VALUES (1001, 1001, 'Small Victory Coffee', 'Really good cafe known for their coffee and wide selection of pastries!', 'https://s3-media0.fl.yelpcdn.com/bphoto/B0-70gZe11d8U4b-hjjFKw/348s.jpg', 49.276721, -123.121083);

INSERT INTO points (map_id, creator_id, title, description, image, latitude, longitude)
VALUES (1002, 1002, 'Mount Douglas Park', 'Nice hike with a beautiful view!', 'https://i2.wp.com/victoriahype.com/wp-content/uploads/2017/11/mount_douglas_viewpoint.jpg?resize=1024%2C683&ssl=1', 48.492504, -123.345783);

INSERT INTO points (map_id, creator_id, title, description, image, latitude, longitude)
VALUES (1002, 1003, 'Mount Tolmie Park', 'Great place for families', 'https://i2.wp.com/victoriahype.com/wp-content/uploads/2017/11/mount_tolmie_park_viewpoint.jpg?resize=1024%2C681&ssl=1', 48.457504, -123.325652);

-- Favourites Starter Data
INSERT INTO favourites (user_id, map_id) VALUES (1001,1003);
INSERT INTO favourites (user_id, map_id) VALUES (1001,1002);
INSERT INTO favourites (user_id, map_id) VALUES (1002,1002);


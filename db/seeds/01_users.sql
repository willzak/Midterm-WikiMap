-- Create new user
-- INSERT INTO users (name, email. password, profile_photo, username)
-- VALUES (obj.name, obj.email, obj.password, obj.profile_photo, obj.username);

-- Create new map
-- INSERT INTO maps (name, city, description, public_edits)
-- VALUES (obj.name, obj.public_edits);

-- Create new point
-- INSERT INTO points (map_id, creator_id, title, description, image, longitude, latitude)
-- VALUES (obj.map_id, obj.creator_id, obj.title, obj.description, obj.image, obj.longitude, obj.latitude);

-- Users Starter Data

INSERT INTO users (name, email, password, profile_photo, username)
VALUES ('Will', 'will@gmail.com', 'password', 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png', 'heywill');

INSERT INTO users (name, email, password, profile_photo, username)
VALUES ('Paul', 'paul@gmail.com', 'password', 'https://image.shutterstock.com/image-vector/male-silhouette-avatar-profile-picture-260nw-199246382.jpg', 'itspaul');

INSERT INTO users (name, email, password, profile_photo, username)
VALUES ('Ian', 'ian@gmail.com', 'password', 'https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144849704.jpg', 'ian123');

-- Map Starter Data
INSERT INTO maps (name, description, public_edits)
VALUES ('Best Places To Get Coffee',  'A map of cool and trendy cafes in Vancouver', true);

INSERT INTO maps (name,  description, public_edits)
VALUES ('Coolest Viewpoints in Victoria',  'Best hikes with views around Victoria', false);

INSERT INTO maps (name, description, public_edits)
VALUES ('Cheapest Happy Hours in the City!', 'Best bars in the city for some happy hour specials!', true);

-- Points Starter Data
INSERT INTO points (map_id, creator_id, title, description, image, longitude, latitude)
VALUES (1, 1, 'Small Victory Coffee', 'Really good cafe known for their coffee and wide selection of pastries!', 'https://s3-media0.fl.yelpcdn.com/bphoto/B0-70gZe11d8U4b-hjjFKw/348s.jpg', 49.276721, -123.121083);

INSERT INTO points (map_id, creator_id, title, description, image, longitude, latitude)
VALUES (2, 2, 'Mount Douglas Park', 'Nice hike with a beautiful view!', 'https://i2.wp.com/victoriahype.com/wp-content/uploads/2017/11/mount_douglas_viewpoint.jpg?resize=1024%2C683&ssl=1', 48.492504, -123.345783);

INSERT INTO points (map_id, creator_id, title, description, image, longitude, latitude)
VALUES (2, 3, 'Mount Tolmie Park', 'Great place for families', 'https://i2.wp.com/victoriahype.com/wp-content/uploads/2017/11/mount_tolmie_park_viewpoint.jpg?resize=1024%2C681&ssl=1', 48.457504, -123.325652);

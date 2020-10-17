-- Find favourites for a user -> for display on profile
SELECT map_id FROM favourites
WHERE user_id = // desired user’s id //

-- Find tables a user owns -> this also means that these are the tables that user can delete
SELECT maps.name FROM maps
JOIN owners ON owners.map_id = maps.id
JOIN users ON users.id = owners.owner_id
WHERE users.id = owners.owner_id;

-- Find points a user has made
SELECT point_id FROM points
WHERE creator_id = //desired user’s id //;

-- Check if user has permissions to edit a map
SELECT users.id, maps.id, maps.public_edits
FROM maps
JOIN owners ON maps.id = owners.map_id
JOIN users ON owners.owner_id = users.id
WHERE users.id = //desired user’s id //
AND (maps.public_edits = t OR users.id = owners.owner_id);

-- Show maps that the user has made edits to
SELECT maps.id, maps.name FROM maps
JOIN points ON points.map_id = maps.id
JOIN users ON users.id = points.creator_id
WHERE points.creator = //desired user’s id//;

-- See all maps
SELECT id, name FROM maps;

-- See specific map
SELECT id, name FROM maps
WHERE name = ‘MAP_NAME’;

-- See points on a specific map
SELECT id FROM points
JOIN maps ON maps.id = points.map_id
WHERE maps.id = // desired map id //;

-- Count of points on a specific map
SELECT count(*) FROM points
JOIN maps ON maps.id = points.map_id
WHERE maps.id = // desired map id //;

-- Find username
SELECT username FROM users
WHERE id = // user’s id //;

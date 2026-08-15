-- V12 backfilled every movie missing a trailer by cycling through 8 real Blender Foundation
-- trailer URLs, so the ~200 procedurally-generated 2027 movies (which don't correspond to
-- any real film) ended up showing an unrelated trailer -- a horror title could show a
-- cartoon bunny short. There's no correct trailer for a movie that doesn't exist, so clear
-- it back to NULL: the UI already hides the "Watch Trailer" button when trailerUrl is empty,
-- and that's more honest than a mismatched link. Only the original 8 real, licensed shorts
-- (matched by slug, not id, to be safe) keep their real trailer.
UPDATE movie
SET trailer_url = NULL
WHERE slug NOT IN (
    'big-buck-bunny',
    'sintel',
    'tears-of-steel',
    'cosmos-laundromat',
    'spring',
    'elephants-dream',
    'caminandes-llama-drama',
    'charge'
);

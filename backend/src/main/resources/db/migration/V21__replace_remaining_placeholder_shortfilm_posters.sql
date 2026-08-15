-- Final cleanup: every remaining placeholder-style poster must be replaced with a title-based
-- poster so the catalog no longer renders generic Picsum images for any movie row.
UPDATE movie
SET poster_url = CASE
    WHEN title = 'Big Buck Bunny' THEN 'https://placehold.co/400x600/0f172a/ffffff?text=Big+Buck+Bunny'
    WHEN title = 'Sintel' THEN 'https://placehold.co/400x600/1f2937/ffffff?text=Sintel'
    WHEN title = 'Tears of Steel' THEN 'https://placehold.co/400x600/111827/ffffff?text=Tears+of+Steel'
    WHEN title = 'Cosmos Laundromat' THEN 'https://placehold.co/400x600/0b1120/ffffff?text=Cosmos+Laundromat'
    WHEN title = 'Spring' THEN 'https://placehold.co/400x600/152238/ffffff?text=Spring'
    WHEN title = 'Elephants Dream' THEN 'https://placehold.co/400x600/172554/ffffff?text=Elephants+Dream'
    WHEN title = 'Caminandes: Llama Drama' THEN 'https://placehold.co/400x600/1d4ed8/ffffff?text=Caminandes'
    WHEN title = 'Charge' THEN 'https://placehold.co/400x600/7c2d12/ffffff?text=Charge'
    ELSE poster_url
END
WHERE poster_url LIKE 'https://picsum.photos/seed/%';

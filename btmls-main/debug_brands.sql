-- Check if brands table exists and has data
SELECT COUNT(*) as brand_count FROM brands;

-- View all brands
SELECT * FROM brands;

-- Check if there are any RLS policies blocking access
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'brands';


const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

console.log(`Connecting to: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Try to fetch brands (table might be empty, but query should succeed)
    const { data, error } = await supabase.from('brands').select('count', { count: 'exact', head: true });

    if (error) {
      console.error("❌ Connection failed with error:", error.message);
      if (error.code === 'PGRST301') {
         console.error("   (This might mean functionality is restricted or table doesn't exist yet)");
      }
    } else {
      console.log("✅ Successfully connected to Supabase!");
      console.log(`   Found ${data === null ? 0 : data.length} brands (count query success).`);
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

testConnection();

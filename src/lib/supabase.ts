import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://olwrmuissozaxuexnzaf.supabase.co';
// Correct Public Anon Key fetched via Management API
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sd3JtdWlzc296YXh1ZXhuemFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5Njk0MzYsImV4cCI6MjA5MzU0NTQzNn0.WJ0dcLDHYfyjc0V6pzcjD98RssOWahZUptjN7dsPv4I'; 

export const supabase = createClient(supabaseUrl, supabaseKey);

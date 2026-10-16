/**
 * TASMAC RESERVE — Supabase Integration & Client Controller
 * 
 * Instructions:
 * 1. Create a free project at https://supabase.com
 * 2. In your Supabase Dashboard, go to Project Settings -> API
 * 3. Copy your "Project URL" and "anon public key" below, or set them via localStorage:
 *    localStorage.setItem('tasmac-supabase-url', 'https://your-project.supabase.co');
 *    localStorage.setItem('tasmac-supabase-key', 'your-anon-key');
 */

const SUPABASE_CONFIG = {
  // Replace these placeholders with your live Supabase project credentials:
  url: localStorage.getItem('tasmac-supabase-url') || "https://ilbwkldseycfqytfkiie.supabase.com",
  anonKey: localStorage.getItem('tasmac-supabase-key') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsYndrbGRzZXljZnF5dGZraWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMzI1NzUsImV4cCI6MjEwNzcwODU3NX0.9DPW5cJGcXO5Fr2xqm1V89Lj9GBFE3aVuH-qfEEFb64"
};

// Initialize Supabase Client if library is loaded and keys are set
let supabaseClient = null;

function initSupabase() {
  if (typeof supabase !== 'undefined' && SUPABASE_CONFIG.url && SUPABASE_CONFIG.url.startsWith('http') && SUPABASE_CONFIG.anonKey && SUPABASE_CONFIG.anonKey !== 'YOUR_SUPABASE_ANON_KEY') {
    try {
      supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      console.log('✅ Supabase initialized successfully for TASMAC Reserve!');
    } catch(err) {
      console.warn('⚠️ Supabase init warning:', err);
    }
  }
}

// Auto-run init
if (typeof window !== 'undefined') {
  initSupabase();
}

window.TASMAC_SUPABASE = {
  isConfigured: function() {
    return Boolean(supabaseClient);
  },

  setCredentials: function(url, anonKey) {
    if (!url || !anonKey) return false;
    localStorage.setItem('tasmac-supabase-url', url.trim());
    localStorage.setItem('tasmac-supabase-key', anonKey.trim());
    SUPABASE_CONFIG.url = url.trim();
    SUPABASE_CONFIG.anonKey = anonKey.trim();
    initSupabase();
    return Boolean(supabaseClient);
  },

  // 1. Fetch live drinks from Supabase Database (with local fallback)
  getDrinks: async function(fallbackArray) {
    if (!supabaseClient) return fallbackArray;
    try {
      const { data, error } = await supabaseClient
        .from('drinks')
        .select('*')
        .eq('in_stock', true)
        .order('price', { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn('Supabase drinks fetch returned fallback:', error);
        return fallbackArray;
      }

      // Map Supabase snake_case columns to local app camelCase format
      return data.map(d => ({
        id: d.id,
        name: d.name,
        brand: d.brand,
        category: d.category,
        size: d.size,
        price: Number(d.price),
        rating: d.rating,
        bestseller: d.bestseller,
        abv: d.abv,
        origin: d.origin,
        desc: d.description,
        img: d.img_url
      }));
    } catch(e) {
      console.warn('Error querying Supabase drinks:', e);
      return fallbackArray;
    }
  },

  // 2. Fetch live stores from Supabase Database
  getOutlets: async function(fallbackArray) {
    if (!supabaseClient) return fallbackArray;
    try {
      const { data, error } = await supabaseClient
        .from('outlets')
        .select('*');

      if (error || !data || data.length === 0) {
        return fallbackArray;
      }

      return data.map(o => ({
        id: o.id,
        name: o.name,
        area: o.area,
        zone: o.zone,
        type: o.type,
        address: o.address,
        lat: Number(o.lat),
        lng: Number(o.lng),
        timing: o.timing,
        features: o.features || []
      }));
    } catch(e) {
      return fallbackArray;
    }
  },

  // 3. Save reservation token to Supabase Database
  createReservation: async function(resObj) {
    if (!supabaseClient) return { success: true, localOnly: true };
    try {
      const { data, error } = await supabaseClient
        .from('reservations')
        .insert([{
          token: resObj.token,
          customer_name: resObj.name,
          customer_phone: resObj.phone || '',
          id_type: resObj.idType || 'Aadhaar Card',
          outlet_id: resObj.outletId,
          outlet_name: resObj.outletName,
          total_amount: resObj.amount,
          items: resObj.items || [],
          status: 'pending'
        }])
        .select();

      if (error) {
        console.warn('Could not save reservation to Supabase:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch(e) {
      return { success: false, error: e.message };
    }
  },

  // 4. Supabase Auth: Sign in with OTP (SMS)
  signInWithOtp: async function(phone) {
    if (!supabaseClient) return { error: 'Supabase client not configured yet' };
    return await supabaseClient.auth.signInWithOtp({
      phone: phone
    });
  },

  // 5. Supabase Auth: Verify OTP
  verifyOtp: async function(phone, token) {
    if (!supabaseClient) return { error: 'Supabase client not configured yet' };
    return await supabaseClient.auth.verifyOtp({
      phone: phone,
      token: token,
      type: 'sms'
    });
  },

  // 6. Supabase Auth: Email & Password Sign Up / Sign In
  signInWithEmail: async function(email, password) {
    if (!supabaseClient) return { error: 'Supabase client not configured yet' };
    return await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });
  },

  signUpWithEmail: async function(email, password, userMeta) {
    if (!supabaseClient) return { error: 'Supabase client not configured yet' };
    return await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        data: userMeta || {}
      }
    });
  },

  signOut: async function() {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    localStorage.removeItem('tasmac-user');
  }
};


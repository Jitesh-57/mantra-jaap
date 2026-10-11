// Accounts and cloud saving (Supabase). Loaded only when js/config.js is filled in.
const SDK = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
const TABLE = 'mantra_user_data';

export async function connect(url, anonKey) {
  const { createClient } = await import(SDK);
  const sb = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
  });
  const here = () => location.origin + location.pathname;
  const ok = ({ data, error }) => { if (error) throw error; return data; };

  return {
    async currentUser() { return ok(await sb.auth.getSession()).session?.user || null; },
    onChange(cb) { sb.auth.onAuthStateChange((event, session) => cb(event, session?.user || null)); },
    async google() { ok(await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: here() } })); },
    async signIn(email, password) { return ok(await sb.auth.signInWithPassword({ email, password })); },
    async signUp(email, password) { return ok(await sb.auth.signUp({ email, password, options: { emailRedirectTo: here() } })); },
    async sendReset(email) { ok(await sb.auth.resetPasswordForEmail(email, { redirectTo: here() })); },
    async setPassword(password) { ok(await sb.auth.updateUser({ password })); },
    async signOut() { ok(await sb.auth.signOut()); },
    async load(userId) { return ok(await sb.from(TABLE).select('state, settings').eq('user_id', userId).maybeSingle()); },
    async save(userId, state, settings) {
      ok(await sb.from(TABLE).upsert({ user_id: userId, state, settings, updated_at: new Date().toISOString() }));
    },
  };
}

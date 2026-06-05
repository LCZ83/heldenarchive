// ───────────────────────────────────────────────────────────────
// localStorage-backed storage layer
// ───────────────────────────────────────────────────────────────
// The app was originally written for Claude's artifact runtime, which provided
// a `window.storage` object with get/set/delete/list methods and a "shared"
// flag. This module reimplements that exact interface on top of the browser's
// localStorage, so the rest of the app runs unchanged.
//
// IMPORTANT DIFFERENCE FROM THE ARTIFACT VERSION:
//   - In the artifact, "shared" data was visible to every user of the artifact.
//   - localStorage is per-browser and per-device. There is no sharing between
//     users or devices. Every browser is its own island. The `shared` flag is
//     preserved only so the API matches; both shared and personal data live in
//     the same browser's localStorage (kept apart by a key prefix).
//
// Practical consequence: the "Meister sees every player's hero" model does not
// work across people here. Each person who opens the app has their own private
// data. To get real shared/multi-user persistence, swap this file for a hosted
// backend (e.g. Supabase) — nothing else in the app needs to change.

const NS = 'heldenarchiv'; // namespace so we don't collide with other localStorage keys

// Build the concrete localStorage key from the logical key + shared flag.
function physKey(key, shared) {
  const scope = shared ? 's' : 'p';
  return `${NS}:${scope}:${key}`;
}

// Prefix used when listing keys in a given scope.
function scopePrefix(shared) {
  return `${NS}:${shared ? 's' : 'p'}:`;
}

function isAvailable() {
  try {
    const t = `${NS}:__test__`;
    window.localStorage.setItem(t, '1');
    window.localStorage.removeItem(t);
    return true;
  } catch (e) {
    return false;
  }
}

const storage = {
  // get(key, shared) -> { key, value, shared } | null
  async get(key, shared = false) {
    const raw = window.localStorage.getItem(physKey(key, shared));
    if (raw === null) return null;
    return { key, value: raw, shared };
  },

  // set(key, value, shared) -> { key, value, shared }
  async set(key, value, shared = false) {
    window.localStorage.setItem(physKey(key, shared), String(value));
    return { key, value: String(value), shared };
  },

  // delete(key, shared) -> { key, deleted, shared }
  async delete(key, shared = false) {
    window.localStorage.removeItem(physKey(key, shared));
    return { key, deleted: true, shared };
  },

  // list(prefix, shared) -> { keys, prefix, shared }
  // Returns the LOGICAL keys (without the namespace/scope prefix) that begin
  // with `prefix`, matching what the artifact API returned.
  async list(prefix = '', shared = false) {
    const physPrefix = scopePrefix(shared);
    const keys = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const physK = window.localStorage.key(i);
      if (physK && physK.startsWith(physPrefix)) {
        const logical = physK.slice(physPrefix.length);
        if (logical.startsWith(prefix)) keys.push(logical);
      }
    }
    return { keys, prefix, shared };
  },
};

// Install the shim as window.storage so the (otherwise unchanged) app code that
// calls window.storage.get/set/delete/list keeps working.
export function installStorage() {
  if (typeof window === 'undefined') return;
  if (!isAvailable()) {
    console.warn('localStorage ist nicht verfügbar — Daten werden nicht gespeichert.');
  }
  window.storage = storage;
}

export default storage;

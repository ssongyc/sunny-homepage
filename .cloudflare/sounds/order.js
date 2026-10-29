// Authenticated Worker routes are the only external entry point to this storage.
export function validOrder(input, scope) {
  return Number.isSafeInteger(input?.version) && input.version >= 0 &&
    Array.isArray(input.keys) && input.keys.length <= 1000 &&
    new Set(input.keys).size === input.keys.length && input.keys.every(key =>
      typeof key === 'string' && key.length <= 200 && key.startsWith(`${scope}/`) &&
      /^[A-Za-z0-9_-]+$/.test(key.slice(scope.length + 1)));
}

function stub(env, scope) {
  if (!env.SOUND_ORDERS) throw new Error('Sound order storage is not configured');
  return env.SOUND_ORDERS.get(env.SOUND_ORDERS.idFromName(scope));
}

export async function readOrder(env, scope) {
  const result = await stub(env, scope).fetch(`https://order.internal/${scope}`);
  if (!result.ok) throw new Error('Sound order read failed');
  const order = await result.json();
  if (!validOrder(order, scope)) throw new Error('Invalid stored sound order');
  return order;
}

export function writeOrder(env, scope, input) {
  return stub(env, scope).fetch(`https://order.internal/${scope}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input)
  });
}

export class SoundOrder {
  constructor(state) { this.storage = state.storage; }

  async fetch(request) {
    const scope = new URL(request.url).pathname.slice(1);
    if (request.method === 'GET') {
      const saved = await this.storage.get('order');
      return Response.json(saved === undefined ? { keys: [], version: 0 } : JSON.parse(saved));
    }
    if (request.method !== 'POST') return new Response(null, { status: 405 });
    const input = await request.json();
    if (!validOrder(input, scope)) return Response.json({ error: 'order_format' }, { status: 400 });
    return this.storage.transaction(async transaction => {
      const saved = await transaction.get('order');
      const current = saved === undefined ? { keys: [], version: 0 } : JSON.parse(saved);
      if (!validOrder(current, scope)) throw new Error('Invalid stored sound order');
      if (input.version !== current.version) return Response.json({ error: 'order_conflict' }, { status: 409 });
      if (current.version === Number.MAX_SAFE_INTEGER) throw new Error('Sound order version exhausted');
      const next = { keys: input.keys, version: current.version + 1 };
      const encoded = JSON.stringify(next);
      if (new TextEncoder().encode(encoded).byteLength > 96 * 1024) return Response.json({ error: 'size' }, { status: 413 });
      await transaction.put('order', encoded);
      return Response.json(next);
    });
  }
}

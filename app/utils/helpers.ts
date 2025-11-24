export function shortCryptoId(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // utan O,0,I,1 för läsbarhet
  let result = '';
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  for (const b of bytes) {
    result += chars[b % chars.length];
  }
  return result;
}
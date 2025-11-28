export function shortCryptoId(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // utan O,0,I,1 för läsbarhet
  let result = '';
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  for (const b of bytes) {
    result += chars[b % chars.length];
  }
  return result;
}

export function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
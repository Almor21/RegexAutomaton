const letters = "&1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const VALID_LETTERS = letters.split('');

const symbols = "*?|+";
export const VALID_SYMBOLS = symbols.split('');

export const VALID_CHARS = symbols.concat(letters);
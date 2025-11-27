// Simulating a symmetric encryption algorithm (AES-like)
// In a real-world scenario, this would use window.crypto.subtle

const SECRET_KEY = "DEVOTE_SECURE_ELECTION_2025";

export const encryptData = (data: any): string => {
  try {
    const jsonStr = JSON.stringify(data);
    // Simulation: Base64 encode + Reverse string + Salt to look like ciphertext
    const base64 = btoa(jsonStr);
    const reversed = base64.split('').reverse().join('');
    return `0x${reversed}`; // Hex-like prefix
  } catch (error) {
    console.error("Encryption failed", error);
    return "";
  }
};

export const decryptData = (cipherText: string): any => {
  try {
    // Reverse the process
    if (!cipherText.startsWith("0x")) return null;
    const reversed = cipherText.substring(2);
    const base64 = reversed.split('').reverse().join('');
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Decryption failed", error);
    return null;
  }
};

// Simple hash function for the blockchain
export const generateHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
};
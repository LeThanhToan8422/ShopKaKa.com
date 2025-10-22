import forge from 'node-forge';

/**
 * RSA decryption utility for game account passwords
 * Decrypts RSA2048 encrypted data using private key from environment variables
 */

// Get private key from environment variable
const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY || "";

/**
 * Format the private key by adding proper headers and footers if needed
 * @param key - The private key string
 * @returns Formatted private key with proper headers/footers
 */
function formatPrivateKey(key: string): string {
  const cleanKey = key.replace(/-----BEGIN PRIVATE KEY-----/g, '')
                    .replace(/-----END PRIVATE KEY-----/g, '')
                    .replace(/\s+/g, '')
                    .trim();
  
  return `-----BEGIN PRIVATE KEY-----\n${cleanKey.match(/.{1,64}/g)?.join('\n') || cleanKey}\n-----END PRIVATE KEY-----`;
}

/**
 * Decrypt RSA2048 encrypted text data
 * @param encryptedText - Base64 encoded encrypted string
 * @returns Decrypted plain text
 */
export function decryptRSAText(encryptedText: string): string {
  if (!encryptedText) return '';
  
  try {
    // Check if private key is available
    if (!PRIVATE_KEY) {
      console.error('Private key not found in environment variables');
      return encryptedText;
    }
    
    // Format the private key
    const formattedKey = formatPrivateKey(PRIVATE_KEY);
    
    // Parse the private key
    const privateKey = forge.pki.privateKeyFromPem(formattedKey);
    
    // Decode the base64 encrypted text
    const encryptedBytes = forge.util.decode64(encryptedText);
    
    // Try different decryption methods
    try {
      // First try RSA-OAEP (most common)
      const decrypted = privateKey.decrypt(encryptedBytes, 'RSA-OAEP');
      return decrypted;
    } catch (oaepError) {
      try {
        // Fallback to RSAES-PKCS1-V1_5
        const decrypted = privateKey.decrypt(encryptedBytes, 'RSAES-PKCS1-V1_5');
        return decrypted;
      } catch (pkcs1Error) {
        console.error('RSA decryption failed with both methods');
        return encryptedText; // Return encrypted text if decryption fails
      }
    }
  } catch (error) {
    console.error('RSA Decryption error:', error);
    return encryptedText; // Return encrypted text if decryption fails
  }
}
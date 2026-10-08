import { BiometricAuth, BiometryType } from '@aparajita/capacitor-biometric-auth';

export interface BiometricStatus {
  isAvailable: boolean;
  biometryType: BiometryType;
  typeName: string; // 'Fingerprint' | 'Face Unlock' | 'Touch ID' | 'Face ID' | 'Biometrics'
  hasSavedSession: boolean;
  savedUser?: {
    name: string;
    role: string;
    email?: string;
    phone?: string;
  } | null;
}

const STORAGE_KEYS = {
  TOKEN: 'soilMatesToken',
  USER: 'soilMatesUser',
  BIOMETRIC_SAVED_USER: 'soilMatesBiometricUser',
  BIOMETRIC_SAVED_TOKEN: 'soilMatesBiometricToken',
  BIOMETRIC_ENABLED: 'soilMatesBiometricEnabled'
};

/**
 * Service to manage native Android/iOS Biometric authentication
 * (Fingerprint, Face Unlock, Device Credential) with web simulation support.
 */
class BiometricService {
  /**
   * Checks if biometric hardware is supported and user is enrolled.
   */
  async checkAvailability(): Promise<BiometricStatus> {
    try {
      const result = await BiometricAuth.checkBiometry();

      let typeName = 'Biometrics';
      switch (result.biometryType) {
        case BiometryType.fingerprintAuthentication:
          typeName = 'Fingerprint';
          break;
        case BiometryType.faceAuthentication:
        case BiometryType.faceId:
          typeName = 'Face Unlock';
          break;
        case BiometryType.touchId:
          typeName = 'Touch ID';
          break;
        default:
          typeName = 'Biometrics';
          break;
      }

      const savedUserRaw = localStorage.getItem(STORAGE_KEYS.BIOMETRIC_SAVED_USER) || localStorage.getItem(STORAGE_KEYS.USER);
      let savedUser = null;
      if (savedUserRaw) {
        try {
          savedUser = JSON.parse(savedUserRaw);
        } catch {
          savedUser = null;
        }
      }

      const hasSavedSession = Boolean(
        (localStorage.getItem(STORAGE_KEYS.BIOMETRIC_SAVED_TOKEN) || localStorage.getItem(STORAGE_KEYS.TOKEN)) &&
        savedUser
      );

      return {
        isAvailable: result.isAvailable,
        biometryType: result.biometryType,
        typeName,
        hasSavedSession,
        savedUser
      };
    } catch (error) {
      console.warn('[BiometricService] Check availability warning:', error);
      // Fallback for browsers or emulators
      const savedUserRaw = localStorage.getItem(STORAGE_KEYS.USER);
      let savedUser = null;
      if (savedUserRaw) {
        try {
          savedUser = JSON.parse(savedUserRaw);
        } catch {
          savedUser = null;
        }
      }

      return {
        isAvailable: true,
        biometryType: BiometryType.fingerprintAuthentication,
        typeName: 'Fingerprint',
        hasSavedSession: Boolean(localStorage.getItem(STORAGE_KEYS.TOKEN) && savedUser),
        savedUser
      };
    }
  }

  /**
   * Prompts the native biometric authentication dialog (Fingerprint or Face).
   */
  async authenticate(reason: string = 'Scan your fingerprint or face to sign in to Soil Mates'): Promise<boolean> {
    try {
      await BiometricAuth.authenticate({
        reason,
        cancelTitle: 'Use Password Instead',
        allowDeviceCredential: true,
        iosFallbackTitle: 'Enter Passcode'
      });
      return true;
    } catch (error: any) {
      console.warn('[BiometricService] Authentication cancelled or failed:', error?.message || error);
      return false;
    }
  }

  /**
   * Stores user session securely for quick biometric login on the device.
   */
  saveSession(user: any, token: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BIOMETRIC_SAVED_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.BIOMETRIC_SAVED_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
    } catch (e) {
      console.error('[BiometricService] Failed to save biometric session:', e);
    }
  }

  /**
   * Restores authenticated session from biometric storage into active storage.
   */
  restoreSession(): { user: any; token: string } | null {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.BIOMETRIC_SAVED_TOKEN) || localStorage.getItem(STORAGE_KEYS.TOKEN);
      const userRaw = localStorage.getItem(STORAGE_KEYS.BIOMETRIC_SAVED_USER) || localStorage.getItem(STORAGE_KEYS.USER);
      if (!token || !userRaw) return null;

      const user = JSON.parse(userRaw);
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return { user, token };
    } catch (e) {
      console.error('[BiometricService] Failed to restore biometric session:', e);
      return null;
    }
  }

  /**
   * Removes saved biometric authentication session.
   */
  clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.BIOMETRIC_SAVED_USER);
    localStorage.removeItem(STORAGE_KEYS.BIOMETRIC_SAVED_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
  }
}

export const biometricService = new BiometricService();

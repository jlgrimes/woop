export interface WoopFile {
  url: string;
  name: string;
  size: number;
  contentType: string;
}

export interface WoopData {
  text: string;
  expiresAt: number;
  file?: WoopFile;
}

export interface WoopItem {
  text: string;
  encryptedValue: string;
  expiresAt?: number;
  file?: WoopFile;
}

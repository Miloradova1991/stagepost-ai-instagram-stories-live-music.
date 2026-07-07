export function isHostedDeployment() {
  return process.env.VERCEL === "1" || process.env.VERCEL === "true";
}

export function isBlobStorageEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function usesRemoteAssets() {
  return isHostedDeployment() || isBlobStorageEnabled();
}

export function canPersistApiKeyLocally() {
  return !isHostedDeployment();
}

export function canOpenLocalOutputFolder() {
  return !usesRemoteAssets();
}

export function isRemoteAssetUrl(value: string | null | undefined) {
  return Boolean(value && /^https?:\/\//.test(value));
}

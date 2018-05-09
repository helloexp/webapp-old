import { isAuthenticated } from 'redux/modules/account/auth';

export function generateWishlistSku(onlineId, colorCode, sizeCode) {
  return `${onlineId}-${colorCode}${sizeCode ? `-${sizeCode}` : ''}`;
}

export function splitWishlistSku(wishlistSku) {
  const [onlineId, colorCode, sizeCode] = wishlistSku.split('-');

  return { onlineId, colorCode, sizeCode: sizeCode || '' };
}

export function getAllWishlistSkus(local = [], synced = []) {
  const localAndSyncedSkus = [...local, ...synced].map(({ id } = {}) => id);

  return [...new Set(localAndSyncedSkus)];
}

export function getUnsyncedWishlistItems(ahead = [], behind = []) {
  return ahead.filter(aheadItem => !behind.find(behindItem => aheadItem.id === behindItem.id));
}

export function getSecondsSinceEpoch() {
  return Math.floor((new Date()).getTime() / 1000);
}

export function isUserTokenValid(user = {}) {
  return isAuthenticated(user) && getSecondsSinceEpoch() < user.tokenExpiresIn;
}

export function isStorageSupported(type) {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';

    storage.setItem(testKey, '1');
    storage.removeItem(testKey);

    return true;
  } catch (error) {
    return false;
  }
}

class Storage {
  setItem = (key, data) => {
    const json = JSON.stringify(data);

    this[key] = json;
  }

  getItem = key => this[key] || null;

  removeItem = (key) => {
    delete this[key];
  };
}

export const LocalStorage = isStorageSupported('localStorage') ? window.localStorage : new Storage();
export const SessionStorage = isStorageSupported('sessionStorage') ? window.sessionStorage : new Storage();

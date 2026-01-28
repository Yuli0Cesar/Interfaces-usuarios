// Sencillo wrapper sobre IndexedDB para almacenar blobs de video

const DB_NAME = 'jdmVideoStore';
const DB_VERSION = 1;
const STORE_NAME = 'videoFiles';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('videoId', 'videoId', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function saveBlob(key, videoId, blob) {
  return openDB().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ key, videoId, blob });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  }));
}

export function saveVideoFile(videoId, file) {
  if (!file) return Promise.resolve();
  const key = `video:${videoId}`;
  return saveBlob(key, videoId, file);
}

export function getVideoUrl(videoId) {
  const key = `video:${videoId}`;
  return openDB().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => {
      const record = req.result;
      if (!record || !record.blob) {
        resolve(null);
        return;
      }
      try {
        const url = URL.createObjectURL(record.blob);
        resolve(url);
      } catch (e) {
        resolve(null);
      }
    };
    req.onerror = () => reject(req.error);
  }));
}

export function deleteVideoFiles(videoId) {
  return openDB().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('videoId');
    const range = IDBKeyRange.only(videoId);
    const request = index.openCursor(range);

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        store.delete(cursor.primaryKey);
        cursor.continue();
      } else {
        resolve();
      }
    };

    request.onerror = () => reject(request.error);
  }));
}

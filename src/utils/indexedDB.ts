const DB_NAME = 'exampleDB';
const DB_VERSION = 1;
const STORE_NAME = 'certificates';
import { Certificate, CertificateWithoutId } from '../components/data/data'; // Importing the types

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

const addData = async (data: CertificateWithoutId[]): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  data.forEach((item) => {
    // Convert Date objects to ISO strings before adding to the store
    store.add({
      ...item,
      validFrom: item.validFrom.toISOString(),
      validTo: item.validTo.toISOString(),
    });
  });

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

const getData = async (): Promise<Certificate[]> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      // Convert ISO strings back to Date objects
      const result = request.result.map((item: any) => ({
        ...item,
        validFrom: new Date(item.validFrom),
        validTo: new Date(item.validTo),
      }));
      resolve(result);
    };
    request.onerror = () => reject(request.error);
  });
};

export { addData, getData };

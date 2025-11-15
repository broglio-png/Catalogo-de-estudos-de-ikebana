
// FIX: Import `React` to resolve the 'Cannot find namespace React' error.
import React, { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = useCallback((value) => {
    try {
      setStoredValue(currentStoredValue => {
        const valueToStore = value instanceof Function ? value(currentStoredValue) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.error(error);
    }
  }, [key]);
  
  useEffect(() => {
      const handleStorageChange = (e: StorageEvent) => {
          if (e.key === key && e.newValue) {
              try {
                setStoredValue(JSON.parse(e.newValue));
              } catch (error) {
                console.error("Error parsing storage value on change:", error);
              }
          }
      };
      window.addEventListener('storage', handleStorageChange);
      return () => {
          window.removeEventListener('storage', handleStorageChange);
      };
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;

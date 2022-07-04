const isEqual = (a, b) => {
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
      return a === b;
  }

  if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
  }

  return JSON.stringify(a) === JSON.stringify(b);
};

export default function storeDevToolInit(storeInstance, storeInitialState = {}) {
  let cache = {};
  let unsubscribe;

  window.store = function (mask = '', includeUnchangedFields = true) {
    const search = mask.toLowerCase();
    const fields = Object.entries(storeInstance.getState()).filter(([key]) =>
      key.toLowerCase().includes(search)
    );

    if (includeUnchangedFields) {
      return Object.fromEntries(fields);
    }

    return Object.fromEntries(
      fields
        .filter(([key, value]) => !isEqual(storeInitialState[key], value))
    );
  };

  window.store.subscribe = function (mask = '', includeUnchangedFields = true) {
    function compare() {
      const state = window.store(mask, includeUnchangedFields);

      const result = Object.fromEntries(
        Object.entries(state).filter(([key, value]) => value !== cache[key])
      );

      if (Object.keys(result).length > 0) {
        console.log(result);
      }
      cache = state;
    }
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = storeInstance.subscribe(compare);
    compare();
    window.localStorage.setItem(
      'DEV_STORE_SUBSCRIBE',
      JSON.stringify({ mask, includeUnchangedFields })
    );
  };

  window.store.unsubscribe = function () {
    if (unsubscribe) {
      unsubscribe();
    }
    window.localStorage.removeItem('DEV_STORE_SUBSCRIBE');
  };

  const toSubscribe = window.localStorage.getItem('DEV_STORE_SUBSCRIBE');
  if (toSubscribe) {
    const { mask, includeUnchangedFields } = JSON.parse(toSubscribe);
    window.store.subscribe(mask, includeUnchangedFields);
  }
}

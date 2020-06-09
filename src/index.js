export default function storeDevToolInit(storeInstance) {
  let cache = {};
  let unsubscribe;

  window.store = function (mask = '', includeEmpty = false) {
    const search = mask.toLowerCase();
    const fields = Object.entries(storeInstance.getState()).filter(([key]) =>
      key.toLowerCase().includes(search)
    );

    if (includeEmpty) {
      return Object.fromEntries(fields);
    }

    return Object.fromEntries(
      fields
        .filter(([, value]) => Boolean(value))
        .filter(([, value]) => !Array.isArray(value) || value.length > 0)
        .filter(
          ([, value]) =>
            !typeof value === 'object' || Object.keys(value).length > 0
        )
    );
  };

  window.store.subscribe = function (mask = '', includeEmpty = false) {
    function compare() {
      const state = window.store(mask, includeEmpty);

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
      JSON.stringify({ mask, includeEmpty })
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
    const { mask, includeEmpty } = JSON.parse(toSubscribe);
    window.store.subscribe(mask, includeEmpty);
  }
}

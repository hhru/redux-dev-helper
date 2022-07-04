## Утилита для трека состояния стора

Добавляет объект `store` в глобальной области видимости

С его помощью можно получить состояние стора и подписаться на стор. Подписка на стор сохраняется для домена (ls).

### Возможности

1. Получить состояние стора: `store()`. По умолчанию, функция выводит все поля стора.

2. Зафильтровать поля стора: `store(substring)`. substring. Функция выведет все поля стора, где фигурирует подстрока. Метод фильтрации не чувствителен к регистру.

3. Вывести все изменившиеся после инициализации поля, включая пустые. `store(substring, false)`

### Подписки

Подписка сохраняется в localStorage, поэтому после обновления страницы все подписки продолжат работу.

Важно: одновременно может быть активна только одна подписка. Сделано специально, чтобы не запутаться при разработке в подписках.

Подключение новой подписки затрет предыдущую.

Параметры подписки аналогичны `store`. При создании подписки она автоматически вызовется первый раз. Подписка фильтрует изменившиеся поля в сторе и выводит только то, что изменилось.

1. Подписка на весь стор: `store.subscribe()`.
2. Подписка по подстроке названия поля: `store.subscribe(substring)`.
3. Выводить только поля, изменившиеся после инициализации: `store.subscribe(substring, false)`.

### Как использовать:

В проекте подключаете файл и вызываете функцию передавая в нее инстанс стора:

```js
import storeDevToolInit from '@hh.ru/redux-dev-helper';

storeDevToolInit(storeInstance, storeInitialState);
```

После этого у вас будет доступна глобальная переменная store.

Рекомендуется подключать файл в DEVELOPMENT режиме:

```js
if (process.env.NODE_ENV === 'development') {
  import('@hh.ru/redux-dev-helper').then(({ default: storeDevToolInit }) =>
    storeDevToolInit(storeInstance, storeInitialState)
  );
}
```

Также убедитесь, что этот код не запускается на сервере.

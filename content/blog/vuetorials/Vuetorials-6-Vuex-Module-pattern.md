---
title: '[Vuetorials] 6. Vuex Module pattern'
date: 2018-11-16 09:47:02
---

![](./vuetorials.png)

## [구조](https://vuex.vuejs.org/guide/structure.html)

Vuex 를 구성할 때 `action`, `mutation`, `getter` 이런 식으로 나누거나 각각의 module 을 기준으로 나눠 `index.js`에서 세 가지를 모두 기술할 수 있음. `modules`를 나눠 구성하는 경우 root 에서 사용하는 `action`과 `mutation`을 분리할 수 있음. `action`과 `mutation`은 **actionType 을 공유**하기 때문에 `types.js`로 별도 관리하기도 함.

```
└── store
    ├── index.js          # where we 'assemble' modules and export the store
    ├── actions.js        # root actions
    ├── mutations.js      # root mutations
    └── modules
        ├── A             # A module
        │   ├── index.js
        │   └── types.js
        └── B             # B module
            ├── index.js
            └── types.js
```

## [Modules](https://vuex.vuejs.org/guide/modules.html)

각각을 `modules`로 작성할 경우 다음과 같이 작성할 수 있음.

```js
export default {
  key: {
    state: Object,
    namespaced?: Boolean,
    mutations?: Object,
    actions?: Object,
    getters?: Object,
    modules?: Module
  },
  ...
}
```

다른 것은 이전 포스팅에서 다 다룬 내용이고 `namespaced`라는 것이 있음.

#### namespaced

기본적으로 모듈에서 작성된 action, mutation, getter 들은 global namespace 에 등록됨. 이 때 `namespaced: true`로 지정을 해주면 **해당 모듈의 namespace 로 제한됨.** (완전 매력있는 API임.) 이 기능과 action type을 상수로 분리하여 작성을 했다면 한 가지 추가 작업이 더 필요함. 다음의 경우를 보자.

```js
// todos/type.js
export const ADD_ITEM = 'ADD_ITEM'
```

이 action type을 action과 mutation과 `mapActions`해주는 곳에서 같이 사용한다고 가정했을 때,

```js
// todos/actions.js
export default {
  [ADD_ITEM]({ commit }, payload) {
    commit(ADD_ITEM, payload.newItem)
  },
}
```

```js
// todos/mutations.js
export default {
  [ADD_ITEM](state, newItem) {
    state.items.push(newItem)
  },
}
```

Vuex에서 바로 제공되는 `mapActions` helper를 바로 쓸 수 없음. namespace를 넣어줘야 함. 이 namespace는 module에 등록했을 때의 key 값이 됨.

```js
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('todos', [ADD_ITEM]),
  },
}
```

이 경우 저 액션은 `todos/ADD_ITEM`이 됨. 개인적으로는 `createNamespacedHelpers`를 쓰는 게 더 좋아보임.

```js
// import { mapActions } from 'vuex'
import { createNamespacedHelpers } from 'vuex'

const { mapActions } = createNamespacedHelpers('todos')

export default {
  methods: {
    ...mapActions([ADD_ITEM]),
  },
}
```

위와 같이 modules에서 정의한 **namespace로 한 번 wrapping 후** `mapActions`로 binding 해야 함. 이렇게 해주면 action type에 자동으로 `todos`라는 namespace가 추가됨.

#### modules

중첩 모듈 작성이 가능함. `module` 내부에 트리 형식으로 또 `module`을 등록할 수 있음. 이 경우에도 `namespaced`를 지정해주면 `namespace`가 중첩되어 접근할 수 있음. namespace 중복은 `/`으로 중첩됨. ([관련 코드](https://github.com/vuejs/vuex/blob/dev/src/module/module-collection.js#L16))

### 그 외

- Vuex 생성자에 `strict: true`로 지정하면 `mutations`이외에 상태 변이에서 에러를 발생시킬 수 있음.
- `Vuex.Store`에서 제공하고 있는 API 가 여럿 있음. `subscribe`, `registerModule` 등. 활용하면 좋은 기능을 추가할 수 있을 것 같다는 막연한 생각.

### 마무리

`redux`, `mobx`, `mobx-state-tree` 등의 상태 관리 라이브러리가 많음. `mutation`이란 부분은 MobX 와 비슷하고 트리 형식으로 구성하는 것은 MST 와 비슷하고 action 을 dispatch 하는 부분에 있어서는 redux 와 비슷한 듯. 그리고 다시 한 번 느끼는 거지만 Vue 쪽은 많은 편의성을 제공하려고 하다보니 그런건지 문서 상에서만 접할 수 있는 (코드 상으로는 파악이 불가능한) 그래서 꼭 읽어봐야 하는 그런 것들이 많은 듯. Vuex의 best practice에 대해서는 다음 포스팅에 이어서.

### Reference

- https://stackoverflow.com/questions/40390411/vuex-2-0-dispatch-versus-commit

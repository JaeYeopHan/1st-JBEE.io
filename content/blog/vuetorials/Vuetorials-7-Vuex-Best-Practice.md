---
title: '[Vuetorials] 7. Vuex Best Practice로 가는 여정'
date: 2018-11-17 17:09:44
---

![](./vuetorials.png)

Vuex에 대한 설명은 다음 두 글을 첨부함.

- [5. Vuex API](../Vuetorials-5-Vuex/)
- [6. Vuex Module pattern](../Vuetorials-6-Vuex-Module-pattern/)

진행하고 있는 프로젝트에서 Vuex를 어떻게 하면 잘 사용할 수 있을까 고민을 했고 그 과정을 기록함. 총 다섯 단계로 나누어져 있음.

관전 포인트는 다음과 같음.

- String을 덜 사용할 수는 없는가?
  - 오류 발생가능성을 낮추기 위해
- 생산성이 좋은가?
- 가독성이 좋은가?
- 유지보수에는 적절한가?

예제 코드는 실제 product 코드 대신 Todo application 예제를 사용함. [refactoring pull request](https://github.com/JaeYeopHan/vuex-best-practice-lab/pull/1/files)

> Let's Refactoring 🚧

## Step 1. module pattern with namespace

Vuex에서 관리하게 되는 상태가 커지면 커질수록 `state`, `action`, `mutation` 관리가 제대로 이뤄지지 않음. 그렇기 때문에 Vuex 공식 문서에서도 **module**이란 것을 소개하고 있음. 또한 Vuex에서는 `namespaced`라는 아주 훌륭한 API를 지원하고 있기 때문에 여기까지는 대부분의 Vue application에서는 적용하고 있을 것 같음.

```js
// @/store/modules/todos/index.js

export default new Vuex.Store({
  modules: {
    todos,
    // other modules...
  },
})
```

`@/store/modules/todos/` directory 밑에 각각 `state.js`, `getters.js`, `mutations.js`, `actions.js`를 만들어두고 `todos/index.js`에서 `namespaced: true`로 export 해줌.

컴포넌트에서 Vuex는 다음과 같이 사용할 수 있음.

```js
// todo.vue
// state
data() {
  return {
    allItems: this.$store.state.todos.items,
  };
},
// getters
computed: {
  doneItems() {
  	return this.$store.getters["todos/doneItems"];
  },
  activeItems() {
    return this.$store.getters["todos/activeItems"];
  }
}
// actions
method: {
  addItem() {
    this.$store.dispatch("todos/addItem", { newItem });
  }
}
```

실제 product 코드에서는 state, getter 등이 크지 않으면 `index.js` 에서 전부 처리하고 분리가 필요한 부분만 분리하여 작성하고 있음.

### Problem!

- 안 그래도 `.` 이 깊어지는 코드인데 `todos` 라는 **namespace가 추가**되면서 한 depth 또 추가됨.
- Vuex에 정의된 모든 state, getters, actions에 접근이 가능함.
- 만약 `todos` 라는 namespace가 변경된다면...?
- `doneItems`, `addItem` 등등의 이름이 변경된다면...?

**끔찍함.** 위와 같은 이유로 1번은 고려하지 않음. (사실 난 중복된 string을 가만히 볼 수 없는 병에 걸려있음.)

## Step 2. Binding helpers

이 부분도 Vuex 공식 문서에서 나옴. 보통 `react-redux`, `mobx-react` 이런 라이브러리에서 제공하는 기능인데 Vuex에서는 자체적으로 제공함. 근데 이 helper API가 일관성이 없는게 문제임. 그리고 namespace가 들어가게 되면 작업이 추가됨.

```js
import { mapActions, mapState, mapGetters } from "vuex";

computed: {
  ...mapState("todos", {
    allItems: ({ items }) => items,
  }),
  ...mapGetters("todos", {
	  doneItems: "doneItems",
  	activeItems: "activeItems"
	}),
},
methods: {
  ...mapActions("todos", [
    "addItem",
  ])
}
```

바인딩을 해줄 때, 첫번째 인자로 namespace를 추가해줘야 함. (namespace가 별도로 존재하지 않을 경우 바로 binding 객체를 넣어줌.)

### Problem!

- Step 1의 2번 3번 문제점과 동일

이 binding helper는 depth를 줄이는 데에는 성공적이지만 아직 string 중복 처리는 이뤄지지 않음.

## Step 3. binding 시 사용되는 namespace를 제거하자.

Vuex에서 제공하는 [createNamespacedHelpers](https://github.com/vuejs/vuex/blob/dev/src/helpers.js#L117)란 API를 사용할 수 있음,

```js
// @/store/modules/todos/index.js

import { createNamespacedHelpers } from 'vuex'
import { NAMESPACE } from './types'

const { mapState, mapGetters, mapActions } = createNamespacedHelpers(NAMESPACE)

export { mapState, mapGetters, mapActions }
export default {
  /* namespaced, state, getters, mutations, actions */
}
```

컴포넌트에서 바로 정의해서 사용해도 되지만 store 단에서 정의하고 export 함. 컴포넌트 단에서 `NAMESPACE`를 import할 필요는 없다는 판단하에 진행함. 이렇게 정의해두고 이 namespace를 추가한 helper binding 함수를 사용하자.

```js
// import { mapActions, mapState, mapGetters } from "vuex";
import { mapActions, mapState, mapGetters } from "@/store/modules/todos";

computed: {
  ...mapState({
    allItems: ({ items }) => items,
  }),
  ...mapGetters({
	  doneItems: "doneItems",
  	activeItems: "activeItems"
	}),
},
methods: {
  ...mapActions([
    "addItem",
  ])
}
```

namespace 중복을 제거했음. 아직 Step 1의 3번 문제점이었던 constant들이 남아있음.

## Step 4. Extract constant in action

Vuex 코드를 작성하다보면 `action`과 `mutation` 에서 많은 중복이 발생함. `mutation`에서 정의한 것을 그대로 `action` 에서 `commit` 해줘야 하기 때문임. (그렇다고 컴포넌트에서 commit 하면 안 됨... [참고](https://jaeyeophan.github.io/2018/11/07/Vuetorials-5-Vuex/#mutations)) 그래서 이 부분을 상수로 추출고 이를 공통으로 사용할 수 있음.

일단 `action`과 `mutation`에서 사용되는 type을 별도 파일로 분리하자.

```js
// @/store/module/todos/types.js
// namespace
export const NAMESPACE = 'todos'
// actions
export const ADD_ITEM = 'ADD_ITEM'
```

이에 따라 정의한 `mutation.js`와 `actions.js`도 변경됨.

```js
// @/store/mdules/todos/mutations.js

import * as actions from './types'

export default {
  [actions.ADD_ITEM](state, newItem) {
    state.items.push(newItem)
  },
}
```

```js
// @/store/mdules/todos/actions.js

import * as actions from './types'

export default {
  [actions.ADD_ITEM]({ commit }, payload) {
    commit(actions.ADD_ITEM, payload.newItem)
  },
}
```

이제 이 constant를 컴포넌트에서도 사용하자.

```js
// todo.vue

import { mapActions, mapState, mapGetters } from '@/store/modules/todos'
import * as actions from '@/store/modules/todos/action-types'
export default {
  methods: {
    ...mapActions([actions.ADD_ITEM]),
  },
}
```

## Step 5. Extract constant in getters

나와 같은 병에 걸렸다면 `getters`에서의 중복도 불편할 것이라 생각됨. 이제 getters의 상수를 제거하자.

```js
// @/store/mdules/todos/getters.js

export const DONE_ITEMS = 'DONE_ITEMS'
export const ACTIVE_ITEMS = 'ACTIVE_ITEMS'

export default {
  [DONE_ITEMS]: state => state.items.filter(todo => todo.isDone),
  [ACTIVE_ITEMS]: state => state.items.filter(todo => !todo.isDone),
}
```

컴포넌트에서 getters를 바인딩하자.

```js
// todo.vue

import * as getters from '@/store/modules/todos/getters'

export default {
  computed: {
    ...mapState({
      allItems: ({ items }) => items,
    }),
    ...mapGetters({
      doneItems: getter.DONE_ITEMS,
      activeItems: getter.ACTIVE_ITEMS,
    }),
  },
}
```

사실 이 getters는 이렇게도 표현 가능함. (as `mapActions`)

```js
...mapGetters([
  getter.DONE_ITEMS,
  getter.ACTIVE_ITEMS,
]),
```

`getters`는 컴포넌트에서 **값**으로 사용되기 때문에 `doneItems`와 `activeItems`로 다시 mapping 시킴. 이게 더 깔끔해 보임. (물론 개취의 문제일 수도)
`getters`와 `actions`를 전부 상수로 binding 했음. 이제 컴포넌트에서는 `this.doneItems` 이렇게 getter에 접근할 수 있고 `this[actions.ADD_ITEM]()` 이렇게 action에 접근할 수 있음.

> Vuex 코드를 작성하면서 발생한 문제점들을 어느정도 해결했음. :tada:

### JFYI

사실 원래 `getters`의 key값도 `types.js`에서 관리를 하려고 했으나

1. 컴포넌트 단에서 상수를 사용할 때, getters의 key값인지 action type인지 구분되지 않음.
2. `getters`의 key 값은 `getters`에서만 사용하므로 굳이 `types.js`에 위치할 필요가 없음.

`getters.js` 내부에서 상수로 분리 후 export 함. 그리고 `getters`로 `* as` 하면 action type과 구분지을 수 있음.

## Remained Task

### 1. 여러 modules 바인딩

한 컴포넌트에서 두 개 이상의 modules에 있는 action, getters 등을 바인딩해야 할 경우가 발생할 수 있음. 이렇게 되면 `mapActions`로 import할 수 없음. (name 충돌)

```js
// my-component.vue

import { mapActions as mapActionsOfTodo } from '@/store/todo'
import { mapActiosn as mapActiosnOfFilters } from '@store/filter'
```

이럴 경우, 이렇게 `as`를 통해 `Of-*` suffix로 사용할 수 있음. 또는,

```js
// my-component.vue

import * as todo from '@store/todo'

export default {
  computed: {
    todo.mapState({ ... }),
    todo.mapGetters({ ... }),
  }
}
```

이렇게 `todo`로 묶어서 import 한 후 사용할 수 있음. 개인적으로는 두번째 방법을 사용하고 있음.

### 2. 통일되지 않은 API 형태

`mapState({ ... })`, `mapGetters({ ... })`는 `{}`로 받고 `mapActions([ ... ])`는 `[]`로 받는다. 같은 binding helper인데 일관성이 없음. 이 부분을 해결하기 위해 mapAction을 `{}`하면 다음과 같음.

```js
methods: {
  ...mapAction({
    addNewItem: actions.ADD_ITEM,
  }),
  addItem() {
    // do something
    this.addNewITem(newItem);
  },
}
```

이게 더 좋은 것인지는 아직 잘 모르겠으나. `this[ADD_ITEM]` 형식을 사용하고 있음.

### 3. Nested Modules namespace

child module에서 parent module의 namespace 상수를 import하여 `createNamespaceHelpers`에 넘겨줄 namespace를 지정해주려고 했는데, 에러가 발생함. 아직 원인을 모르겠음. 보다 자세한 내용은 [Vuex nested modules createNamespaceHelpers Issue](https://github.com/JaeYeopHan/tip-archive/issues/35)를 참고.

## Final Step. Seperate action type and mutation type

Vuex를 계속 사용하다보니 컴포넌트에 노출되어야 하는 타입은 action type 뿐임. 또한 action에서 정의되는 type의 의미와 mutation에서 사용하는 type의 의미가 명확히 다름. 그래서 이 둘을 분리하기로 함. 분리를 하다보니 `types.js`라는 파일을 별도로 둘 필요가 없음. 컴포넌트에 노출되는 것은 action type만 노출되며 mutation type은 action에서 가져와 사용하는 방식을 취함.

```js
// modules/actions.js

import * as mutations from './mutations'

export const ADD_TODO = 'ADD_TODO'

export default {
  [ADD_TODO]({ commit }, payload) {
    commit(mutations.SET_NEW_ITEM, payload)
  },
}
```

```js
// modules/mutations.js

export const SET_NEW_ITEM = 'SET_NEW_ITEM'

export default {
  [SET_NEW_ITEM](state, payload) {
    const { item: newItem } = payload
    state.items.push(newItem)
  },
}
```

이렇게 두니 `actions.js`에서 action type이 정의되고 `mutations.js`에서 mutation type이 정의되고 getter type은 `getters.js`에서 정의되니 그 의미가 더욱 명확해졌음. 기존에 괜히 `types.js`에서 정의되고 있던 `NAMESPACE`는 `module/index.js`에서 관리하게 됨.

```js module/indes.js
import { createNamespacedHelpers } from 'vuex'
import actions from './actions'
import mutations from './mutations'

const NAMESPACE = 'todo'
const { mapState, mapGetters, mapActions } = createNamespacedHelpers(NAMESPACE)

export { mapState, mapGetters, mapActions }

export default {
  namespaced: true,
  state: {},
  actions,
  mutations,
  getters,
}
```

JavaScript의 `export`와 `export default`를 활용하여 보다 깔끔한 코드를 작성할 수 있음. Vuex의 모듈을 세 파일로 정의하게 됨. 이 상태들을 컴포넌트에서는 다음과 같이 사용할 수 있음.

```js
// my-component.vue

import * as todoStore from '@/store/todo'
import * as todoActions from '@/store/todo'
import * as todoGetters from '@/store/todo/getters'

export default {
  computed: {
    ...todoStore.mapGetters({
      getItems: todoGetters.GET_ITEMS,
    }),
  },
  methods: {
    ...todoStore.mapActions([todoActions.ADD_ITEM]),
    onClick() {
      this[todoActions.ADD_ITEM]
    },
  },
}
```

컴포넌트 단에서 `NAMESPACE`를 전혀 모른 상태에서 올바른 상태값을 가져다 사용할 수 있고 `string`을 남발하지 않고 중복을 줄여가며 올바른 상태값을 매핑(mapping)할 수 있게 되었다.

## Bonus

애플리케이션의 상태는 크게 두 가지로 나눌 수 있음. 도메인 영역과 UI의 상태. 이 두 가지가 하나의 모듈 안에서 구분없이 관리가 된다면 나중에 헬파티가 열림. 그래서 현재 프로젝트에서는 UI상태를 `view`로 감싸서 관리하고 있음.

_example_

```js
// @/store/todo/index.js

export default {
  // ...
  state: {
    todos: [ ... ],
    views: {
      isPopupOpen: true,
    }
  }
}
```

이런 식으로 UI와 관련된 상태는 따로 `views`로 묶어 구분지어 주고 있음.

## Recap

### In Vuex

- 상태 트리를 설계할 때, 기본적으로 `namespaced: true`로 진행.
- 디렉토리 이름과 namespace를 통일.
- UI 상태와 도메인 상태 구분지어서 관리.
- 바인딩 헬퍼는 `createNamespacedHelpers`로 custom하여 사용.
  - 생성된 binding helper들을 `export { ... }`로 컴포넌트에 노출.
  - 이를 노출하는 `index.js`에서 `NAMESPACE`를 정의.
- action, mutation, getter 의 각 타입들은 각 파일에서 정의.
  - action에서 필요한 mutation type들은 `import * as mutations from './mutations`로 가져와 사용.

### In Component

최대 다음 세 가지를 import 하여 Vuex와 mapping 할 수 있음.

```js
import * as [MODULE_NAME]Store from '@/store/[MODULE_NAME]'
import * as [MODULE_NAME]Actions from '@/store/[MODULE_NAME]'
import * as [MODULE_NAME]Getters from '@/store/[MODULE_NAME]/getters'
```

- state) arrow function + destructuring으로 분해해서 binding.
  - `...[MODULE_NAME]Store.mapState({ ... })`
  - `({ items }) => items`
  - use: `this.items`
- getter) `{ ... }`에 binding.
  - `...[MODULE_NAME]Store.mapGetters({ ... })`
  - `{ key: todoGetters.[GETTER_TYPE] }`
  - use: `this.[key]`
- action), `[...]`에 binding.
  - `...[MODULE_NAME]Store.mapActions([ ... ])`
  - `[ todoActions.ACTION_TYPE ]`
  - use: `this[todoActions.ACTION_TYPE]`

더 좋은 방법이 있다면 피드백 부탁드립니다 :)
관련 코드는 [Vuex best practice GitHub Repository](https://github.com/JaeYeopHan/vuex-best-practice-lab)에서 확인 가능합니다.

_감사합니다._

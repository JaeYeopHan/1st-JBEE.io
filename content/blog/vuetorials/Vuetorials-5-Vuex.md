---
title: '[Vuetorials] 5. Vuex API'
date: 2018-11-07 13:35:48
---

![](./vuetorials.png)

Vuex 가 왜 필요한지 그 배경에 대한 이야기는 과감히 스킵하겠음. 설치하는 과정도 스킵함. [공식 문서](https://vuex.vuejs.org/installation.html)에 아주 잘 나와 있음.

## Vuex API

Vuex 는 크게 네 가지로 볼 수 있음. `state`, `getter`, `action`, `mutation`. 그리고 컴포넌트와 연동시키기 위한 **바인딩 헬퍼(Binding helper)**가 있음. 이 바인딩 헬퍼는 [react-redux](https://github.com/reduxjs/react-redux) 나 [mobx-react](https://github.com/mobxjs/mobx-react) 같은 거라고 보면 됨. Vuex 에서는 아예 자체적으로 제공하고 있음.

### [state](https://vuex.vuejs.org/guide/state.html)

말 그대로 Vuex 를 적용할 애플리케이션의 상태를 말함. 객체 형식으로 기술할 수 있음.

```js
const state = {
  todos: [
    {
      //...
    },
  ],
}
```

컴포넌트에서는 `this.$store.state.todos`로 접근하거나 바인딩 헬퍼를 통해 컴포넌트와 연결(mapping)할 수 있음. 각각의 바인딩 헬퍼 함수인 `map-*` 에서 반환되는 값이 전부 객체이기 때문에 `...`을 통해 destructuring 할 수 있음.

```js
export default {
  // computed: mapState({
  //   todos: state => state.todos,
  // });
  computed: {
    // component computed properties
    ...mapState({
      // todos: state => state.todos
      todos: ({ todos }) => todos,
    }),
  },
}
```

각각의 바인딩 헬퍼에는 `String`, `String[]`, `Object` 등이 전달될 수 있음. 이들은 전부 [nomalizeMap](https://github.com/vuejs/vuex/blob/2a67103a1f5fc1448a694e7f83a5f0c6d6bc8262/src/helpers.js#L46)을 통해서 객체로 변환되어 매핑(mapping)됨.

### [getter](https://vuex.vuejs.org/guide/getters.html)

Vue component API 중 `computed` 같은 역할을 수행함. 그냥 `store`에서 접근한 후 컴포넌트에서 `computed` 하게 되면 재사용성이 떨어지므로 Vuex 에서부터 지원을 함.

```js
const getter = {
  doneTodos: state => state.todos.filter(todo => todo.done),
  getTodoById: state => id => state.todos.find(todo => todo.id === id),
}
```

컴포넌트에서는 payload 가 함께 일 경우, 메소드 형태로 호출(함수를 반환하므로)하고 없을 경우 property 로 접근할 수 있음.

```js
export default {
  computed: {
    // helper 없이 mapping
    // doneTodos() {
    //   return this.$store.getter.doneTodos;
    // }
    ...mapGetters(["doneTodos"])
    // or
    ...mapGetters({
      doneTodos: "doneTodos"
    })
  }
};
```

### [mutations](https://vuex.vuejs.org/guide/mutations.html)

```js
const mutations = {
  increment(state) {
    // mutate state
    state.count++
  },
  // with payload (n)
  increment(state, n) {
    state.count += n
  },
}
```

`mutation`은 값을 변경하는 로직들이 들어감. synchronous 하게 동작해서 순차적인 로직들만 선언함. 그래서 컴포넌트에서 호출되면 안 됨. 선언된 `mutation`들은 `action`에서 `commit`되는 형태로만 호출되어야 함. `mapMutation`이라는 바인딩 헬퍼가 있긴 한데, 컴포넌트와 mapping 할 일이 없으므로 거의 사용되지 않음. (사용하는 부분이 있다면 제보 바람.)

### [action](https://vuex.vuejs.org/guide/actions.html)

`action`은 `mutation`과 다르게 asynchronous 로 동작함. 그래서 `action`에서 비순차적 또는 비동기 처리 로직들을 선언함.

```js
const actions = {
  increment(context) {
    context.commit('increment')
  },
  incrementBy(context, payload) {
    context.commit('incrementBy', payload)
  },
}
```

`action`에서는 여러 `mutation`을 조합하여 `commit` 할 수 있음. Promise 나 async/await 을 통해서 비동기 작업들을 순차적으로 동작하게 할 수 있음. 이 `action`은 컴포넌트에서 `dispatch`되는 형식으로 사용됨.

```js
export default {
  methods: {
    triggerMethods() {
      this.$store.dispatch('increment')
      // or
      this.$store.dispatch('increment', {
        amount: 10,
      })
    },
  },
}
```

_with binding helper_

```js
export default {
  methods: {
    ...mapActions(["increment"])
    // or
    ...mapActions({
      increment: "increment"
    })
  }
};
```

### 마무리

Vuex 관련 포스팅을 하나로 마무리 지으려고 했는데 너무 길어져서 두 개로 나눔. 다음 포스팅에서는 Vuex를 module pattern으로 작성하는 부분에 대해 다룰 예정임. Vuex에 대한 총체적인 느낌도 다음 포스팅에서.

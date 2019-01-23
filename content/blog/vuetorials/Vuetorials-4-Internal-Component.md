---
title: '[Vuetorials] 4. 내장 컴포넌트'
date: 2018-11-05 20:48:30
category: 'vue'
---

![](./vuetorials.png)

Vue 에서 제공하고 있는 컴포넌트에 대해 알아보는 포스팅.

## [Slot](https://vuejs.org/v2/guide/components-slots.html)

일단 이 `Slot` 이라는 것은 Vue 에서 특별히 만든 그런 기능이 아님. [w3c/proposals - Slots-Proposal.md](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md)가 있음. 이 Slots 을 제대로 이해하려고 했더니 `Shadow Tree`까지 봐야함. 자세한 내용은 [관련 Spec 문서](http://w3c.github.io/webcomponents/spec/shadow/)를 봐야 함. [API](https://kr.vuejs.org/v2/api/#slot-1)는 별 게 없음. [공식 문서 설명](https://kr.vuejs.org/v2/guide/components.html#%EB%8B%A8%EC%9D%BC-%EC%8A%AC%EB%A1%AF)도 딱히 도움이 되진 않음. 일단 문법 자체가 처음 보면 익숙하지 않아서 부모-자식 이 부분이 약간 헷갈림.

#### 언제 쓰는가

Vue 에서 component 를 등록하고 렌더링할 때 보통 `props`로 데이터를 전달하거나 함수를 전달함. 그런데 children 에 `HTML` 또는 Vue 컴포넌트를 전달해서 렌더링하고 싶을 때가 있음. 이 때 slot 을 사용할 수 있음.

사실 React 사용자에겐 '응? 그냥 props 로 JSX 넘겨주면 되지 않나?' 할 수 있음. Vue 에서는 `components`에 컴포넌트를 등록해야 `template`에서 렌더링 할 수 있음. 근데 `props`로 전달함과 동시에 `components`에 등록할 수 없음.

그냥 props 로 전달하는 것보다 slot 이 더 Composability(합성 가능성)를 극대화 할 수 있는 기능이라고 하는데, 아직 감이 잘 안 잡힘.

```html
<template>
  <div id="container">
    <header><slot name="todo-header" /></header>
    <section><slot name="todo-container" /></section>
    <section><slot name="todo-filters" /></section>
    <footer><slot name="todo-footer" :author="&quot;Jbee&quot;" /></footer>
  </div>
</template>
```

slot 을 사용하는 가장 쉽고 대표적인 예제는 layout 을 잡기 위한 `.vue` 임. 위와 같이 `TodoLayout.vue`를 지정한 후,

```html
<template>
  <todo-layout>
    <!-- 정의한 컴포넌트를 slot으로 배포 -->
    <todo-title msg="TODO APP" slot="todo-header"> </todo-title>

    <!-- 축약형 -->
    <todo-container slot="todo-container" />

    <!-- scope를 통해 전달받은 props를 렌더링 -->
    <div slot="todo-footer" slot-scope="props">
      Copyright: @{{ props.author }}
    </div>
  </todo-layout>
</template>
```

이렇게 `todo-layout` 컴포넌트에 주입할 수 있음. `slot="A"` 어트리뷰트와 `<slot name="A" />`로 부모-자식 관계를 정의함.

## [component](https://vuejs.org/v2/api/#component)

**동적 컴포넌트**를 정의할 때 편리한 내장 컴포넌트 API. `is`라는 속성과 함께 사용됨.

```html
<template>
  <component v-bind:is="currentFilterView"></component>
  <!-- shorten -->
  <!-- <component :is="currentFilterView"></component> -->
</template>
<script>
  export default {
    component: {
      A,
      B,
      C,
    },
  }
</script>
```

`currentFilterView`는 Vue 컴포넌트에서 `data`로 지정된 속성임. 이 값에 `A` 또는 `B` 또는 `C` 값(컴포넌트이름)이 들어갈 경우, `component` 태그에 `A` 또는 `B` 또는 `C`컴포넌트가 렌더링 됨. `component` 태그 하위에 렌더링 되는게 아니라 바로 그 자리에 대체됨. 언뜻보면 단순한 `switch statement` sugar syntax 같지만, `keep-alive` 라는 내장 컴포넌트로 감싸줄 경우, cache 를 타게 됨.

## [keep-alive](https://vuejs.org/v2/api/#keep-alive)

[무엇이 어떻게 caching 되는가](https://github.com/vuejs/vue/blob/dev/src/core/components/keep-alive.js#L51)를 보면 인스턴스를 destroy 하지 않고 남겨둠. 즉 `keep-alive`라는 [추상 엘리먼트](https://github.com/vuejs/vue/blob/dev/src/core/components/keep-alive.js#L55)로 감싸져있는 컴포넌트들이 변경될 때, 사라질 인스턴스를 메모리에서 제거하지 않음. 이로 인해 불필요한 re-render 를 막고 활성화되을 때 변경되었던 상태가 비활성화 후 다시 활성화 되었을 때 유지 됨. [공식 문서](https://kr.vuejs.org/v2/api/#keep-alive)에서는 `transition` 내장 컴포넌트와 함께 사용하여 애니메이션 된 상태를 유지할 때 사용하기도 한다고 되어있음.

```html
<keep-alive> <component :is="currentFilterView"></component> </keep-alive>
```

아까 `component`를 정의한 부모에 `keep-alive` 태그로 감싸주면 됨. `keep-alive` 하위에 렌더링되는 컴포넌트들은 두 가지 hook 이 mixin 으로 추가됨. `activated`, `deactivated` 두 가지 훅(hook)은 해당 컴포넌트가 활성화 될 때, 비활성화 될 때 호출됨.

`:include`, `:exclude`디렉티브를 통해서 caching 을 적용할 컴포넌트와 적용하지 않을 컴포넌트를 적용할 수 있음. String, 정규식, 배열을 전달할 수 있음. ([관련 코드](https://github.com/vuejs/vue/blob/dev/src/core/components/keep-alive.js#L51))

### 마무리

`transition`과 `trasition-group`은 animation 관련하여 함께 다루는 것이 좋을 듯하여 이번 장에서 다루지 않음. React 는 개발자 너희들이 알아서 해라 식이었다면 Vue 는 `computed`도 그렇고 `keep-alive`도 그렇고 라이브러리 자체에서 제공하고 있는 API 를 충분히 활용할 수 있을 듯 함.

### Reference

- https://skyronic.com/blog/vue-slots-example
- https://daveceddia.com/pluggable-slots-in-react-components/

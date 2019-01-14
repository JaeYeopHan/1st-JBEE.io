---
title: '[Vuetorials] 2. 전반적인 concept'
date: 2018-10-21 16:27:24
---

![](./vuetorials.png)

## Single File Component

Vue 는 **싱글 파일 컴포넌트**로 작성하는 것을 권장함. 처음엔 이게 무슨 말인지 몰랐음. React 에선 SFC 는 Stateless Functional Component 인데… Vue 에선 SFC 가 Single File Component 임...

뭐 그렇다 치고. SFC 는 컴포넌트 단위로 View 를 구성할 때, HTML/CSS/JavaScript 를 어떤 방식으로 작성할 것인가에 대한 내용임.

일단 React 의 경우에는 HTML 을 JSX 라는 문법으로 표현하며 자연스럽게 JavaScript 와 하나가 됨. 불쌍한 CSS 는 혼자 별도 파일에 존재하여 import 되어 사용됨. 물론 `CSS-in-JS` 로 `.jsx` 또는 `.tsx`에 CSS 코드를 포함시키기도 함.

Angular 의 경우 세 가지는 모두 별도 파일로 기술됨.

Vue 는 하나의 `.vue`라는 파일에서 HTML/CSS/JavaScript 를 모두 기술하게 함. 이게 **싱글 파일 컴포넌트**임. 이 세 가지 다른 언어는 `<template>`, `<script>`, `<style>` 이라는 태그로 구분됨. 관심사의 분리라는 측면에서는 앵귤러와 리액트의 중간쯤 단계로 타협을 본 것 같음.

**'분리'**를 하게 되면 **"정적인 HTML 과 JavaScript 로직을 어떻게 유기적으로 연동할 것인가?"** 이 부분이 이슈가 됨. 애초에 분리를 하지 않은 React 는 JSX 문법으로 HTML 을 기술하기 때문에 JavaScript 와 아주 자연스럽게 연동됨. 앵귤러와 뷰는 그렇지 못하기 때문에 '**디렉티브**'라는 것이 있음.

## Directives

HTML 에 JavaScrpit 를 입히기 위해 추가하는 속성(attribute) 중 하나라고 생각하면 편함. `v-on`, `v-for` 등 여러 가지 디렉티브가 있고 custom directive 도 만들어서 등록할 수 있음. JSX 의 경우, onclick 을 `onClick`으로 표현했다면 Vue 의 디렉티브로는 `v-on:click` 이렇게 이벤트를 등록함. 축약형도 제공하고 있는데 이게 처음에는 조금 헷갈릴 수 있겠다 싶었음. `(v-on:click`은 `@click`으로 `v-bind:`는 `:`으로 축약 가능.) [공식 스타일 가이드](https://vuejs.org/v2/style-guide/#Directive-shorthands-strongly-recommended)에서는 둘 중 하나로 통일해서 작성하라고 함. 이 공식 스타일은 꼭 한 번 읽고 개발을 진행하는게 좋음.

## Component 를 생성

`.vue`에서 js 로직을 기술하기 위해 `<script>`를 만드는 방법은 기본적으로 3 가지 정도가 있음.

### 1. Vue.component

이 방식으로 컴포넌트를 선언하게 되면 그 컴포넌트는 전역 컴포넌트(Global Component)가 됨. JavaScript 를 처음 공부할 때부터 전역 공간을 오염시키지 않기 위해 [Name space pattern](http://asfirstalways.tistory.com/233)과 [Module pattern](http://asfirstalways.tistory.com/234)을 배웠던 기억이 남. 전역 컴포넌트는 다음과 같은 이슈가 있기 때문에 개인적으론 사용을 지양하고 싶음.

- 컴포넌트 이름이 충돌할 가능성이 많음
- VSCode extension 인 Vetur 는 local component 에 대해서만 prop auto-complete 을 지원함.
- 일단 디버깅 및 코드 구조 파악이 어려움.

전역 컴포넌트를 사용하기 좋은 예가 무엇이 있을지 연구 중임.

### 2. `export default { }`

`.vue` 파일에서 `<script>`에 이렇게 선언을 하면 지역 컴포넌트(Local Component)로 선언됨. 객체 형식으로 기술을 하게 됨. 사용하는 측은 별도로 import 한 후 `components`에 기술 후 사용할 수 있음.

### 3. vue-class-component 사용

[vue-class-component](https://github.com/vuejs/vue-class-component)라는 라이브러리를 사용하여 component 를 기술할 수 있음. 객체의 프로퍼티로 정의해줬던 것들을 클래스의 메소드나 클래스의 프로퍼티로 정의할 수 있음.

- `methods` -> `class member methods`
- `computed` -> `class property accessors`
- `data` -> `class properties`
- `life cycle hook` -> `class member methods`
- `prop` => `parameter of @Component` or `@prop`
- …

단, decorator 문법을 사용하므로 다른 babel-plugin 들이 필요함. TypeScript 기반이라면 `tsconfig.json`에서 `--experimentalDecorators` 옵션을 켜줘야 함. 객체로 컴포넌트를 정의하는게 불편했는데 이 부분은 아마 3.0 에서 native 로 지원할 예정인 듯.

### `+ new Vue({ ... })`

처음 `@vue/cli`로 스캐폴딩하면 `main.js`에 `new Vue({ render: ... })` 이렇게 되어있음. 이 Vue 인스턴스는 컴포넌트가 아니라 MVVM 패턴에서 VM(ViewModel)임. Vue 로 SPA 를 구성한다고 했을 때 이 인스턴스는 `main.js`에 하나만 있으면 되는 거임. 마치 `ReactDOM.render`가 하나 있는 것처럼. MVVM 에 대한 자세한 내용은 [캡틴 판교님의 글](https://joshua1988.github.io/web-development/vuejs/vuejs-tutorial-for-beginner/)을 확인해보면 됨. (처음에 Vue 를 접했을 때 이 부분이 Vue 인스턴스랑 컴포넌트랑 많이 헷갈렸음.)

## 나름의 장점

- `<template>`을 기술할 때 pure html 로도 기술할 수 있고 [pug(구 jade)](https://github.com/pugjs/pug)로도 기술할 수 있음.
- `<style>` 기술 시에도 `lang`으로 pure css, scss 등 선택할 수 있음.
- `<style scoped>`, `<style module>`을 통해 component 범위에서만 적용되는 style 을 기술 할 수 있음. (짱짱)
- JSX보다 표준에 가까움.
- cli가 좋음.

## 나름의 단점

- JSX 에선 뭐든 `{}`로 감싸서 전달하면 됐는데, 문법이 약간 헷갈림.
  - `<template>`에 `data` , `computed`, `prop` 등을 기술하는데 이중 대괄호를 씀.
  - 클래스 조작하기 위해 일반 `class` attribute 가 아니라 `v-bind:class`로 기술해야 함.
  - directive 에는 string 으로 기술.
  - 삼항 연산자를 넘기려면 string 안에 `[]`로 기술.
  - 토글을 위한 syntax 도 제공하는데 이건 `{}`로 기술.
    - lint가 이러한 부분을 잡아주지 못하기 때문에 팀 내에서 약속된 규칙을 만드는 것이 중요함.
- 컴포넌트 내부에서 관리되는 data 들이 immutable 이 아닌게 조금 찝찝함.
  - MobX 처음 봤을 때의 느낌임.
  - Redux 사용자들에겐 불편하게 다가갈 수 있을 듯 함.
  - 3.0 에서 immutable version 의 value 가 추가된다고 하는데 어떤 형태일지 궁금함.
- `<template>`에는 Single Root Element 가 들어가야 함.
  - Vue 의 함수형 컴포넌트로 multi-root components 를 렌더링 할 수 있긴 함. (3 장에서 다룰 예정.)
- Object-based API 임.
  - 3.0에 Class-based API가 나온다고 하니 기대 중.

## 개인적인 인상

Vue 를 홍보할 때 흔히 "러닝커브가 낮다."라는 말을 함. 그러나 초기 접근이 쉽다는 것은 그만큼 magic(눈에 보이지 않는 로직, 라이브러리에서 처리하는 로직)이 많다는 것임. 이를 제대로 이해하지 못한다면 애플리케이션의 크기가 커졌을 경우나 복잡한 로직 디버깅이 힘들어짐. 매직이 많다는 것이 나쁘다는 것은 아님. 함께 프로젝트를 진행하는 팀원 모두가 동일하게 이 매직에 대해 이해하고 있으면 매직은 발목을 붙잡는 것이 아니라 오히려 생산성을 증대시켜주는 녀석으로 바뀜.

그리고 배우기 쉽다는 것은 es6 선행 학습 없이, npm, webpack 등의 선행 학습 없이 jQuery 쓰듯이 script 태그에 cdn에 올려놓고 바로 시작할 수 있어서 생긴 말이 아닐까 하는 생각이 들었음.

`<template>`으로 HTML 을 분리하느냐 JSX 문법으로 HTML 을 흡수하느냐는 Vue 와 React 를 구분짓는 큰 요소 중 하나라고 생각함. 가독성 측면에서는 익숙한게 좋은 거라고 생각함. 딱히 둘 중 뭐가 더 나은지는 아직 잘 모르겠음. 아직 개발하기에는 JSX 가 편한 듯. 만약 프론트엔드 개발 인력 중 마크업을 작성하는 인력이 나뉘어져 있다면 Vue 가 더 편할지도 모르겠으나 멀티 루트를 지원하지 않는 관계로 쓸데없는 태그들이 추가될 수 있을 듯.

Vue는 기본적으로 Object-based API이다 보니 `,`(comma)를 정말 많이 쓰게 됨. 은근히 짜증남. 빨리 vue 3.0이 나와서 vue 자체적으로 지원하는 class-based API로 쓰고 싶음. 3.0이 TypeScript로 rewrite 된다고 해서 더 기대됨!

## Reference

- https://frontendsociety.com/why-you-shouldnt-use-vue-component-ff019fbcac2e

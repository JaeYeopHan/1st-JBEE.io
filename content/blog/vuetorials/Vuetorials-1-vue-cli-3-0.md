---
title: '[Vuetorials] 1. @vue-cli 3.0'
date: 2018-10-21 16:22:02
category: 'vue'
---

![](./vuetorials.png)

## 프로젝트 세팅

일단 뭐가 됐든 프로젝트 세팅부터 할 `CRA(Create React App)` 같은게 필요함. 그게 [@vue/cli](https://cli.vuejs.org/) 임. 2018 년 8 월 version 3 이 release 되었음.

```bash
$ npm install -g @vue/cli
```

```bash
$ vue create vue-app
```

`default` 랑 `Manually select features`를 선택할 수 있음. `default` 옵션은 말 그대로 기본적인 옵션으로 프로젝트를 생성해줌. `babel`과 `eslint` 기반임. 이렇게 **선택**을 할 수 있는건 CRA 보다 좋은 듯. 이전 버전에서 template 이라는 용어를 사용했다면 그 용어를 버리고 여러 옵션들을 조합하여 프로젝트를 스캐폴딩 해줌. template 으로는 여러 경우의 수를 모두 대응하기엔 한계가 있기 때문에 이러한 방법을 선택한 것 같음.

일단 처음이니 `default` 옵션으로 프로젝트를 생성해보겠음. yarn 쓸 지, npm 쓸 지도 선택할 수 있는데 npm 선택한 후 프로젝트 생성함.

```bash
$ cd vue-app
$ npm run serve
```

깔끔하게 vue application 이 띄워졌음. ('요즘것들'은 이 정도는 다 기본적으로 제공하고 있는 듯.)

스캐폴딩 된 프로젝트 구조는 다음과 같음. (VSCode 에서 해당 프로젝트를 열어보니 확장 프로그램이 권장됨. 바로 Vetur 설치함.)

```
├── README.md
├── babel.config.js
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
└── src
    ├── App.vue
    ├── assets
    │   └── logo.png
    ├── components
    │   └── HelloWorld.vue
    └── main.js
```

CRA 처럼 webpack config 등 여러 config 들을 숨겨버렸음. `babel.config.js`만 밖으로 나와있고 `preset`으로 `@vue/app`이 들어가있음. 이 녀석의 지원 범위라던가 스펙 등은 [@vue/babel-preset-app](https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/babel-preset-app/README.md)에서 확인할 수 있음. 그리고 다른 webpack 설정은 [@vue/cli-service 의 lib 디렉토리](https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/config/base.js)에서 확인할 수 있음.

babel 이 7 version 으로 올라가면서 전부 `@babel` namespace 로 들어가면서 monorepo 형식으로 운영되는데 `vue-cli` 도 `@vue` namespace 를 기반으로 monorepo 로 구성된 것을 확인할 수 있음.

## package.json

가장 중요한 npm scripts 는 `vue-cli-service` 라는 모듈로 제공됨. 다양한 옵션들은 [여기](https://cli.vuejs.org/guide/cli-service.html#using-the-binary)에서 확인 가능함.

`serve`, `build`, `lint` 세 가지 기본 command 를 제공함. 일단 `npm start` 가 없다는게 마음에 안 듬. 그리고 왜 `test` 커맨드가 없나 했는데 default 에서는 테스트를 위한 package 가 포함이 안 되어있음. 그래서 커맨드도 만들어주지 않음.

## Project Configuration

`@vue/cli`는 CRA 랑 다르게 애초에 `eject`를 지원하지 않음. CRA(1.x 기준)에서는 override 하기 위해 eject 를 하거나 [react-app-rewired](https://github.com/timarney/react-app-rewired) 를 썼음.

Vue 에서는 `vue.config.js`를 통해 override 하거나 필요한 loader, plugin 들을 추가하라고 함. [webpack-merge](https://github.com/survivejs/webpack-merge)를 사용해봤다면 익숙하게 사용할 수 있을 듯. 그냥 사용할 로더나 플러그인에 대해 `module.exports = { ... }` 형태로 작성하면 알아서 config 에 merge 함. [webpack-chain](https://github.com/neutrinojs/webpack-chain) 도 지원하고 있어서 chaining 문법으로도 vue.config.js 를 작성할 수도 있음. 실제로 내부 config들은 chaining 문법으로 작성되어 있음. (보기 더 편한 것 같기도 함.)

아직 config 를 추가해보지 않았고 최근에 release 된 CRA 2.x version 을 사용해보지 않았지만 Vue 쪽 지원이 더 좋은 듯.

@vue/cli 로 스캐폴딩 된 프로젝트의 webpack config 가 너무 궁금하면 해당 프로젝트에서 `vue inspect` 명령어를 치면 확인해볼 수 있음. 파일로 보고 싶으면 `>`와 함께 사용하면 됨. `vue inspect > output.js` 이렇게. `inspect` 명령어는 다양한 옵션도 제공하고 있으니 유용하게 사용할 수 있을 듯 함.

## Manually select features

1. transpiler 로는 **babel**과 **TypeScript**를 지원함.
2. Unit test 로는 **Mocha + chai 조합**과 **Jest**를 지원함.
3. E2E test 로는 **Cypress**와 **nightwatch**를 지원함.
4. PWA 도 지원함.
5. server side renderer 라이브러리인 vue-server-renderer 를 포함하여 스캐폴딩 해주는 옵션은 없음. [논의](https://github.com/vuejs/vue-cli/issues/1034)는 있었던 것 같음. [nuxt.js](https://github.com/nuxt/nuxt.js)가 있으니 별도 지원 필요성을 느끼지 못하는 듯.

babel 이랑 typescript 랑 같이 선택하면 `Use Babel alongside TypeScript for auto-detected polyfills?` 이런 메세지가 나옴. TypeScript 만 선택했을 때와 비교하면 `tsconfig.json`에서 `target` 이 다르게 설정됨. babel 과 함께 스캐폴딩할 경우 `esnext`로 target 이 지정되고 아닐 경우 es5 로 지정됨.

참고로 typescript 를 위한 loader 는 [atsl](https://github.com/s-panferov/awesome-typescript-loader)이 아닌 [fork-ts-checker-webpack-plugin](https://github.com/Realytics/fork-ts-checker-webpack-plugin)과 함께 [ts-loader](https://github.com/TypeStrong/ts-loader)로 스캐폴딩 됨.

## Add dependency

초기 프로젝트 세팅에서 추가하고 싶은 경우가 있을 경우, `vue add`라는 command를 통해 추가할 수 있음. dependency는 물론 npm scripts, 기본적인 scaffolding까지 해줌.

- [`vue add i18n`](https://kazupon.github.io/vue-i18n/installation.html#vue-cli-3-x)
- [`vue add @vue/unit-jest`](https://www.npmjs.com/package/@vue/cli-plugin-unit-jest)

## Support GUI

```bash
$ vue ui
```

`@vue/cli` 설치 후, 이 명령어를 실행하면 8000 포트로 Vue Project Manager 가 열림. 프로젝트를 생성하고 create 할 수 있는 GUI 를 제공함. 터미널 명령어들이 익숙하지 않거나 초심자 입장에서는 사용하기 정말 좋아보임. (아직 Beta 딱지가 붙어있음.)

딱히 사용할 일이 있겠나 싶었는데 방금 생성한 vue-app 을 import 했더니 프로젝트와 관련된 plugins, dependencies, configuration, npm tasks 를 볼 수 있음. (vue project directory 에서 `vue ui` 명령어를 입력하면 바로 해당 프로젝트의 GUI 가 나타남.)

### Plugins

현재 설치된 `@vue`의 plugins 리스트를 보여줌. 관련된 문서로 바로 이동할 수 있음. vue 측에서 이번에 각종 옵션들을 플러그인 형태로 구성하면서 cli plugins 를 만들기도 권장하고 있는 것 같음. [Plugin Development Guide](https://cli.vuejs.org/dev-guide/plugin-dev.html#core-concepts)도 있음.

### Dependencies

npm version 관리를 위해 현재 설치된 version 과 wanted version, 그리고 latest version 을 보여줌. npm versioning 을 관리하기 위해 VSCode 의 extension 을 쓰거나 별도 tool 을 사용하고 있었는데 여기서도 충분할 것 같음. 마찬가지로 공식 문서로 바로 이동할 수 있음.

### Configuration

Vue 에서는 현재 프로젝트의 설정들을 override 하거나 별도로 추가하기 위해 `vue.config.js`를 제공하고 있음. 이 부분을 GUI 로도 보여줌. eslint rules 또한 GUI 상에서 끄고 켤 수 있음. (별의별 기능이 다 있음.)

### npm tasks

GUI 상에서 바로 실행할 수 있으며 각각의 명령어에 대해 output, dashboard, analyzer 까지 지원됨. 기존에 `webpack-bundle-analyzer` 나 webpack 이 내뱉는 지저분한 로그들을 정리하기 위해 `webpack-stylish` 등을 사용했던 편이라 굉장히 좋아보임. 참고로 기본으로 세팅되는 npm scripts `vue-cli-service`를 통해 `serve`하게 되면 [friendly-errors-webpack-plugin](https://github.com/geowarin/friendly-errors-webpack-plugin)을 기반으로 로그가 만들어짐.

## 추가 개발 환경

개발하기 위해서는 개발자 도구가 빠질 수 없음. Vue 역시 Chrome extension 을 제공하고 있음. [vue-devtools](https://github.com/vuejs/vue-devtools#vue-devtools) 이 녀석을 사용하면 됨. react의 경우 redux-devtools가 따로 있는데 Vue는 이걸로 Vuex까지 지원하고 있음.

## Conclusion

Vue 를 시작하는데 있어서 @vue/cli 의 여러 기능 중 필요한 기본적인 것들에 대해서만 다뤘음. 보다 자세한 @vue/cli 의 3 version 정보가 필요하다면 Evan You 가 쓴 이 [아티클](https://medium.com/the-vue-point/vue-cli-3-0-is-here-c42bebe28fbb)을 읽어보거나 release note 를 확인해보면 좋을 듯. 회사에서 업무로 프로젝트 스캐폴딩 도구를 담당하기도 했고 생산성에 관심이 많아 재미있게 봤음. 너무 잘 만들었음.

### Reference

- https://github.com/vuejs/vue-cli
- https://medium.com/the-vue-point/vue-cli-3-0-is-here-c42bebe28fbb
- https://blog.logrocket.com/vue-cli-3-the-deep-dive-41dff070ac4a

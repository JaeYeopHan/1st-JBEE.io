---
title: '[Tool] (번역)Babel에 대한 모든 것'
date: 2017-05-16 12:04:26
category: 'etc'
---

![](/images/babel.png)

원본 : http://kleopetrov.me/2016/03/18/everything-about-babel/
_이 글은 위 글을 기반으로 하여 나름 최신으로 업데이트하며 작성되었습니다 :) 물론, 본 저자의 동의하에 작성되었습니다._

## babel

`Babel`은 아시다시피 ES6/ES7 코드를 ECMAScript5 코드로 transpiling 하기 위한 도구입니다. `Babel`은 다양한 작은 모듈들로 구성되어 있습니다. `Babel` 다양한 모듈을 담는 일종의 상자 역할을 하며 코드를 컴파일 하기 위해 작은 모듈들(ex. presets)을 사용합니다.

## Set up

`babel` 학습을 위한 디렉토리를 구축합니다.

```bash
$ mkdir babel-tutorial && cd babel-tutorial
$ npm init
$ mkdir src && touch src/example.js
# Write some code of ES6 syntax in example.js
```

## bael-cli

`bael-cli`는 command line을 통해 코드를 transpile 할 수 있는 도구입니다.

```bash
$ npm install --save-dev babel-cli
# or
$ yarn add -D babel-cli
```

`-g` 옵션을 통해서 `bael-cli`를 전역에 설치할 수도 있지만 `--save-dev` 옵션으로 설치하는 이유는 하나의 컴퓨터에 존재하는 다른 프로젝트들이 각각 다른 버전의 babel에 의존성을 갖고 있을 수 있습니다. `--save-dev` 옵션을 통해서 이를 해결할 수 있습니다.

설치한 후 터미널에서 다음 명령을 실행할 수 있습니다.

```bash
$ babel example.js --out-file compiled.js
```

이 명령어는 다음과 같은 의미를 담고 있습니다.

- `babel` - babel을 호출합니다.
- `example.js` - transpile 하고자하는 ES6/ES7의 자바스크립트 파일입니다.
- `--out-file` - babel에게 전달할 옵션을 명시합니다. 파일로 output을 지정하는 옵션입니다.
  _cf1> shortcut으로 `-o` 옵션을 제공합니다._
  _cf2> 이 이외에도 `--out-dir` or `-d` 옵션을 전달할 수 있습니다._
- `compiled.js` - 출력 파일의 이름을 명시합니다.

npm script를 사용하여 해당 프로세스를 자동화 할 수 있습니다.

```json
// package.json
{
  ...
  "scripts": {
    "build": "babel ./src -d ./lib -w"
  }
  ...
}
```

and

```bash
$ npm run build
```

`src` 디렉토리 밑에 있는 파일을 transpile하여 `lib` 디렉토리 밑으로 output을 출력합니다. 이 때는 동일한 파일명이 사용됩니다. `-w` 옵션을 통해서 `src` 디렉토리 밑의 파일들이 변경될 때마다 자동으로 transpile 하도록 할 수 있습니다.

## babel-register

`babel-register`는 각각의 모듈을 결합할 때 사용되는 후크(Hook) 모듈입니다. `require` 메소드를 바인드하여 자바스크립트 코드를 transpile 시킵니다. `babel-register` 모듈은 production을 위한 모듈은 아닙니다. 예를 들어 mocha 기반의 ES6로 작성된 테스트 코드를 실행시키기 위해서는 다음과 같은 스크립트를 사용할 수 있습니다.

```json
// package.json
"script": {
  "test": "mocha --require babel-register"
}
```

## Configuring Babel

처음에도 말했듯이, babel에게 어떠한 정보를 전달해주지 않는 한 babel은 아무 작업도 수행하지 않는 '상자'에 불과합니다. 방금 전에 살펴봤던 예제에서 아무 옵션없이 babel을 실행시키면 `src` 디렉토리에 있는 파일을 `lib` 디렉토리에 옮기는 작업만 수행하게 됩니다. 그렇기 때문에 babel에게 설정 정보를 전달해줘야 합니다. 이 정보는 `.babelrc`파일을 통해서 전달할 수 있습니다.

### .babelrc

`.babelrc`파일은 babel을 설정하기 위한 파일입니다. 다음과 같이 구성되어 있습니다.

```js
// .babelrc
{
  "presets": [],
  "plugins": []
}
```

presets를 추가하기 위해서는 npm 설치가 필요합니다.

```bash
$ npm install --save-dev babel-preset-es2015
```

만약 React code를 transpile해야 한다면 다음과 같이 설치해줍니다.

```bash
$ npm install --save-dev babel-preset-react
```

그리고 `.babelrc`파일을 수정해줍니다.

```js
// .babelrc
{
  "presets": ["es2015", "react"],
  "plugins": []
}
```

자바스크립트 스펙으로 아직 확정되지 않은 `proposal 스펙`들이 존재합니다. 이들은 5개의 stage로 구분됩니다. babel에서는 각각의 stage에 대해서 preset을 제공합니다.

- babel-preset-stage-0
- babel-preset-stage-1
- babel-preset-stage-2
- babel-preset-stage-3

`babel-preset-stage-4`는 `babel-preset-es2015`를 의미합니다. 각각의 stage에 대해서도 위와 같은 방법으로 설치하고 `.babelrc`파일을 수정하여 사용할 수 있습니다. 하지만 babel에서 이들을 모두 한번에 사용할 수 있도록 해주는 preset을 하나 제공했는데요, 바로 `babel-preset-env`입니다. 이 `preset`으로 모든 stage를 대체할 수 있습니다.

## babel-polyfill

`babel-polyfill`은 ES6 환경을 제공해줍니다.
polyfill이 없는 경우를 예제를 통해 살펴봅니다.

```js ES6
function allAdd() {
    return Array.from(arguments).map(a => a + 2);
```

위 코드는 `babel`에 의해 다음과 같이 transpile됩니다.

```js ES5
function allAdd() {
  return Array.from(argument).map(function(a) {
    return a + 2
  })
}
```

`Array.from()`은 ES6 syntax이므로 지원하지 않는 브라우저가 존재하기 때문에 위 코드는 transpile은 되었지만 모든 브라우저에서 작동하지 않습니다. 이 문제를 해결하기 위해서 `polyfill`을 사용해야 합니다. `polyfill`이란 code 조각으로 런타임에 존재하지 않는 native API의 복사본을 말합니다.

`babel-polyfill` 사용을 위해서 다음과 같이 npm을 설치해줍니다.

```bash
$ npm install --save-dev babel-polyfill
```

그리고 해당 `polyfill`이 필요한 곳에서 `import`해줍니다.

```js
import 'babel-polyfill'
```

만약 webpack과 함께 사용한다면 entry point에 `babel-polyfill`을 추가해줍니다.

```js
// webpack.config.js
module.exports = {
  entry: ['babel-polyfill', '...']
  ...
};
```

## babel-plugins

아직 공식 스펙에서 지원하지 않은 기능들을 `transform-plugin`을 추가하여 사용할 수 있습니다. 여러 플러그인은 babel 공식 홈페이지에서 확인실 수 있습니다. 추가로 설치한 플러그인은 `plugins` 옵션으로 추가할 수 있습니다. `.babelrc`파일에서 설정해줄 수도 있고 Webpack이란 도구에서도 설정해줄 수 있습니다.

### Reference

- https://babeljs.io/docs/plugins/
- http://kleopetrov.me/2016/03/18/everything-about-babel/

_end_

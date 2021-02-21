---
title: '[ES6] 11. Modulization'
date: 2017-05-04 15:22:01
category: 'javascript'
---

![javascript_es6](/images/javascript_es6.png)

ES6에서 추가된 import/export 구문을 9가지 Case로 나누어 정리해봤습니다.

## Module in Javascript

[Module pattern](http://asfirstalways.tistory.com/234)이라고 들어보셨나요? ES5에서는 기본적으로 global에 변수가 할당되기 때문에, [Namespace pattern](http://asfirstalways.tistory.com/233), module pattern 등등의 기법들이 필요했습니다. 또한 CommonJS, AMD처럼 같은 언어에서 환경에 따라 다른 방식으로 소스코드를 가져와 사용해야 했습니다. 이에 대한 부분은 [JavaScript 표준을 위한 움직임: CommonJS와 AMD](http://d2.naver.com/helloworld/12864)를 참고하시면 될 것 같습니다.

ES6에서는 이러한 문제점을 인식하고 `import`라는 구문을 통해 Modulization을 제공합니다. 하지만 아쉽게도 **Safari**를 제외한 다른 브라우저에서는 아직 지원을 하지 않습니다. 그렇기 때문에 Webpack과 babel의 도움을 받아 테스트해볼 수 있습니다.

## import & export

### Case 1

함수를 다른 자바스크립트 파일에서 불러와 실행해야 하는 경우에 대한 예제 코드입니다.

```js
export function hello() {
  console.log(`module1`)
}
```

```js
import { hello } from './module1'
hello() //module1
```

외부의 자바스크립트 파일에서 다른 자바스크립트 파일에 존재하는 함수를 문제없이 사용할 수 있게 되었습니다:)
`{ ... }`는 ES6의 `destructuring` 문법을 사용한 것입니다. `module1.js`파일에서 export가 붙은 함수를 import하는데 그 중 `hello`라는 함수를 import하겠다는 의미입니다. 이와 같은 방법으로 여러 함수 또는 변수를 export하고 import할 수 있습니다. 다른 방법도 살펴보겠습니다.

### Case 2

```js
export default function hello() {
  console.log(`module1`)
}
```

```js
import module1 from './module1'
module1() // module1
```

`default`라는 키워드가 보이시나요? `export` 키워드를 사용하여 함수를 외부로 노출시킬 때, `default`라는 키워드를 붙여주면 해당 파일이 import되는 경우 기본적으로 지정된 함수 또는 변수를 노출시키겠다라는 의미입니다. 주로 파일에서 하나의 함수 또는 변수를 노출시킬 경우에 사용합니다. `default` 키워드를 사용하게 되면 특정 함수나 변수를 import하는 것이 아니므로 import하는 곳에서 변수명 또는 함수명을 임의로 지정할 수 있습니다. 이번 예제에서는 `hello`라는 함수 이름을 그대로 사용하지 않고 `module1`이라는 이름을 지정하여 함수를 호출했습니다.

### Case 3

`export default`로 이미 export를 한 후에 다른 함수나 변수를 export하기 위해서는 import할 때 다음과 같은 방법을 사용해야 합니다.

```js
export default function hello() {
  console.log(`module1`)
}
export let name = 'jbee'
```

```js
import module1, { name } from './module1'
module1() // module1
console.log(name) // jbee
```

`name`이라는 변수를 import하는 경우에는 반드시 `name`이라는 변수명으로 import해야겠죠? 다음의 경우에는 어떻게 될까요?

#### Case 3-1

```js
import module1, { name } from './module1'
module1() // module1
console.log(name) // jbee
name = 'newName' //SyntaxError!
```

import한 name을 다시 정의하려고 하면 SyntaxError가 발생합니다. import된 `name`이란 변수는 `read-only` 속성이 적용되기 때문입니다. 만약에 다음과 같은 경우는 어떻게 해야할까요?

#### Case 3-2

```js
export const name = 'jbee'
```

```js
export const name = 'newName'
```

다른 자바스크립트 파일에서 같은 변수명을 사용한 경우입니다. 기존의 방식대로 import를 해볼까요?

```js
import { name } from './module1'
import { name } from './module2'
```

default로 export되지 않은 함수 또는 변수에 대해서는 반드시 그 이름을 지정해야 했습니다. 이럴 경우에는 `Duplicate declaration`에러가 발생합니다.

### Case 4

위에서 발생한 문제를 해결하기 위한 첫번째 방법입니다.

```js
import { name as module1Name } from './module1'
import { name as module2Name } from './module2'

console.log(module1Name)
console.log(module2Name)
```

`as`라는 키워드가 등장했습니다. `alias`의 줄임으로 import한 변수 또는 함수에 대해 별명을 지정할 수 있습니다. 이렇게 import를 하면 변수명끼리 충돌이 일어나지 않습니다:) 그러나 변수명이 점점 많아지게 되면 계속해서 새로운 변수명을 지정해줘야 하는 문제점이 발생하게 됩니다.

### Case 5

위의 문제를 조금 더 개선해보겠습니다:)

```js
import * as Module1 from './module1'
import * as Module2 from './module2'

console.log(Module1.name)
console.log(Module2.name)
```

`as`키워드를 사용함과 동시에 `*`이 등장했습니다. `*`은 import하고자 하는 자바스크립트 파일에서 `export`키워드가 붙어있는 모든 함수, 변수를 import할 때 사용합니다. 그리고 `as` 키워드를 통해서 `namespace`를 지정해줘야 합니다. 이렇게 import가 되면 `Module1`이라는 객체의 프로퍼티로 import한 변수 또는 함수에 접근할 수 있습니다.

### Case 6

```js
export const obj = {
  name: 'Jbee',
  age: 25,
}
```

```js
import { obj } from './module1'

console.log(obj.name) // Jbee
obj.name = 'newName'
console.log(obj.name) // newName
```

위 예제로부터 Object를 import하는 경우에, Object의 프로퍼티까지 보호할 수 없다는 것을 알 수 있습니다.

### Case 7

여태까지 정의함과 동시에 export를 할지 말지 결정했는데요, 자바스크립트 코드의 마지막에서 이를 정의해줄 수 있습니다.

```js
const obj = {
  name: 'Jbee',
  age: 25,
}

export { obj }
```

```js
import { obj } from './module1'

console.log(obj.name) // Jbee
```

### Case 8

Object 또는 변수를 export하는 경우 `default`키워드를 붙일 수 없습니다. 대신 다른 방법이 존재합니다.

```js
const obj = {
  name: 'Jbee',
  age: 25,
}

export { obj as default }
```

```js
import obj from './module1'

console.log(obj.name) // Jbee
```

`as default`라는 키워드를 붙여 export할 수 있습니다. 이는 함수 또는 변수에도 적용 가능합니다.

### Case 9

import 구문을 class에도 물론 적용할 수 있습니다.

```js
export default class Component {
  constructor() {
    console.log(`create component!`)
  }
}
```

```js
import Component from './module1'
new Component()
//create component!
```

<br/>

## import/export 5 convention from [Airbnb ES6 Convention](https://github.com/JaeYeopHan/javascript)

### 1) Wildcard(`*`) 사용을 자제하세요

```js
// bad
import* as AirbnbStyleGuide from './AirbnbStyleGuide';

// good
import AirbnbStyleGuide from './AirbnbStyleGuide';

````

### 2) import함과 동시에 export를 하지 말고 코드의 마지막에서 따로 export하세요

```js
// bad
// filename es6.js
export { es6 as default } from './airbnbStyleGuide';

// good
// filename es6.js
import { es6 } from './AirbnbStyleGuide';
export default es6;
````

### 3. 동일한 path를 import하는 경우에는 한 줄에서 모두 import하세요

```js
// bad
import foo from 'foo'
// … some other imports … //
import { named1, named2 } from 'foo'

// good
import foo, { named1, named2 } from 'foo'
```

### 4. import 구문은 호이스팅 됩니다. 그러므로 import문은 모두 상단에 위치시키세요

```js
// bad
import foo from 'foo'
foo.init()

import bar from 'bar'

// good
import foo from 'foo'
import bar from 'bar'

foo.init()
```

### 5. 하나만 export하는 경우에는 default 키워드를 붙여주세요

```js
// bad
export function foo() {}

// good
export default function foo() {}
```

## 마무리

이상 9가지의 case로 ES6의 import와 export를 정리해봤습니다 :D

ES6 모든 포스팅은 [Github Respository](https://github.com/JaeYeopHan/ECMAScript6_study)에서 확인하실 수 있습니다.

_11. end_

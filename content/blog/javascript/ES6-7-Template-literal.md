---
title: '[ES6] 7. Template literal'
date: 2017-04-19 16:26:04
category: 'javascript'
---

![](/images/javascript_es6.png)

```javascript
console.log(`template literal`)
```

ES6에서 문자열 처리를 보다 간편하게 할 수 있는 `템플릿`을 제공한다. 문자열 처리를 위해 single quote나 double quote가 아닌 **Backtick**을 사용한다. 변수를 `${ }`로 감싸서 inline으로 표현할 수 있으며 \n을 작성할 필요없이 Backtick 안에서 개행을 해주면 된다. 기존의 템플릿 엔진들에서 제공하고 있었던 기능인 `${ }` 안에는 `변수` 또는 `연산식` 등의 `표현식`이 들어갈 수 있다.
_Example code>_

```javascript
let name = 'jbee'
//ES5
console.log('Hi, ' + name + '!\nHave a nice day!')
// console>
// Hi, jbee!
// Have a nice day!

//ES6
let grettingTemplate = `
Hi, ${name}!
Have a nice day!
`
console.log(grettingTemplate)
//console>
// Hi, jbee!
// Have a nice day!
```

Template literal을 사용하여 거추장스러운 `'+'`이나 `'\n'`을 더이상 사용하지 않아도 된다.

## tagged template

```javascript
let name = 'jbee'
let num = 27
console.log(`hi, ${name}! Have a nice day! ${num} is your number`)
//console> hi, jbee! Have a nice day! 27 is your number
```

위 템플릿 리터럴을 `tagged template`을 사용하여 `text`와 `value`로 분리할 수 있다. `text`는 공백 문자를 기준으로 `배열`의 형태로 파라미터가 들어오며, \${ } 안의 표현식은 `value`라는 파라미터로 `String` type으로 들어온다.

```javascript
function greet(text, value) {
  console.log(text)
  console.log(value)
  console.log(typeof value)
}
greet`hi, ${name}! Have a nice day! ${num} is your number`
//console> [ 'hi, ', '! Have a nice day! ', ' is your number' ]
//console> jbee
//console> string
```

parameter로 넘겨지는 `value`는 하나인데, 템플릿 리터럴에는 표현식이 두개가 존재한다. 그렇기 때문에 number에 해당하는 값이 함수로 넘겨지지 못했다.

```javascript
function greet(text, value, value2) {
  console.log(text)
  console.log(value)
  console.log(value2)
}
greet`hi, ${name}! Have a nice day! ${num} is your number`
//console> [ 'hi, ', '! Have a nice day! ', ' is your number' ]
//console> jbee
//console> 27
```

이렇게 해결할 수 있지만, 지난 chapter에서 다룬 `Rest parameter`를 사용할 수 있다.

```javascript
function greet(text, ...value) {
  console.log(text)
  console.log(value)
}
greet`hi, ${name}! Have a nice day! ${num} is your number`
//console> [ 'hi, ', '! Have a nice day! ', ' is your number' ]
//console> [ 'jbee', 27 ]
```

### 템플릿 리터컬의 표현식 값 결정

템플릿 리터럴을 사용하여 문자열을 함수의 파라미터를 넘길 수 있을 것이다. 그렇다면 템플릿 러터럴 내부의 표현식의 값은 언제 결정될까?

```javascript
//Assign expression statement
function greeting(message) {
  let name = `ecmascript`
  console.log(message)
}

let name = `jbee`
greeting(`Hi, ${name}`)
//console> Hi, jbee
```

함수의 파라미터로 **넘겨질 때부터** 결정되어 넘어가기 때문에 `greeting`이라는 함수 내부에 있는 local variable인 `ecmascript`라는 단어가 `name`으로 들어가지 않고 `jbee`라는 문자열이 `name`의 값으로 결정되었다.

예제로 사용된 코드는 [Github Respository](https://github.com/JaeYeopHan/ECMAScript6_study)에서 확인하실 수 있습니다.

_7. end_

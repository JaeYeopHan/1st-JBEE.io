---
title: '[ES6] 1. let-const'
date: 2017-04-18 13:48:49
category: 'javascript'
---

![](/images/javascript_es6.png)

## 자바스크립트의 정체

ES6의 문법을 알아보기 전에 자바스크립트의 정체부터 짚고 넘어가자. 자바스크립트(JavaScript)는 스크립트 언어(script language)이다. 스크립트 언어란 언어를 해석하고 실행하는 소프트웨어가 따로 존재하는 언어를 말한다. 자바스크립트를 해석하고 실행하는 소프트웨어는 브라우저이다. 이러한 의미에서 Node.js는 스크립트 언어라고 부르기 애매하고 자바스크립트의 문법을 차용한 다른 종류의 언어라고 생각해도 된다. 우선 자바스크립트가 해석되고 실행될 때 일어나는 확보, 선언, 할당의 차이를 짚고 넘어가야 한다.

### 확보

브라우저가 자바스크립트를 해석할 때 두 번 파싱(parsing)하는데 첫번째 파싱 과정이 Lexical parsing이다. 실행하려는 자바스크립트 파일이 어느 정도의 메모리를 필요로 하는지를 파악하기 위해 거치는 파싱 과정인 것이다. 이 때 자바스크립트의 모든 선언문은 호이스팅(Hoisting)된다.

### 선언

말 그대로 선언하는 것이다. 값을 할당하지 않는다. 자바스크립트에서는 선언만 하고 값을 할당하지 않으면 `undefined`값이 할당된다. 확보만 하고 선언하지 않으면 `Reference error`가 발생하고 선언을 하게 되면 `undefined` 값이 나타난다.

### 할당

특정 변수에 값을 할당하는 과정이다. 위 세 가지를 파악해야 var와 let 그리고 const의 차이를 이해할 수 있다

## let 으로 변수 선언 및 할당하기

`let`으로 정의된 변수들은 호이스팅 되지 않는다(?) 많은 책에서 이렇게 표현을 하고 있지만 이것은 잘못된 표현이다. `let`으로 선언해도 호이스팅된다. lexical parsing 단계에서 해당 자바스크립트 파일을 실행하기 위한 메모리 공간을 `확보`해야하기 때문이다. 다만 let 변수로 선언이 되기 전 해당 변수를 사용하려고 하면 `Reference error`를 발생시키는 것이다. 예제 코드를 보자.

```javascript
//ES5 code :: var>>
console.log(foo) //undefined
var foo
console.log(foo) //undefined
foo = 123
console.log(foo) //123
//ES6 code :: let>>
console.log(foo) //ReferenceError
let foo
console.log(foo) //undefined
foo = 123
console.log(foo) //123
```

let은 유효범위의 시작에서부터 `선언`될 때까지 `temporary dead zone`(일시적 사각지대)에 있다. 이 dead zone에서 사용하게 되면 `ReferenceError`가 발생한다.

## let - in for loop

`let`으로 정의된 변수들은 가장 가까운 블록으로 scope이 지정된다. 여기서 블록이란 `if`, `else`, `for`, `while` 같은 문법으로 지정된 { } 블록을 의미한다. `let` 키워드를 사용한 변수들은 그들 각각의 함수 block에 귀속된다. `var` 변수는 함수의 상단으로 호이스팅(hoisting) 된 다음에, 각 루프의 반복 변수가 공유하게 된다. 그 결과, 콜백이 실행될 때는 `i` 변수가 루프의 마지막 변수로 할당된다. 즉 콜백에서 반복문을 제어하는 변수에 접근할 때 문제가 발생하는 것이다. 이러한 문제를 해결하기 위해 `let`을 사용할 수 있다.

```javascript
//ES5 code
function loadFiles( userNames ) {
    for(var i in userNames){
        _fetchProfiles(userNames[i], function() {
            console.log(userNames[i]);
        }
    }
}
loadFiles(["A", "B", "C", "D"]);

console >
D // userNames[4]
D // userNames[4]
D // userNames[4]
D // userNames[4]
```

ES6 code

```javascript
//ES6 code
function loadFiles( userNames ){
    for( let i in userNames ){
        _fetchProfile(userNames[i], function(){
            console.log(userNames[i]);
        }
    }
}
loadFiles(["A", "B", "C", "D"]);

console >
A // userNames[1]
B // userNames[2]
C // userNames[3]
D // userNames[4]
```

## let cannot be redeclared

`let`으로 정의된 변수는 같은 블록에서 재할당될 수는 있지만 재정의는 될 수 없다.

```javascript
//ES6 code
let a = 'hello'
a = 'world' // available

let a = 'hello'
let a = 'world' // false -> TypeError : Identifier ‘a’ has already been declared

let flashMessage = 'hello'
function loadFiles(userNames) {
  let flashMessage = 'world' // available
  return flashMessage
}
```

## const - declaration

const 키워드는 상수라고 불리는 읽기 전용 변수를 생성하는 키워드이다. 한 번 할당되면, 상수는 새로운 값으로 할당될 수 없다. 명시적으로 변경을 시도해도 바뀌지 않는다. const 로 정의된 변수는 초기에 정의할 때, 반드시 값을 할당해줘야 한다. 그렇지 않으면 `Syntax Error`가 발생하게 된다. const 로 정의된 변수는 `let`과 마찬가지로, 가장 가까운 블록에 scope이 지정된다.

예제로 사용된 코드는 [Github Respository](https://github.com/JaeYeopHan/ECMAScript6_study)에서 확인하실 수 있습니다.

_chapter 1. end_

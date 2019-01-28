---
title: '[ES6] 6. Class sugar syntax'
date: 2017-04-18 21:11:41
category: 'javascript'
---

![](/images/javascript_es6.png)

ES6에서 자바스크립트에는 존재하지 않았던 클래스(Class)가 도입되었다. 자바스크립트에 대해 잘 모르는 사람들이 Java에서의 클래스와 **똑같은** 기능을 하는 녀석인 줄 알고 많이 혼동한다. 자바스크립트는 기본적으로 프로토타입 기반의 언어이기 때문에 새로 도입된 이 클래스도 프로토타입 기반이다. 객체 지향을 **흉내**내고 있지만, 그 내부는 여전히 프로토타입으로 구성되어 있는 것이다. 프로토타입 기반으로 객체 지향적으로 설계하는 것이 복잡하여 클래스라는 `sugar syntax` 문법이 도입된 것이다. 그렇기 때문에 이에 따른 제약사항이 많다. 편한 만큼 고려해야할 사항도 많은 것이다. 하나씩 살펴보자.

### 클래스는 선언문 또는 표현식으로 선언할 수 있다.

```javascript
//클래스 선언문으로 클래스 선언
class name {
  //...
}

//클래스 표현식으로 클래스 선언
let name = class {
  //...
}

let name = class inner_name {
  //...
}
console.log(typeof name) //function
```

자바스크립트 엔진은 `class` 키워드를 만나면 `Class 오브젝트`를 생성한다. `Class 오브젝트`도 마찬가지로 `String`, `Function`과 같은 하나의 오브젝트 타입이다.
_cf> 표현식으로 선언했을 때의 inner-name은 클래스 내부에서 자신을 호출할 때 사용한다._

## Class keyword 특징

0. 클래스의 선언부는 `let`과 `const`와 마찬가지로 호이스팅은 되지만 `temporary dead zone`이 형성된다.

```javascript
//Not hoisting
let foo = new Foo()

class Foo {}
//Error:Use before declaration
```

클래스를 선언한 다음, `new` 키워드를 통해 인스턴스를 생성할 수 있다.

1. 클래스의 코드는 ‘use strict’를 선언하지 않아도 strict 모드에서 실행된다.
2. 메서드를 작성할 때, function 키워드와 콜론( : )을 작성하지 않는다.
3. 메서드 사이에 콤마(,)를 작성하지 않는다.

```javascript
//class method
class Student {
  getName() {
    console.log('name')
  }
  getScore() {
    console.log('score')
  }
}

let student = new Student()
student.getName() //name
student.getScore() //score
```

바로 함수를 정의하고, 콤마(,)가 없다.

4. 생성자 함수를 통해 인스턴스를 생성하면 window에 설정되지만 class 키워드를 통해 생성하면 window에 설정되지 않는다.

```javascript
//window object?
function Foo() {}
console.log(window.Foo) // function Foo() {...}
console.log(window.Student) //undefined
```

### Sugar Syntax

`Class` keyword는 `sugar syntax`라고 했다. 자바스크립트는 기본적으로 `prototype` 기반의 언어이기 때문에 엔진이 `prototype`에 메서드들을 연결한다. 즉, 클래스에서 메서드를 추가하면 자동으로 `prototype`에 추가되는 것이다. 자바스크립트에서는 프로토타입을 사용해서 클래스 밖에서도 메서드를 추가할 수 있다. 이미 생성된 인스턴스에 메서드를 추가하게 되면, 이전에 생성되었던 인스턴스들이 새로 추가된 메서드들을 공유해야하기 때문에 부하가 걸리지만 코드가 유연해진다는 장점도 존재한다. 위 예제코드에서 생성한 `Student` 클래스의 프로토타입에 새로운 메서드를 추가하고 이전에 생성되었던 인스턴스에서 새롭게 추가한 메서드를 호출할 수 있는 것이다.

```javascript
//add method to prototype
Student.prototype.newMethod = function() {
  console.log('Add new Method')
}

student.newMethod() //Add new Method
```

`new` 연산자는 `constructor`를 호출하면서 받은 인자들을 `constructor`의 파라미터로 전달한다.

```javascript
//new keyword
class Student {
  constructor(name, score) {
    this.name = name
    this.score = score
  }
  getName() {
    return this.name
  }
}

let s = new Student('Jbee', 100)
console.log(s.name) //Jbee
console.log(s.score) //100
console.log(s.getName()) //Jbee
```

위 예제 코드에서 볼 수 있듯이 `class` 키워드로 선언한 클래스에 대해서 `new` keyword를 통해 인스턴스를 생성할 수 있다. 이 때 클래스 내부에 별도의 `constructor`가 설정되어 있지 않으면 기존의 `protytype`의 constructor가 호출되고 이를 `default constructor`라고 부른다. 별도로 작성된 `constructor`는 `Student.prototype.constructor`로 호출된다.

**new 키워드가 실행되는 메커니즘은 다음과 같다.** 1. constructor는 우선적으로 빈(empty) 오브젝트(인스턴스)를 생성한다. 2. 넘겨받은 파라미터를 생성한 빈 오브젝트의 프로퍼티에 설정한다. 3. 인스턴스를 먼저 생성하므로, constructor 내부에서는 this keyword를 통해 인스턴스 자신을 가리킬 수 있다. 4. constructor에 별도의 return이 설정되어 있지 않으면 new를 실행한 곳으로 해당 클래스의 인스턴스를 반환한다.
_cf) constructor는 별도의 return을 설정할 수 있다. 하지만 Number, String 값이 return value로 지정되어 있으면 이를 무시하고 인스턴스 자신을 return 한다._

### extends keyword

자바스크립트에서도 `extends`라는 키워드를 통해 클래스 간의 상속이 가능해졌다. 상속받은 클래스(이하 슈퍼클래스)의 메소드를 사용할 수 있다.

```javascript
class Foo {
  getName() {
    console.log('Foo')
  }
}

class Bar extends Foo {}

let bar = new Bar()
bar.getName() //Foo
```

슈퍼 클래스의 메소드를 오버라이딩(Overriding)할 수 있다.

```javascript
class Foo {
  getName() {
    console.log('Foo')
  }
}

class Bar extends Foo {
  getName() {
    console.log('Bar')
  }
}

let bar = new Bar()
bar.getName() //Bar
```

`super` 키워드를 통해 슈퍼 클래스의 메소드에 접근할 수 있다.

```javascript
class Foo {
  getName() {
    return 'Foo'
  }
}

class Bar extends Foo {
  getName() {
    return super.getName() + ' Bar'
  }
}

let bar = new Bar()
bar.getName() //Foo Bar
```

### constructor keyword

서브 클래스에서 정의된 `constructor`가 없다면 슈퍼 클래스의 `constructor`가 호출된다.

```javascript
class Foo {
  constructor() {
    console.log('Foo constructor')
  }
}

class Bar extends Foo {}

let bar = new Bar()
//console> Foo constructor
```

서브 클래스에서 `constructor`를 정의하려면 **반드시** constructor 내부에서 `super()`를 **호출**해야 한다.

```javascript
class Foo {
  constructor() {
    console.log('Foo')
  }
}

class Bar extends Foo {
  constructor() {
    console.log('Bar')
  }
}

let bar = new Bar()
//ReferenceError: this is not defined
```

`constructor()`메소드 안에서 `super()`를 호출해주면, 슈퍼 클래스가 생성되고 서브 클래스가 생성된다.

```javascript
class Foo {
  constructor() {
    console.log('Foo constructor')
  }
}

class Bar extends Foo {
  constructor() {
    super()
    console.log('Bar constructor')
  }
}

let bar = new Bar()
//console> Foo constructor
//console> Bar constructor
```

### static keyword

자바스크립트 클래스에서 `static` 키워드를 사용하면 정적 메소드를 정의할 수 있다. 정적 메소드라 함은 인스턴스를 생성하지 않고 사용할 수 있는 메소드를 말한다. 정적 메소드는 인스턴스를 생성하지 않고도 호출할 수 있지만 인스턴스에서는 호출할 수 없다.

```javascript
class Foo {
  static getName() {
    console.log('Foo')
  }
}

Foo.getName() //Foo

let foo = new Foo()
foo.getName() //not a function
```

정적 메소드는 `prototype`에 추가되지 않는다.

```javascript
class Foo {
  static getName() {
    console.log('Foo')
  }

  getAlias() {
    console.log('foo')
  }
}

console.log(Foo.prototype.getName === Foo.getName) //false
console.log(Foo.prototype.getAlias === new Foo().getAlias) //true
```

클래스 내부에서 `정적 변수(static variable)`를 지정할 수는 없지만 클래스 밖에서 지정할 수 있다.

```javascript
class Foo {
  //...
}
Foo.name = 'foo'
```

### new.target

`new.target`을 이용하면 슈퍼 클래스에서 서브 클래스의 static method에 접근할 수 있다.

```javascript
class Foo {
  constructor() {
    console.log(new.target) //[Function: Bar]
    console.log(typeof new.target) //function
    console.log('Foo: ', new.target.getName()) //Foo: bar
  }
}

class Bar extends Foo {
  constructor() {
    super()
  }

  static getName() {
    return 'bar'
  }
}

let bar = new Bar()
```

ES6에서 추가된 sugar syntax class에 대해 정리해봤다. TypeScript에서는 보다 더 객체지향적인 클래스로서 사용할 수 있다. 아직 불완전한 ES6의 클래스는 신경써야할 부분도 많지만 제대로 이해하면 `prototype`을 사용하는 것보다 효율적으로 자바스크립트 코드를 작성할 수 있을 것이다.

예제로 사용된 코드는 [Github Respository](https://github.com/JaeYeopHan/ECMAScript6_study)에서 확인하실 수 있습니다.

_6. end_

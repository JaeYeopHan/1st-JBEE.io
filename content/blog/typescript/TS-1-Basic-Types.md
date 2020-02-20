---
title: '[TS] 1. Basic Types'
date: 2017-04-23 16:12:08
category: 'typescript'
thumbnail: './images/typescript_banner.png'
---

![typescript_banner](./images/typescript_banner.png)

TypeScript에서는 JavaScript에서 사용했었던 `number`, `string`, `boolean`과 같은 데이터 타입을 기반으로 `정적 타이핑`을 지원합니다.

본격적인 TypeScript Tutorial 진행을 위해 에디터에 `TSLint`를 설치하겠습니다. (TypeScript에서 제공하는 [Playground](https://www.typescriptlang.org/play/index.html)에서 해보실 수도 있습니다.)

## Install TSLint

```bash
yarn global add tslint typescript
yarn global tslint typescript
```

`typescript`패키지는 `TSLint`와 동일한 version을 사용해야 하기 때문에 `peerDependencies`로 설치해줍니다.
작업할 디렉토리로 이동하여 `tslint`를 설정해줍니다.

```bash
tslint --init
```

위 명령어를 실행하게 되면 `tslint.json`이라는 파일이 생성됩니다.

```json
{
  "defaultSeverity": "error",
  "extends": "tslint:recommended"
}
```

기본적으로 `tslint`에서 제공하는 `recommended` rule을 적용했습니다. 저는 `WebStorm`이라는 에디터를 사용하고 있습니다. 각자 사용하는 에디터에서 환경설정을 통해 TSLint를 able로 설정해주시면 됩니다. TSLint에서 제공하고 있는 rule은 [공식 사이트](http://palantir.github.io/tslint/rules/)에서 제공하고 있습니다. 입맛에 맞게 해당 rule들을 오버라이딩하여 사용하실 수 있습니다. (`WebStorm`에서는 console찍는 것 가지고 뭐라 안하는데, 다른 editor에서는 console마저 지우라고 하는 것 같습니다. `no-console` rule을 설정하시는게 정신 건강에 좋을 것 같습니다.) 보다 자세한 `tslint.json` 설정은 다음 링크를 참고하시면 좋을 것 같습니다. MicroSoft가 만든 `VSCode` 에디터가 요즘 뜨고 있는데요, `VSCode` 에디터에 TypeScript 개발 환경 설정하는 내용을 포함하고 있습니다. [Visual Studio Code에서의 TypeScript 개발 환경 구축](http://poiemaweb.com/typescript-vscode)

## Basic Types

변수에 타입을 지정해주기 위해서 TypeScript에서는 `:`을 통해 지원합니다. 기존의 JavaScript에서 변수를 선언하면서 `:`으로 해당 변수의 타입을 지정해줍니다.

### Boolean

```typescript
let isExist: boolean = false
```

`boolean` 타입을 지정합니다.

### Number, 숫자

```typescript
let decimal: number = 6
let hex: number = 0xf00d
let binary: number = 0b1010
let octal: number = 0o744
```

`number` 타입을 지정합니다.

### String, 문자열

```typescript
let name: string = 'jbee'
let greeting: string = `Hi, I'm ${name}!`
```

`string` 타입을 지정합니다.

### Array, 배열

```typescript
let arr: number[] = [1, 2, 3]
```

or

```typescript
let arr: Array<number> = [1, 2, 3]
```

기존에 배열 리터럴을 사용하여 배열을 정의하면서 정의하는 배열에 어떠한 데이터 타입의 원소가 들어갈 것인지를 Type을 통해 제공할 수 있습니다.

### Tuple, 튜플

```typescript
let tuple: [string, number];
tuple = ["age", 25];
tuple = ["name", "jbee];// Error
> message: 'Type '[string, string]' is not assignable to type '[string, number]'.
  Type 'string' is not assignable to type 'number'.' at: '5,1'
```

`key-value`의 형태를 저장할 때는, 위와 같이 타입을 지정해줄 수 있습니다. TSLint가 잘못된 타입의 값이 들어왔다는 것을 error message로 알려줍니다.

### Enum

```typescript
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green
```

마찬가지로 Java의 `enum`과 같은 구조를 갖습니다. 시작하는 멤버에 0부터 번호를 매기고, 만약 1부터 시작해야 한다면 임의적으로 시작하는 숫자를 지정할 수 있습니다. 또는 각각에게 번호를 지정할 수도 있습니다.

```typescript
enum Subject {
  Math = 1,
  Science = 3,
  History = 7,
}
console.log(Subject[3]) //Science
```

지정한 번호로 호출도 가능합니다.

`tsc` 명령어를 통해서 저희가 작성한 TypeScript 코드를 변환된 Javascript 코드로 볼 수 있습니다. TypeScript의 `Enum`은 다음과 같이 변환되는 것을 확인하실 수 있습니다.

```javascript
var Subject
;(function(Subject) {
  Subject[(Subject['Math'] = 1)] = 'Math'
  Subject[(Subject['Science'] = 3)] = 'Science'
  Subject[(Subject['History'] = 7)] = 'History'
})(Subject || (Subject = {}))
```

자바스크립트의 다섯 줄이 타입스크립트 한 줄로 작성되었습니다 :)

### Any

코드를 작성하면서 사용되는 변수에 알맞은 데이터 타입을 설정하는 것은 중요하지만 데이터 타입이 동적으로 결정되는 변수도 존재하게 됩니다. 이럴 때 사용할 수 있는 타입이 `any`입니다.

```typescript
let notSureVar: any
notSureVar = 3
notSureVar = `hi`
notSureVar = [1, 2, 3]
```

`any`로 타입을 지정하면 Compile Time에서 `Type checking`을 하지 않습니다.

```typescript
let notSureVar // == let notSureVar: any;
```

`any`로 타입을 지정하는 것과 위의 자바스크립트는 동치라고 볼 수 있습니다.

```typescript
let arr: any[] = [1, `jbee`, true]
```

여러 가지 타입의 요소가 포함되는 배열을 정의할 때도 `any`를 사용할 수 있습니다.
`any`의 역할이 다른 언어에서의 `Object`와 같은 역할을 하는 느낌이 드는데요, 실제로 2.2version에서 `Object`타입이 추가되었습니다. 일단 코드를 통해 확인해보겠습니다.

```typescript
let user = {
  getName() {
    console.log(`hi`)
  },
  name: 'jbee',
}
let notSureObj: Object
notSureObj = user
notSureObj.getName() // error
notSureObj.name // error
//Property 'getName' does not exist on type 'Ojbect'

let notSureVar: any
notSureVar = user
notSureVar.getName() // success
notSureVar.name // "jbee"
```

변수의 type을 `Object`로 지정하고, 실제 Object를 정의하여 변수에 할당했습니다. 그리고 할당한 Ojbect에 존재하는 메소드를 호출했더니 에러가 발생합니다. `getName()`이라는 프로퍼티가 없다고 하네요. 분명 `getName()`메소드가 존재하는 Object를 할당했는데 말이죠. `name` 프로퍼티도 마찬가지입니다. 하지만 `any` 타입으로 지정했을 때는 메소드를 호출할 수 있고, 프로퍼티를 찾을 수 있습니다. 이 `Object` 타입은 할당만 가능할 뿐, 메소드나 프로퍼티에 접근할 수 없습니다.
[About Object Type](https://blog.mariusschulz.com/2017/02/24/typescript-2-2-the-object-type)

### Void

값을 반환하지 않는 함수의 return type을 지정할 때 사용할 수 있습니다.

```typescript
function greeting(): void {
  console.log(`hi`)
}
```

물론 변수의 타입에도 사용할 수 있습니다.

```typescript
let foo: void;
foo = undefined;
foo = null;
foo = `foo`; //error
> Type 'string' is not assignable to type 'void'
```

하지만 `void`로 선언된 변수에는 `undefined`와 `null` 값만 할당할 수 있습니다.

### Null, Undefined

기본적으로 `null`과 `undefined`는 모든 타입들의 서브타입이라고 할 수 있습니다. 즉 다른 타입으로 지정된 변수에도 `null`과 `undefined`를 할당할 수 있습니다.

> `--strictNullChecks` flag를 사용하게 되면 `null`과 `undefined`는 `void`타입의 변수에만 할당할 수 있습니다. TypeScript에서는 해당 flag사용을 권장하고 있습니다.

### Never

`never` 타입은 발생하지 않는 경우에 대한 타입을 대표하는 타입입니다. 코드를 통해 살펴보겠습니다.

```typescript
// Function returning never must have unreachable end point
function error(message: string): never {
  throw new Error(message)
}

// Inferred return type is never
function fail() {
  return error('Something failed')
}

// Function returning never must have unreachable end point
function infiniteLoop(): never {
  while (true) {}
}
```

위의 예제와 같이 `throw`를 하거나 error를 발생시키는 function의 return type으로 설정합니다.
[About Never Type](https://blog.mariusschulz.com/2016/11/18/typescript-2-0-the-never-type)

### Type Assertions

타입 어설션이란 개발자가 타입스크립트에게 "내가 무슨 짓을 하고 있는지 아니까, 나를 믿어줘!"하고 메세지를 보내는 것입니다. 주로 엔티티의 타입을 보다 구체적으로 설정할 때 사용합니다.

```typescript
let greet: any = `Hello!`
let lengthOfGreet: number
lengthOfGreet = greet.length
lengthOfGreet = (<string>greet).length
lengthOfGreet = (greet as string).length
```

`any`타입에 대해서 `형변환(type casting)`하는 것처럼 보이지만 실제로는 특별한 검사나 데이터 재구성을 하지 않습니다. 이 타입 어설션은 컴파일 타임에만 영향을 미칠뿐 런타임시에는 아무런 영향을 주지 않습니다. 보다 데이터 타입을 구체화 시킬 때 사용합니다.
`<>`를 사용하는 방법과 `as`를 사용하는 두 가지 방법이 존재합니다. 선호도에 따라 어떻게 사용할지 결정할 수 있지만 `JSX`와 함께 사용하는 경우에는 `as`를 사용하는 방법만 허용됩니다.

감사합니다 :)

### Reference

[TypeScript Official Document - Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html)

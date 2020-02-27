---
title: 'Redux에서 Normalize 다루기'
date: 2020-02-25 16:02:99
category: react
thumbnail: './images/redux_app_data.png'
---

![redux_app_data](./images/redux_app_data.png)

웹이 복잡해질수록 프런트엔드(자바스크립트 환경)에서 다뤄야 하는 상태가 많아진다. 그 종류도 점점 다양해지면서 UI의 상태와 도메인 데이터에 대한 값들도 함께 다뤄야 한다. UI도 중요하지만 React Application의 상태를 '잘' **설계(Design)**해야 한다.

자연스럽게 상태 관리를 위한 라이브러리가 많이 등장했다. `Redux`를 시작으로 `MobX`, `xstate` 등 여러 라이브러리가 존재한다. 이번 포스팅에서는 redux 라이브러리와 normalizr 라이브러리를 중심으로 상태 설계에 대한 내용을 다룬다.

### Table of Contents

- Designing a Normalized State
- Profit
- When

> 사용된 예제 코드는 [react-data-handling-lab](https://github.com/JaeYeopHan/react-data-handling-lab)에서 확인할 수 있다.

# Normalize

보통 '정규화' 과정이라고 불린다. 데이터의 구조를 가공하는 방법 중 하나이며 데이터베이스에서 많이 사용된다. ([참고](https://github.com/JaeYeopHan/Interview_Question_for_Beginner/tree/master/Database#%EC%A0%95%EA%B7%9C%ED%99%94%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C))

웹 프런트엔드에서는 상태 관리 라이브러리에서 지원을 하는 경우도 있고 보통 [normalizr](https://github.com/paularmstrong/normalizr)라는 라이브러리를 통해 정규화를 진행한다. 최근에는 [redux-toolkit](https://github.com/reduxjs/redux-toolkit)이라는 상태 관리 라이브러리에 관련 API로 `createEntityAdapter`가 추가됐다. ([1.3.0 version Release Note](https://github.com/reduxjs/redux-toolkit/releases/tag/v1.3.0-alpha.9))

## Designing a Normalized State

데이터를 정규화한다는 것은 기본적으로 다음과 같은 의미를 갖는다.

1. 상태에서 각 데이터의 타입은 자신의 **"테이블"**을 가짐.
2. 각 "테이블"은 **항목의 아이디(id)를 키**로, **항목들을 값**으로 가지는 개별 항목 아이템을 저장.
3. 개별 항목에 대해 항목의 **아이디로 참조**.
4. 배열의 ID는 **순서**를 나타냄.

위 개념들에 대해서 `normalizr`를 사용한 예제 코드를 살펴보면 다음과 같다.

```ts
export interface IPost {
  id: string
  title: string
  author: IUser
  body: string
  comments: IComment[]
}

export type IPostEntity = IEntityTypeOf<IPost>

export const post = new schema.Entity<IPost>('posts', {
  author: user,
  comments: [comment],
})
```

`Post`라는 게시글에 대한 간단한 타입을 `IPost`로 정의하고 이 게시글에는 저자(author)와 댓글(comment)에 대한 정보를 포함하고 있다. 여기에서 `author`와 `comment`에 대한 부분을 별도 entity를 참조할 수 있도록 정의를 해준다.

```ts
export const comment = new schema.Entity<IComment>('comments', {
  author: user,
})
export const user = new schema.Entity<IUser>('users', {}, { idAttribute: 'id' })
```

`comment`와 `user`에 대해서도 동일하게 entity를 정의해준다.

정규화(normalize)하는 코드는 다음과 같이 작성된다.

```ts
export function normalizePost(data: IPost[]): INormalizedPosts {
  return normalize(data, [post])
}
```

실제 데이터가 변환되는 것을 테스트 코드로 살펴보면 다음과 같다.

```ts{3,36,80}
test('should return normalized post data', () => {
  // Given (정규화 이전의 데이터)
  const data = [
    {
      id: 'post1',
      title: 'First Post',
      author: { id: 'user1', name: 'User 1' },
      body: '...post contents 1..',
      comments: [
        {
          id: 1,
          author: { id: 'user2', name: 'User 2' },
          comment: '...comment 1-1..',
        },
        {
          id: 2,
          author: { id: 'user3', name: 'User 3' },
          comment: '...comment 1-2..',
        },
      ],
    },
    {
      id: 'post2',
      title: 'Second Post',
      author: { id: 'user2', name: 'User 2' },
      body: '...post contents 2...',
      comments: [],
    },
  ]

  // When (정규화)
  const result = normalizePost(data)

  // Then (정규화 처리가 된 데이터)
  expect(result).toEqual({
    entities: {
      posts: {
        post1: {
          id: 'post1',
          title: 'First Post',
          author: 'user1',
          body: '...post contents 1..',
          comments: [1, 2],
        },
        post2: {
          id: 'post2',
          title: 'Second Post',
          author: 'user2',
          body: '...post contents 2...',
          comments: [],
        },
      },
      comments: {
        1: {
          id: 1,
          author: 'user2',
          comment: '...comment 1-1..',
        },
        2: {
          id: 2,
          author: 'user3',
          comment: '...comment 1-2..',
        },
      },
      users: {
        user1: {
          id: 'user1',
          name: 'User 1',
        },
        user2: {
          id: 'user2',
          name: 'User 2',
        },
        user3: {
          id: 'user3',
          name: 'User 3',
        },
      },
    },
    result: ['post1', 'post2'],
  })
})
```

기존의 `data` 배열은 게시글에 대한 모든 정보를 포함하고 있는 객체 리스트였다. 이 거대한 데이터를 정규화 과정을 통하여 `entities`라는 객체와 `result`라는 id 값의 배열로 변환되었다. `entities`에는 entity로 정의되었던 `post`, `comment`, `user`가 정의되어 있다.

`post` 객체를 살펴보면 entity로 정의되었던 comment, user에 대한 값으로 `id` 값만 가지고 있는 것을 확인할 수 있다. 즉, comment, user에 대한 실제 데이터는 `id` 값을 가지고 각각의 entity를 참조하는 방식인 것이다.

### With TypeScript

예제 코드에서 TypeScript가 사용되었는데 normalize 결과물에 대한 타입을 정의해줘야 한다. 위 코드에서는 다음과 같은 타입을 적용하였다.

```ts{8}
export interface IndexSignatureStringType<V> {
  [key: string]: V
}

type ValueType = string | number | symbol
type EntityValueType<P> = P extends (infer R)[] ? string[] : string

export type IEntityTypeOf<M> = {
  [k in keyof M]: M[k] extends ValueType ? M[k] : EntityValueType<M[k]>
}
```

entity로 정규화가 되면 문자열 타입의 키를 갖는 객체 형식(`{ [key: string]: T }`)으로 변환된다. 그리고 id값으로 참조가 될 것들을 `ValueType`으로 지정해뒀다.

`IEntityTypeOf<M>`에서 `M`에는 `IPost`가 들어오게 되고 이 타입은 정규화의 결과값 중 `entities`에 해당하는 객체의 타입이 된다.

> Conditional Type and infer (WIP)

> [Generic in TypeScript](https://jbee.io/typescript/TS-5-Generics-in-TypeScript/)

## Profits

이 정규화 과정을 통해서 얻는 것은 무엇이 있을까? 아래 내용은 [redux의 문서](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape/)를 참고하여 작성하였다.

### 간결해지는 Reducer

리듀서(reducer) 로직이 중첩된 데이터를 관리하지 않아도 되기 때문에 간결해진다. 하나의 데이터는 한 곳에만 정의되므로 어떠한 업데이트에 대해 여러 데이터를 변경하지 않아도 된다.

주어진 항목을 검색하거나 업데이트하는 로직이 간단해지고 일관성을 갖게 된다. 항목의 타입과 `id` 값으로 검색이 가능해지며 데이터의 값을 변경할 때는 그 데이터를 관리하는 reducer에서만 작업이 이루어진다.

### 성능

데이터 변경으로 업데이트가 필요한 UI의 부분이 적어진다. 특정 데이터의 변경이 발생했을 때, 원래의 중첩된 모양에서는 댓글, 게시글 객체 배열의 업데이트가 필요했다. 이것은 여러 요소들에 대해 업데이트를 요청하게 된다. 정규화 된 데이터를 바라보고 있는(subscribe) 컴포넌트는 `id` 값에 해당하는 값에 대한 변경만 반영하면 된다.

## When?

좋은 내용만 설명했는데, 무조건 정규화하는 것이 옳은 데이터 관리 방법일까?

위 [Profits](#profits)에서 몇몇 상황을 가정하여 장점을 설명했는데, 그 몇몇 상황이 정말 발생하는지 **면밀히 검토해볼 필요**가 있다.

### 중첩된 데이터

서버에서 전달받는 데이터, 또는 React 애플리케이션에서 관리해야 하는 UI 상태들이 중첩된 형태를 갖는가?

우선 서버에서 전달받는 데이터가 그러하다면 정규화를 고려해볼 필요가 있다. 서버 개발자와의 조율하였지만 여러 가지 사정으로 전달받는 데이터가 여러 계층 구조를 취하고 있을 수 있기 때문이다.

그러나 UI에 대한 상태들이 중첩된 구조를 갖는다면 정규화 이전에 상태 그 자체를 리팩토링 해야 한다.

많은 페이지에 대한 상태를 관리하고 있을 경우 **reducer를 분리**해야하며 **Local component에서 관리해도 충분한 상태는 없는지** 살펴봐야 한다.

### 특정 데이터의 변경이 발생했을 때

중첩된 구조를 갖는 데이터에 **수정이 발생하는가?** 수정이 발생하지 않는다면 위 profit에서 다룬 장점이 실제 장점으로 다가올 경우가 없다. 그저 서버에서 전달받은 데이터를 렌더링할 경우에는 '굳이' 정규화 과정이 필요없다.

변경이 발생하더라도 변경이 발생한 후, 데이터를 동기화하기 위해 component를 unmount하고 **API를 다시 호출하는 경우**에도 마찬가지로 정규화 과정을 진행할 필요가 없다.

오히려 정규화 과정을 진행할 경우, 여러 부수적인 작업들이 따라오기 때문에 이 부분을 신경쓰는데 시간이 더 걸릴 수 있다.

즉 API를 다시 호출하여 데이터를 동기화하기 전, 애플리케이션의 클라이어트 레벨에서 여러 작업들이 진행되어 여러 컴포넌트들의 상태를 동기화해줘야 할 경우, 정규화가 필수적이다.

## 마무리

일반적인 컨테이너-프레젠테이션 컴포넌트 구조에서는 상태 관리 시스템(store)과 연결된 컨테이너가 적고 UI를 담당하는 컴포넌트가 많은 양의 데이터를 props로 전달받는다. 상태 구조, 데이터를 정규화하는 것은 이와 반대이다. 상태 관리 시스템과 더 많은 컴포넌트가 연결되고 각 컴포넌트가 자체적으로 데이터를 조회하게 된다. 올바른 상황에 적절히 적용하면 아주 좋은 방법이 될 수 있는 방법이다.

> 사용된 예제 코드는 [react-data-handling-lab](https://github.com/JaeYeopHan/react-data-handling-lab)에서 확인할 수 있다.

### References

- https://ngrx.io/guide/entity
- https://github.com/paularmstrong/normalizr
- https://medium.com/@jmsoliv95/normalizing-your-data-with-normalizr-d0e95a1b16ea

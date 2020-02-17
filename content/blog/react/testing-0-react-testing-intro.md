---
title: '[Testing] 0. React Testing 시리즈를 들어가며'
date: 2020-01-01 21:12:98
category: react
thumbnail: './images/react-testing-logo.png'
---

![react-testing-logo](./images/react-testing-logo.png)

앞서 [React 프로젝트의 구조에 대한 이야기를 4편](https://jbee.io/react/react-0-intro/)에 걸쳐서 실컷했다. 그런데 설계 이야기를 하면서 테스트 이야기는 하지 않았다. 설계에 대해서는 필자도 잘 모르지만 테스트와 설계는 뗄 수 없는 관계라는 정도는 알고 있다.

테스트를 고려하지 않은 설계는 반쪽짜리 설계에 불과하다. 그래서 이번에는 테스트에 관련된 이야기를 해보려고 한다. 이번 프로젝트에서 테스트를 어떻게 진행했는지에 대한 내용을 소개할 예정이며 이 글을 읽고 다시 설계 글을 읽으면 조금 더 잘 다가올 것 같다.

### 🚧 알려드립니다.

- React 구조 시리즈와 마찬가지로 이 글은 테스트에 대한 튜토리얼 글이 아닙니다.
- Testing의 정석도 당연히 아닙니다. (함부로 따라하지 마시오.)
- 프로젝트를 진행하면서 느꼈던 것들, 적용해본 것들에 대해 이야기 합니다.

## Table of Contents

### [Part 1. 프론트엔드, 무엇을 테스트 할 것인가](https://jbee.io/react/testing-1-react-testing/)

- 이 앱, 지금 제대로 동작하니?
- 무언가 잘못되었다.
- UI 검증을 위한 테스트
- 왜 테스트해야 하는지 명심하기
- 그래서 무엇을 테스트하는가?

### [Part 2. 어떻게 테스트 할 것인가](https://jbee.io/react/testing-2-react-testing/)

- 테스트의 기본
- 테스트 분류
- 비즈니스 로직과 렌더링의 분리
- 테스트 케이스 만들기

### [Part 3. Store와 로직 테스트](https://jbee.io/react/testing-3-react-testing/)

- Store
- Store에 대한 단위 테스트

### [Part 4. 컴포넌트 테스트와 검증](https://jbee.io/react/testing-4-react-testing/)

- UI 검증을 위한 Storybook 활용

### [Part 5. 여러 테스팅에 대한 생각](https://jbee.io/react/testing-5-react-testing/)

- snapshot 테스트에 대한 생각
- E2E Test에 대한 생각
- Coverage에 대한 생각

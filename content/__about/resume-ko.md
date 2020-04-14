---
title: 'about'
date: 2020-4-14 13:21:13
lang: 'ko'
---

# 한재엽 (Jbee)

**저는 `______` 하는 엔지니어입니다.**

1. 좋은 코드와 설계를 고민하는
2. 지속 가능한 프로덕트를 개발하는데 집중하는
3. 자동화를 통한 생산성 향상에 신경쓰는
4. 업무 프로세스 그리고 이를 뒷받침하는 조직 문화에 관심이 많은
5. 커뮤니티를 좋아하고 글쓰기를 좋아하는

**저는 `______` 하는 조직을 선호합니다.**

1. 투명한 의사결정이 이루어지고 공유되는
2. 구성원 간 신뢰를 기반으로 자율적으로 일하는
3. 불필요한 커뮤니케이션을 줄여 효율적으로 움직이는
4. 하는 일이 조직의 밸류 체인에서 어떠한 임팩트를 갖는지 고민하는
5. 기술이 비즈니스의 핵심 동력이며 제 코드가 비즈니스에 도움이 될 수 있는

|             |                                 |
| :---------: | ------------------------------- |
| **GitHub**  | <https://github.com/JaeYeopHan> |
|  **Blog**   | <https://jbee.io>               |
| **Contact** | <ljyhanll@gmail.com>            |

<br />

# Experiences

## LINE Financial Plus

|              |                                                                 |
| -----------: | --------------------------------------------------------------- |
|   **period** | 18.11 ~ 20.04                                                   |
| **position** | Web Dev 2 / Front-End Engineer                                  |
| **projects** | LINE Indonesia Bank, Smart Invest Japan, Webview SDK, Mentoring |

### Indonesia Bank (웹뷰 영역 개발)

인도네시아 국가를 대상으로 하나은행과 함께 진행하는 은행 애플리케이션.

- 19.02 ~ current
- TypeScript, React, Redux, redux-saga, react-router, react-i18n, jest, Storybook

#### Description

- 프로젝트 초기 React Application Architecture 설계
  - 새로운 프로젝트 개발 환경 및 구조를 담당하여 연구하고 설계
- Storybook을 통한 UI 검증 프로세스 간소화
  - 페이지 단위로 사용하여 UI가 제대로 노출되는지 검증하는 단계를 간소화.
- App like UI를 위한 시도
  - 관련 자료: [https://github.com/JaeYeopHan/ux-lab](https://github.com/JaeYeopHan/ux-lab)
- redux-saga Unit 테스트를 강화
  - 프론트엔드에서의 비즈니스 로직 등을 redux-saga라는 미들웨어에서 처리하면서 테스트를 작성.
- 웹뷰 파트 리드로 CR 프로세스, QA 프로세스, 일정, 커뮤니케이션 포인트 정리

### Smart Invest (Front-End 개발 담당)

LINE Messenger 플랫폼을 기반으로 운영되는 투자 서비스 중개 플랫폼.

- 18.11 ~ current
- Vue, Vuex, vue-router, vue-i18n, jest

#### Description

- 외부 외주 인력에 의해 개발 및 유지 보수된 서비스를 3개월 동안 마이그레이션 작업 및 내재화 진행
- 성능 향상 및 사용성 개선
  - 성능, 접근성, SEO 등 기존에 부족했던 부분들을 전반적으로 개선. (Lighthouse 기준으로 평균 80점에서 97점으로 상승)
  - 압축, 코드 스플리팅, 트리 쉐이킹 등의 기법으로 기존 bundle 파일 대비 사이즈를 2배 이상 줄이고 이미지 레이지 로딩으로 초기 로딩 속도를 개선.
  - 라우팅 이동 간 트랜지션 추가, 스크롤 복원 등의 UX 제안을 통해 사용자로 하여금 서비스 이탈율을 낮추고 사용성을 개선.
- 테스트 코드 작성으로 프로덕트 안정성 향상
  - 내재화 과정에서 구조 변경과 함께 테스트 코드 작성. (테스트 커버리지는 0% → 67%)
- 생산성 향상 및 배포 안정성을 위한 자동화
  - Jenkins, 사내 CDN 시스템, 사내 클라우드 시스템 연동으로 원버튼 배포 시스템 구축하여 정적 리소스 파일 배포 자동화
  - 퍼블리셔와 협업하기 힘든 구조를 자동화. (HTML/CSS 업데이트하는 부분을 스크립트로 자동화)
- 프로젝트 문서화
  - 개발 환경, 프로젝트의 구조, Trouble Shooting, Policy 등에 대한 부분을 문서화.

<br />

## NAVER Corporation

|              |                                    |
| :----------: | ---------------------------------- |
|  **period**  | 17.07 ~ 18.10                      |
| **position** | FE Platform / Front-End Engineer   |
| **projects** | SmartAround, generator-sau-webpack |

### SmartAround Service (Front-End 개발)

사용자의 위치를 기반으로 맛집, 액티비티, 방문할만한 곳 등 다양항 정보를 제공해주는 서비스.

- 18.02 ~ 18.10
- TypeScript, jQuery, lerna

#### Description

- 팀 내 TypeScript 도입
  - 복잡한 UI를 여러 Layer로 나누어 설계 후, 각 Layer 간의 interface를 강제하기 위해 TypeScript를 도입.
  - 도입 후, 팀 내 TypeScript 전파를 위해 스터디 진행.
- 성능 및 UX 개선 작업
  - 이미지 레이지 로딩, 컴포넌트 레이지 초기화를 통한 초기 로딩 성능을 개선.
  - 브라우저 뒤로가기, 외부 공유 등의 상황에서 사용자가 바라보고 있던 화면이 유지되도록 개발.
- 팀 내 모듈들을 관리하기 위해 lerna 도입
  - 팀 내에서 사용할 수 있는 컴포넌트, 모듈들을 사내 npm registry에 배포 및 관리.
- 프로젝트 회고에 대한 연구 및 진행
  - 팀 내 회고 문화를 전파 (관련 [블로그 글](https://jbee.io/essay/about_retrospective/))

### Project Generator

- Yeoman Generator 기반의 개발 환경 scaffolding 도구.
- 프로젝트의 기반이 되는 TypeScript 기반의 template을 제작 및 유지보수.
- 팀 내에서 사용되는 프로젝트 구조를 템플릿화 하여 create-react-app 같은 CLI 도구 제작.
- 개인 토이 프로젝트 용으로도 만들어서 사용. ([GitHub Repository](https://github.com/JaeYeopHan/generator-toy-project))

<br />

# Open Source Projects

## gatsby-starter-bee

- GitHub: <https://github.com/JaeYeopHan/gatsby-starter-bee>
- _React, Gatsby_

Gatsby를 기반으로 만든 블로그 템플릿. 기존에 흔히 볼 수 있는 블로그 템플릿이 아닌 산뜻한 UI를 만들기 위해 고민.

### gatsby-remark-images-medium-zoom

- GitHub: <https://github.com/JaeYeopHan/gatsby-remark-images-medium-zoom>

medium-zoom 이라는 오픈소스를 Gatsby에서 쉽게 사용할 수 있도록 plugin 형식으로 wrapping한 오픈소스 라이브러리.

## octodirect - chrome extension

- Chrome web store link: <http://bit.ly/2wL9Iwv>
- GitHub: <https://github.com/JaeYeopHan/octodirect>
- _React, TypeScript, Redux, Redux-saga_

자신이 생성했거나, 관리하고 있는 저장소, 이전에 방문했던 저장소, 자신이 star를 누른 저장소 등을 curating하여 단축키를 통해 바로 이동할 수 있는 chrome extension. 크롬 익스텐션의 versioning, 배포 부분을 나름의 배포 스크립트 자동화.

## cra-template-unicorn

- GitHub: <https://github.com/JaeYeopHan/cra-template-unicorn>
- _React, create-react-app, craco, redux-toolkit, emotion_
- Managed by _GitHub Action, semantic-release, NPM package_

create-react-app을 사용할 때, template으로 사용할 수 있는 오픈소스 프로젝트입니다. VSCode 개발 환경 구축, Prettier, react-redux, react-router 등 React Application 프로젝트를 시작하기 위한 기본적인 개발 환경을 담고 있습니다.

<br />

# Communities

## Presentations

### GDG Intern Special: 멘토스와 인턴콜라

<https://speakerdeck.com/jaeyeophan/mentoseuwa-inteonkolra>

_[2019.07.06]_ 인턴십에서 1번의 실패와 1번의 성공의 경험을 공유. 추가적으로 멘토링했던 경험을 함께 공유.

### NAVER Boostcamp: 미리 알았다면 좋았을 것 들

<https://speakerdeck.com/jaeyeophan/miri-alassdamyeon-johasseul-geosdeul>

_[2019.06.24]_ 업무를 진행하면서 알게 된 부분, 개발자가 되기 전에 알았으면 좋았을 부분들을 공유.

### GDG Frontendgame: UX빼면 시체 프런트엔드

<https://speakerdeck.com/jaeyeophan/uxbbaemyeon-sice-peureonteuendeu>

_[2019.06.22]_ 프론트엔드 영역이 존재하는 이유라고 말할 수 있는 UX에 대한 이야기를 공유.

### NAVER Tech Concert: 주니어 개발자의 성장에 대한 뻔하지만 뻔하지 않은 이야기

<https://speakerdeck.com/jaeyeophan/junieo-gaebaljayi-seongjange-daehaeseo>

_[2019.04.11]_ 개발자로서의 성장에 대한 내용으로 사이드 프로젝트를 통한 성장 뿐만 아니라 회사에서의 업무를 통한 성장 또한 중요하다는 내용을 구체적인 예시와 함께 공유.

### GDG Devfest Seoul 2018: Chrome Devtools를 활용한 웹 프론트엔드 성능 측정과 개선

<https://slides.com/jbee/devfest_seoul_2018_performance_optimization_with_chrome_devtools>

_[2018.11.10]_ 웹 프론트엔드 성능과 관련하여 크게 측정과 개선 두 부분에 대한 내용을 공유.

### GDG Campus Meetup(2018): 함께 일하고 싶은 개발자

<https://speakerdeck.com/jaeyeophan/gdg-campus-2018-meetup-balpyojaryo-hamgge-ilhago-sipeun-gaebalja>

_[2018.02.11]_ 현업에서 배운 '개발'을 소개하며 함께 일하고 싶은 개발자는 무엇일까에 대한 이야기를 공유.

## Activity

### [FEConf Organizer](https://2019.feconf.kr/)

|                 |                                                                                       |
| --------------: | ------------------------------------------------------------------------------------- |
|      **period** | 18.06. ~ current.                                                                     |
| **description** | 페이스북 그룹인 '프론트엔드 개발 그룹'의 운영진이며 FEConf라는 컨퍼런스의 오거나이저. |

## Lecture

### ECMAScript 2016

<https://www.slideshare.net/JaeYeopHan/es6-1-let-const>

사내에서 진행한 자바스크립트 강의 자료.

### TypeScript Tutorial

<https://www.slideshare.net/JaeYeopHan/intro-typescript-playground>

사내에서 진행한 타입스크립트 강의 자료.

<br />

# Education

### NHN NEXT

(16.03 ~ 17.09) Web 과정 수료

<div align="center" class="final">

_감사합니다._

<br/>

<sub><sup>Front-End Engineer, <a href="https://github.com/JaeYeopHan">@Jbee</a></sup></sub>

</div>

---
title: 'about'
date: 2021-4-17 13:21:13
lang: 'ko'
---

# 한재엽 (Jbee)

<div align="right"><sub><i>Last updated: 2022.03.26</i></sub></div>

**저는 `______` 하는 엔지니어입니다.**

1. 지속 가능한 제품을 개발하는데 집중하는
2. 개인과 조직의 생산성에 신경쓰는
3. 채용을 비롯한 개발 문화에 관심이 많은

**저는 `______` 하는 조직을 선호합니다.**

1. 의사결정이 투명하게 이뤄지고 공유되는
2. 구성원 간 신뢰를 기반으로 자율적으로 일하는
3. 조직의 비전을 구성원들이 모두 알고 있고 공감하는

|             |                                 |
| :---------: | ------------------------------- |
| **GitHub**  | <https://github.com/JaeYeopHan> |
|  **Blog**   | <https://jbee.io>               |
| **Contact** | <ljyhanll@gmail.com>            |

<br />

# Experiences

## TossPayments

|              |                                                          |
| -----------: | -------------------------------------------------------- |
|   **period** | 20.10 ~ current                                          |
| **position** | Dashboard Silo Frontend Engineer, Frontend Platform Team |
| **projects** | 가맹점 대시보드 / 프런트엔드 배포 어드민       |
|    *tech*    |  Next.js, TypeScript, react-query, react-hook-form, emotion |

#### 가맹점 대시보드 (20.10 ~ current)

- 사업자가 사업을 하는데 있어서 결제와 관련되어 필요한 모든 것을 할 수 있는 제품
- 에러 처리 및 모니터링 효율화 (<https://jbee.io/react/error-declarative-handling-0/>)
- Headless UI 라이브러리 개발하여 어느 제품에서라도 재사용 가능하도록 개발 ([@h6s](https://github.com/h6s-dev/h6s))

#### [토스페이먼츠 홈페이지](https://tosspayments.com/) (22.02 ~ current)

- 신규 가맹점을 데려오기 위한 수단 중 하나로 제안서 성격의 홈페이지 제품
- 기획 단계에서부터 개발, AB 테스트를 통한 전환율 개선까지 참여

#### CI/CD 구성 및 프런트엔드 배포 어드민 (20.10 ~ 22.02)

- Amazon Web Service 리소스들을 Terraform으로 관리
- Amazon Web Service의 S3, CloudFront, Lambda@edge를 사용한 정적 배포 구성
- GitHub Action을 기반으로 CI/CD 구성
- 원버튼 배포 및 롤백 환경을 위한 어드민 웹 애플리케이션 구성

## Toss (Viva Republica)

|              |                                                      |
| -----------: | ---------------------------------------------------- |
|   **period** | 20.04 ~ 20.10                                        |
| **position** | Web Platform Team, Inflow Silo / Front-End Engineer  |
| **projects** | 로그센터, 숨은정부지원금찾기, 반짝특가, 매일행운상자 |

#### Log Center (로그센터) / Logging SDK (20.02 ~ 20.10)

> TypeScript, Next.js, swr, react-hook-form, emotion

- 토스앱 내에서 사용자의 행동을 추적할 수 있는 로그들을 쉽게 관리할 수 있는 웹 애플리케이션 제품 / 제품에서 사용할 수 있는 로깅 SDK
- 복잡한 Form을 Uncontrolled, Controlled의 조합으로 설계 및 개발
- DX를 고려한 로깅 SDK 인터페이스 설계 및 개발

#### 토스앱 인플로우 제품 (20.04 ~ 20.10)

> TypeScript, Next.js, emotion

- 토스앱에 신규 유저를 유치하기 위한 제품들을 개발 (숨은정부지원금찾기, 반짝특가, 매일행운상자)
- 초대 Scheme, 공유 Scheme, 혜택 Scheme등을 적용하여 여러 제품을 짧은 주기로 실험

## LINE Financial Plus

|              |                                                                 |
| -----------: | --------------------------------------------------------------- |
|   **period** | 18.11 ~ 20.04                                                   |
| **position** | Web Dev 2 / Front-End Engineer                                  |
| **projects** | LINE Indonesia Bank, Smart Invest Japan, Webview SDK, Mentoring |

### Indonesia Bank (웹뷰 영역 개발)

인도네시아 국가를 대상으로 하나은행과 함께 진행하는 은행 애플리케이션.

- 19.02 ~ 20.04
- TypeScript, React, Redux, redux-saga, react-router, react-i18n, jest, Storybook

#### Description

- 프로젝트 초기 React Application Architecture 설계
- Storybook을 통한 UI 검증 프로세스 간소화
- App like UI를 위한 시도 (https://github.com/JaeYeopHan/ux-lab)
- redux-saga Unit 테스트를 강화
- 웹뷰 파트 리드로 CR 프로세스, QA 프로세스, 일정, 커뮤니케이션 포인트 정리

### Smart Invest (Front-End 개발 담당)

LINE Messenger 플랫폼을 기반으로 운영되는 투자 서비스 중개 플랫폼.

- 18.11 ~ 20.04
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

- react-query contributions ([PRs](tannerlinsley/react-query))
- [h6s](https://github.com/h6s-dev/h6s): Serve headless component development kit for React production apps
- [gatsby-starter-bee template](https://github.com/JaeYeopHan/gatsby-starter-bee)

<br />

# Communities

## Presentations

- [GDG Intern Special: 멘토스와 인턴콜라](https://speakerdeck.com/jaeyeophan/mentoseuwa-inteonkolra) (2019.07.06)
- [NAVER Boostcamp: 미리 알았다면 좋았을 것 들](https://speakerdeck.com/jaeyeophan/miri-alassdamyeon-johasseul-geosdeul) (2019.06.24)
- [GDG Frontendgame: UX빼면 시체 프런트엔드](https://speakerdeck.com/jaeyeophan/uxbbaemyeon-sice-peureonteuendeu) (2019.06.22)
- [NAVER Tech Concert: 주니어 개발자의 성장에 대한 뻔하지만 뻔하지 않은 이야기](https://speakerdeck.com/jaeyeophan/junieo-gaebaljayi-seongjange-daehaeseo) (2019.04.11)
- [GDG Devfest Seoul: Chrome Devtools를 활용한 웹 프론트엔드 성능 측정과 개선](https://slides.com/jbee/devfest_seoul_2018_performance_optimization_with_chrome_devtools) (2018.11.10)
- [GDG Campus Meetup: 함께 일하고 싶은 개발자](https://speakerdeck.com/jaeyeophan/gdg-campus-2018-meetup-balpyojaryo-hamgge-ilhago-sipeun-gaebalja) (2018.02.11)

## Activity

- [FEConf Organizer](https://2020.feconf.kr/) (18.06 ~ current)
- [우아한테크코스 리뷰어](https://woowacourse.github.io/about.html) (21.02 ~ 21.06)


## Lecture

- [ECMAScript 2016](https://www.slideshare.net/JaeYeopHan/es6-1-let-const)
- [TypeScript Tutorial](https://www.slideshare.net/JaeYeopHan/intro-typescript-playground)

<br />

# Education

### NHN NEXT

(16.03 ~ 17.09) Web 과정 수료

<div align="center" class="final">

_감사합니다._

<br/>

<sub><sup>Front-End Engineer, <a href="https://github.com/JaeYeopHan">@Jbee</a></sup></sub>

</div>

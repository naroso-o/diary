# 📖 Personal Diary App

마음에 드는 다이어리 앱을 찾지 못해서 직접 만든 개인 다이어리 애플리케이션입니다.

## ✨ 주요 기능

### 📝 일기 작성
- **직관적인 에디터**: 마크다운 지원과 실시간 저장
- **기분 기록**: 매일의 기분을 이모지로 기록
- **태그 시스템**: 일기에 태그를 추가하여 분류
- **자동 저장**: 실시간으로 내용이 저장되어 안전
- **단어 수 카운트**: 작성한 글의 단어 수 자동 계산

### 📅 캘린더 뷰
- **월간 캘린더**: 한눈에 보는 월간 일기 현황
- **기분 표시**: 각 날짜에 기분 이모지로 표시
- **빠른 이동**: 날짜 클릭으로 해당 일기로 이동
- **미니 캘린더**: 사이드바에서 간단한 캘린더 확인

### 🔍 검색 기능
- **전문 검색**: 제목과 내용에서 키워드 검색
- **기분별 필터**: 특정 기분의 일기만 검색
- **날짜 범위**: 기간을 지정하여 검색
- **검색 히스토리**: 최근 검색어 저장

### 📊 통계 및 분석
- **작성 통계**: 총 일기 수, 단어 수, 평균 등
- **기분 분석**: 가장 많이 느낀 기분과 트렌드
- **활동 그래프**: 주간/월간 작성 활동 시각화
- **태그 분석**: 자주 사용한 태그 순위

### ⚙️ 개인화 설정
- **테마 커스터마이징**: 다크/라이트 모드 및 커스텀 색상
- **폰트 크기 조절**: 읽기 편한 폰트 크기 설정
- **키보드 단축키**: 빠른 작업을 위한 단축키 지원
- **자동 저장**: 실시간 저장 설정

### 🔐 보안 및 동기화
- **Supabase 백엔드**: 안전한 클라우드 저장
- **실시간 동기화**: 여러 기기에서 동기화
- **오프라인 지원**: 인터넷 없이도 작성 가능
- **데이터 백업**: 자동 백업 및 수동 내보내기

## 🚀 기술 스택

### Frontend
- **React 18** - 사용자 인터페이스
- **TypeScript** - 타입 안전성
- **Vite** - 빠른 개발 환경
- **Tailwind CSS** - 스타일링
- **Zustand** - 상태 관리
- **Lucide React** - 아이콘

### Backend & Database
- **Supabase** - 백엔드 서비스
- **PostgreSQL** - 데이터베이스
- **Row Level Security** - 데이터 보안

### 개발 도구
- **ESLint** - 코드 품질
- **Prettier** - 코드 포맷팅
- **TypeScript** - 정적 타입 검사

## 🛠️ 설치 및 실행

### 필수 요구사항
- Node.js 18+ 
- pnpm (권장) 또는 npm

### 1. 저장소 클론
```bash
git clone <repository-url>
cd diary-app
```

### 2. 의존성 설치
```bash
pnpm install
```

### 3. 환경 변수 설정
`.env` 파일을 생성하고 Supabase 설정을 추가하세요:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 개발 서버 실행
```bash
pnpm dev
```

### 5. 빌드
```bash
pnpm build
```

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── auth/           # 인증 관련 컴포넌트
│   ├── calendar/       # 캘린더 뷰 컴포넌트
│   ├── diary/          # 일기 작성 컴포넌트
│   ├── layout/         # 레이아웃 컴포넌트
│   ├── mood/           # 기분 선택 컴포넌트
│   ├── search/         # 검색 컴포넌트
│   ├── settings/       # 설정 컴포넌트
│   └── ui/             # 공통 UI 컴포넌트
├── hooks/              # 커스텀 React 훅
├── stores/             # Zustand 상태 관리
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
└── assets/             # 정적 자산
```

## ⌨️ 키보드 단축키

| 단축키 | 기능 |
|--------|------|
| `Ctrl + N` | 새 일기 작성 |
| `Ctrl + F` | 검색 |
| `Ctrl + C` | 캘린더 뷰 |
| `Ctrl + T` | 오늘 날짜로 이동 |
| `Ctrl + ,` | 설정 |
| `Esc` | 사이드바 토글 |

## 🔧 주요 기능 상세

### 인증 시스템
- 이메일/비밀번호 로그인
- 회원가입 및 프로필 관리
- 자동 로그인 유지
- 비밀번호 재설정

### 데이터 관리
- 실시간 동기화
- 오프라인 지원
- 자동 백업
- 데이터 내보내기/가져오기

### 사용자 경험
- 반응형 디자인
- 다크/라이트 모드
- 접근성 지원
- 키보드 네비게이션

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 감사의 말

- [Supabase](https://supabase.com/) - 백엔드 서비스
- [Lucide](https://lucide.dev/) - 아이콘
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [Zustand](https://github.com/pmndrs/zustand) - 상태 관리

---

**개발자**: 마음에 드는 다이어리 앱을 찾지 못해서 직접 만든 개인 프로젝트입니다. 🎯

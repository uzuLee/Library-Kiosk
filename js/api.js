const Api = (function() {
    const STORAGE_KEY = 'kiosk_db_v61';
    const MAX_LOAN_COUNT = 3;

    const initialDB = {
        books: [
            {
                "id": "B001",
                "title": "Clean Code(클린 코드)",
                "author": "로버트 C. 마틴",
                "publisher": "인사이트",
                "publicationDate": "2013-12-24",
                "pages": 584,
                "genre": "IT/프로그래밍",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/200x300/pdt/9788966262472.jpg"
            },
            {
                "id": "B002",
                "title": "모던 자바스크립트 Deep Dive",
                "author": "이웅모",
                "publisher": "위키북스",
                "publicationDate": "2020-09-25",
                "pages": 1056,
                "genre": "IT/프로그래밍",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791158392239.jpg"
            },
            {
                "id": "B003",
                "title": "객체지향의 사실과 오해",
                "author": "조영호",
                "publisher": "위키북스",
                "publicationDate": "2015-06-17",
                "pages": 260,
                "genre": "IT/프로그래밍",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788998139766.jpg"
            },
            {
                "id": "B004",
                "title": "HTTP 완벽 가이드",
                "author": "데이빗 고울리 외",
                "publisher": "인사이트",
                "publicationDate": "2014-09-30",
                "pages": 748,
                "genre": "IT/프로그래밍",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788966261208.jpg"
            },
            {
                "id": "B005",
                "title": "혼자 공부하는 머신러닝+딥러닝",
                "author": "박해선",
                "publisher": "한빛미디어",
                "publicationDate": "2020-12-21",
                "pages": 560,
                "genre": "IT/프로그래밍",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=dNNSEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B006",
                "title": "면접을 위한 CS 전공지식 노트",
                "author": "주홍철",
                "publisher": "길벗",
                "publicationDate": "2022-09-30",
                "pages": 488,
                "genre": "IT/프로그래밍",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=x6puEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B007",
                "title": "Do it! 점프 투 파이썬",
                "author": "박응용",
                "publisher": "이지스퍼블리싱",
                "publicationDate": "2019-06-20",
                "pages": 360,
                "genre": "IT/프로그래밍",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791163034735.jpg"
            },
            {
                "id": "B008",
                "title": "파이썬 코딩 도장",
                "author": "남재윤",
                "publisher": "길벗",
                "publicationDate": "2019-09-10",
                "pages": 1048,
                "genre": "IT/프로그래밍",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791140702428.jpg"
            },
            {
                "id": "B009",
                "title": "가상 면접 사례로 배우는 대규모 시스템 설계 기초",
                "author": "알렉스 쉬",
                "publisher": "인사이트",
                "publicationDate": "2021-09-13",
                "pages": 372,
                "genre": "IT/프로그래밍",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788966263158.jpg"
            },
            {
                "id": "B010",
                "title": "코어 자바스크립트",
                "author": "정재남",
                "publisher": "위키북스",
                "publicationDate": "2019-04-12",
                "pages": 360,
                "genre": "IT/프로그래밍",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791158391720.jpg"
            },
            {
                "id": "B011",
                "title": "코스모스",
                "author": "칼 세이건",
                "publisher": "사이언스북스",
                "publicationDate": "2006-12-20",
                "pages": 692,
                "genre": "과학/공학",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=O5VyDgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B012",
                "title": "이기적 유전자",
                "author": "리처드 도킨스",
                "publisher": "을유문화사",
                "publicationDate": "2018-10-20",
                "pages": 544,
                "genre": "과학/공학",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788932473901.jpg"
            },
            {
                "id": "B013",
                "title": "사피엔스",
                "author": "유발 하라리",
                "publisher": "김영사",
                "publicationDate": "2015-11-24",
                "pages": 636,
                "genre": "인문/사회",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=PTkFEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B014",
                "title": "호모 데우스",
                "author": "유발 하라리",
                "publisher": "김영사",
                "publicationDate": "2017-05-19",
                "pages": 604,
                "genre": "인문/사회",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788934950318.jpg"
            },
            {
                "id": "B015",
                "title": "숨결이 바람 될 때",
                "author": "폴 칼라니티",
                "publisher": "흐름출판",
                "publicationDate": "2016-08-19",
                "pages": 260,
                "genre": "소설/에세이",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=o5lBDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B016",
                "title": "물고기는 존재하지 않는다",
                "author": "룰루 밀러",
                "publisher": "곰출판",
                "publicationDate": "2021-12-17",
                "pages": 240,
                "genre": "과학/공학",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=X71ZEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B017",
                "title": "엔트로피",
                "author": "제레미 리프킨",
                "publisher": "청림출판",
                "publicationDate": "2007-01-15",
                "pages": 448,
                "genre": "과학/공학",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788986698824.jpg"
            },
            {
                "id": "B018",
                "title": "부분과 전체",
                "author": "베르너 하이젠베르크",
                "publisher": "서커스",
                "publicationDate": "2020-09-09",
                "pages": 440,
                "genre": "과학/공학",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791187295501.jpg"
            },
            {
                "id": "B019",
                "title": "침묵의 봄(개정판)",
                "author": "레이첼 카슨",
                "publisher": "에코리브르",
                "publicationDate": "2011-12-30",
                "pages": 424,
                "genre": "과학/공학",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=kMfIAQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
            },
            {
                "id": "B020",
                "title": "정재승의 과학콘서트",
                "author": "정재승",
                "publisher": "어크로스",
                "publicationDate": "2011-11-25",
                "pages": 372,
                "genre": "과학/공학",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=FjbyDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B021",
                "title": "정의란 무엇인가",
                "author": "마이클 샌델",
                "publisher": "와이즈베리",
                "publicationDate": "2014-11-20",
                "pages": 404,
                "genre": "인문/사회",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=Q_hzBQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B022",
                "title": "역사의 쓸모",
                "author": "최태성",
                "publisher": "다산북스",
                "publicationDate": "2019-04-26",
                "pages": 280,
                "genre": "인문/사회",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791193401200.jpg"
            },
            {
                "id": "B023",
                "title": "미움받을 용기",
                "author": "기시미 이치로, 고가 후미타케",
                "publisher": "인플루엔셜",
                "publicationDate": "2014-11-17",
                "pages": 336,
                "genre": "자기계발",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791168340770.jpg"
            },
            {
                "id": "B024",
                "title": "팩트풀니스",
                "author": "한스 로슬링",
                "publisher": "김영사",
                "publicationDate": "2019-03-08",
                "pages": 460,
                "genre": "인문/사회",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=_nUbEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B025",
                "title": "데일 카네기 인간관계론(개정증보판)",
                "author": "데일 카네기",
                "publisher": "현대지성",
                "publicationDate": "2019-10-07",
                "pages": 392,
                "genre": "자기계발",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=Vg-5DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B026",
                "title": "공정하다는 착각",
                "author": "마이클 샌델",
                "publisher": "와이즈베리",
                "publicationDate": "2020-12-01",
                "pages": 400,
                "genre": "인문/사회",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=gqoJEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B027",
                "title": "넛지(개정판)",
                "author": "리처드 H. 탈러, 캐스 R. 선스타인",
                "publisher": "리더스북",
                "publicationDate": "2018-11-19",
                "pages": 528,
                "genre": "경제/경영",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=N252EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B028",
                "title": "죽음의 수용소에서",
                "author": "빅터 프랭클",
                "publisher": "청아출판사",
                "publicationDate": "2005-08-20",
                "pages": 232,
                "genre": "소설/에세이",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936811532.jpg"
            },
            {
                "id": "B029",
                "title": "지적 대화를 위한 넓고 얕은 지식 1",
                "author": "채사장",
                "publisher": "웨일북",
                "publicationDate": "2014-12-24",
                "pages": 376,
                "genre": "인문/사회",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=zoo9EQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B030",
                "title": "피로사회",
                "author": "한병철",
                "publisher": "문학과지성사",
                "publicationDate": "2012-03-05",
                "pages": 120,
                "genre": "인문/사회",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=qiKrEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B031",
                "title": "부의 추월차선",
                "author": "엠제이 드마코",
                "publisher": "토트",
                "publicationDate": "2013-09-16",
                "pages": 416,
                "genre": "자기계발",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=5adaEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B032",
                "title": "돈의 속성",
                "author": "김승호",
                "publisher": "스노우폭스북스",
                "publicationDate": "2020-06-15",
                "pages": 368,
                "genre": "경제/경영",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://image.aladin.co.kr/product/24191/64/cover500/k562639753_1.jpg"
            },
            {
                "id": "B033",
                "title": "부자 아빠 가난한 아빠 1",
                "author": "로버트 기요사키",
                "publisher": "민음인",
                "publicationDate": "2018-11-26",
                "pages": 500,
                "genre": "경제/경영",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=L_hTDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B034",
                "title": "원씽(THE ONE THING)",
                "author": "게리 켈러, 제이 파파산",
                "publisher": "비즈니스북스",
                "publicationDate": "2013-08-26",
                "pages": 336,
                "genre": "자기계발",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=8WxRDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B035",
                "title": "아주 작은 습관의 힘",
                "author": "제임스 클리어",
                "publisher": "비즈니스북스",
                "publicationDate": "2019-02-26",
                "pages": 320,
                "genre": "자기계발",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=YOqIDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B036",
                "title": "그릿",
                "author": "앤절라 더크워스",
                "publisher": "비즈니스북스",
                "publicationDate": "2019-04-19",
                "pages": 416,
                "genre": "자기계발",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=T0GIDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B037",
                "title": "생각에 관한 생각",
                "author": "대니얼 카너먼",
                "publisher": "김영사",
                "publicationDate": "2012-03-20",
                "pages": 512,
                "genre": "경제/경영",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=NNW-DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B038",
                "title": "오리지널스",
                "author": "애덤 그랜트",
                "publisher": "한국경제신문",
                "publicationDate": "2016-02-24",
                "pages": 416,
                "genre": "경제/경영",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788947540674.jpg"
            },
            {
                "id": "B039",
                "title": "신경 끄기의 기술",
                "author": "마크 맨슨",
                "publisher": "갤리온",
                "publicationDate": "2017-10-27",
                "pages": 240,
                "genre": "자기계발",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=Xlw7DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B040",
                "title": "트렌드 코리아 2024",
                "author": "김난도 외",
                "publisher": "미래의창",
                "publicationDate": "2023-10-12",
                "pages": 444,
                "genre": "경제/경영",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=ae7bEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B041",
                "title": "세이노의 가르침",
                "author": "세이노",
                "publisher": "데이원",
                "publicationDate": "2023-03-02",
                "pages": 736,
                "genre": "자기계발",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=Qmm2EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B042",
                "title": "역행자",
                "author": "자청",
                "publisher": "웅진지식하우스",
                "publicationDate": "2022-06-03",
                "pages": 292,
                "genre": "자기계발",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=jIvAEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B043",
                "title": "데미안",
                "author": "헤르만 헤세",
                "publisher": "민음사",
                "publicationDate": "2000-06-05",
                "pages": 224,
                "genre": "소설/에세이",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://books.google.com/books/content?id=hHrFCQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            },
            {
                "id": "B044",
                "title": "어린왕자(한국어판)",
                "author": "앙투안 드 생텍쥐페리",
                "publisher": "더스토리",
                "publicationDate": "2015-09-01",
                "pages": 144,
                "genre": "소설/에세이",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791164455270.jpg"
            },
            {
                "id": "B045",
                "title": "달러구트 꿈 백화점",
                "author": "이미예",
                "publisher": "팩토리나인",
                "publicationDate": "2020-07-08",
                "pages": 300,
                "genre": "소설/에세이",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791165345693.jpg"
            },
            {
                "id": "B046",
                "title": "아몬드",
                "author": "손원평",
                "publisher": "창비",
                "publicationDate": "2017-03-31",
                "pages": 264,
                "genre": "소설/에세이",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788936456788.jpg"
            },
            {
                "id": "B047",
                "title": "불편한 편의점",
                "author": "김호연",
                "publisher": "나무옆의자",
                "publicationDate": "2021-04-20",
                "pages": 268,
                "genre": "소설/에세이",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791161571331.jpg"
            },
            {
                "id": "B048",
                "title": "나는 나로 살기로 했다",
                "author": "김수현",
                "publisher": "마음의숲",
                "publicationDate": "2016-11-28",
                "pages": 292,
                "genre": "소설/에세이",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791187119845.jpg"
            },
            {
                "id": "B049",
                "title": "죽고 싶지만 떡볶이는 먹고 싶어",
                "author": "백세희",
                "publisher": "다산책방",
                "publicationDate": "2018-11-21",
                "pages": 208,
                "genre": "소설/에세이",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791196394509.jpg"
            },
            {
                "id": "B050",
                "title": "언어의 온도",
                "author": "이기주",
                "publisher": "말글터",
                "publicationDate": "2016-08-19",
                "pages": 308,
                "genre": "소설/에세이",
                "available": true,
                "borrower": null,
                "reservedBy": [],
                "coverImg": "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791195522125.jpg"
            }
        ],

        users: [
            { id: 'user1', name: '김민준', password: '1234' },
            { id: 'user2', name: '이서연', password: '1234' }
        ],
        rooms: [
            { id: 'R01', name: '미팅룸 A (4인)', description: '간단한 회의 및 스터디', img: 'https://lh4.googleusercontent.com/proxy/9OqBJ-9Gje1db756Pkkdy7NZ5gUNR1hD4jHKuwd8Zt5SxvPx4pL5VTc91-F--T5YNMxQNm4v5OTIjgzyfPi89WnXeoy8TAqKxT4wUUK_HkVJVo_6', capacity: 1 },
            { id: 'R02', name: '미팅룸 B (8인)', description: '팀 프로젝트 및 발표 준비', img: 'https://i0.wp.com/916er.com/wp-content/uploads/KakaoTalk_20230208_171120220_04.png?resize=840%2C630&ssl=1', capacity: 1 },
            { id: 'R03', name: '세미나실 C', description: '강의 및 대규모 스터디', img: 'https://lh5.googleusercontent.com/proxy/KQMzG3BWvdddhqOg2cM5o-LIDr8UPHk-jE7_oIywQqxJXza4nuja98mfghODT-zH6_aZtpsSMhZWbBOxhy7xxu0MLA6S9g', capacity: 1 },
            { id: 'R04', name: '스터디룸 1', description: '개인 집중 학습 공간', img: 'https://img1.yna.co.kr/etc/inner/KR/2018/01/15/AKR20180115024900004_01_i_P4.jpg', capacity: 15 },
            { id: 'R05', name: '스터디룸 2', description: '개인 집중 학습 공간', img: 'https://s3.qplace.kr/portfolio/7009/b67764b39f692b4499746966adaafeb6_w800.webp', capacity: 15 },
            { id: 'R06', name: '스터디룸 3', description: '개인 집중 학습 공간', img: 'https://newsimg.sedaily.com/2020/07/24/1Z5FFQ3KSQ_1.jpg', capacity: 15 },
            { id: 'R07', name: '노트북존 A', description: '자유로운 노트북 사용 공간', img: 'https://mblogthumb-phinf.pstatic.net/MjAyMTA4MTdfOTAg/MDAxNjI5MTc5MDI5NjUw.XxW6TX8IomYKUOuRU-EGdUbOp_Xw4M8DwX-DOzshOqIg.qe5Y7BxV60V-pohkRVaqpOU6-S_NbShngvKm5xWsnvMg.JPEG.alltoprosa/1629178871822.jpg?type=w800', capacity: 10 },
            { id: 'R08', name: '노트북존 B', description: '자유로운 노트북 사용 공간', img: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FOLmYH%2Fbtrs66M8W9j%2FAAAAAAAAAAAAAAAAAAAAACjQ5uCS97f3lvfZCgSABoMeHbdbi82N7x0NCZaGxKq9%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1761922799%26allow_ip%3D%26allow_referer%3D%26signature%3DXObvdgNBObFSH4xpFMD5C87LvOY%253D', capacity: 10 },
            { id: 'R09', name: '미디어 감상실', description: 'DVD, OTT 시청 가능', img: 'https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjNfNjYg/MDAxNjIxNzU3ODI0Njg4.8cXnhMc-HU1qbpim7KkB6Sk2BFDt0ER6-mmhadpzxLcg.0OKcqHMC9oTfdwlcdDNb6PqsoXagEZcbCzJxsPTSNMsg.JPEG.kdia2353/20210512_145752.jpg?type=w800', capacity: 5 },
            { id: 'R10', name: '휴게실', description: '자유로운 휴식 및 대화', img: 'https://www.chosun.com/resizer/v2/4T3DMFIERFB64EPIQZTYYUDCWQ.png?auth=d806934ce5fae033168cbaaeeb9af36b227e447422aa2d72b25d1eb09e364163&width=525&height=350&smart=true', capacity: 20 }
        ],
        notices: [
            { id: 'N001', type: 'pinned', title: '공지를 확인해주세요.', content: '공지에는 중요한 내용들이 있어요.\n공지는 어디서든 정독하시는 것을 추천드려요.', author: '관리자', date: '2023-10-26' },
            { id: 'N002', type: 'danger', title: '저장되지 않아요.', content: '포트폴리오를 위해 존재하는 사이트로, 백엔드가 존재하지 않아요.\n기능들은 구현되어 있으나 실효성이 없으며, 언제 데이터가 초기화될지 모르는 점을 명심해주세요.', author: '관리자', date: '2025-09-27' },
            { id: 'N003', type: 'warning', title: '이선좌.', content: '이선좌: 이미 선택된 좌석입니다.\n\n시설 예약 시, 다른 사람이 먼저 예약한 시간은 선택할 수 없습니다. 부디 너그러운 마음으로 다른 시간을 선택해주시기 바랍니다.', author: '사서', date: '2025-09-29' },
            { id: 'N004', type: 'normal', title: '창밖으로 던져도 되는 것들', content: '천원권 이상의 지폐(묶음도 가능)\n* 동전은 안전사고 위험이 있으니 사양합니다.\n\n자기앞 수표를 비롯한 유가증권\n\n각종 귀금속(짝퉁은 안됩니다)', author: '사서', date: '2025-09-28' },
            { id: 'N005', type: 'warning', title: '정확한 정보가 아닐 수 있습니다.', content: '장서 목록을 포함한 내부 콘텐츠들은 검수가 완벽히 되어있지 않습니다.\n실제 책과 다른 부분이 있거나, 잘못된 정보가 있을 수 있습니다.', author: '개발자', date: '2025-09-29' },
            { id: 'N006', type: 'normal', title: '개발자 연락처', content: '디스코드 : @uzu._.lee\n인스타그램 : @rnjs_yxxan', author: '개발자', date: '2025-09-28' },
        ],
        roomReservations: [],
        recommendations: []
    };

    let DB;

    const cleanupExpiredReservations = () => {
        if (!DB.roomReservations) DB.roomReservations = [];
        const now = new Date().getTime();
        DB.roomReservations = DB.roomReservations.filter(r => new Date(r.endTime).getTime() > now);
    };

    const load = () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            DB = data ? JSON.parse(data) : JSON.parse(JSON.stringify(initialDB));
        } catch (error) {
            DB = JSON.parse(JSON.stringify(initialDB));
        }
        cleanupExpiredReservations();
        save();
    };

    const save = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DB));
    };

    const init = () => { load(); };

    const getNotices = () => {
        const notices = DB.notices.slice();
        return notices.sort((a, b) => {
            if (a.type === 'pinned' && b.type !== 'pinned') return -1;
            if (a.type !== 'pinned' && b.type === 'pinned') return 1;
            return new Date(b.date) - new Date(a.date);
        });
    };
    const getNoticeById = (id) => DB.notices.find(n => n.id === id);
    const getLatestNotice = () => {
        if (!DB.notices || DB.notices.length === 0) return null;
        const pinnedNotices = DB.notices.filter(n => n.type === 'pinned');
        if (pinnedNotices.length > 0) {
            return pinnedNotices.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        }
        return DB.notices.slice().sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    };

    const canLoan = (userId) => getBooksByBorrower(userId).length < MAX_LOAN_COUNT;
    
    const getReservationsAtTime = (roomId, startTime, endTime) => {
        const reservationsForRoom = DB.roomReservations.filter(r => r.roomId === roomId);
        const newStart = new Date(startTime).getTime();
        const newEnd = new Date(endTime).getTime();

        return reservationsForRoom.filter(r => {
            const existingStart = new Date(r.startTime).getTime();
            const existingEnd = new Date(r.endTime).getTime();
            return newStart < existingEnd && newEnd > existingStart;
        });
    };

    const isTimeslotAvailable = (roomId, startTime, endTime) => {
        const room = getRoomById(roomId);
        if (!room) return false;
        const overlappingReservations = getReservationsAtTime(roomId, startTime, endTime);
        return overlappingReservations.length < room.capacity;
    };

    const authenticateUser = (id, password) => DB.users.find(u => u.id === id && u.password === password) || null;
    const getUserById = (id) => DB.users.find(u => u.id === id);
    const addUser = (id, name, password) => { if (DB.users.some(u => u.id === id)) return null; const newUser = { id, name, password }; DB.users.push(newUser); save(); return newUser; };
    const updateBook = (id, updates) => { const book = getBookById(id); if (book) { Object.assign(book, updates); save(); } };
    const addRoomReservation = (roomId, userId, startTime, endTime) => { if (!isTimeslotAvailable(roomId, startTime, endTime)) return null; const newReservation = { id: `RES${Date.now()}`, type: 'room', roomId, userId, startTime, endTime }; DB.roomReservations.push(newReservation); save(); return newReservation; };
    const removeRoomReservation = (id) => { DB.roomReservations = DB.roomReservations.filter(r => r.id !== id); save(); };
    const addBookReservation = (bookId, userId) => { const book = getBookById(bookId); if (!book || book.available || book.reservedBy.includes(userId)) return null; book.reservedBy.push(userId); save(); return book; };
    const removeBookReservation = (bookId, userId) => { const book = getBookById(bookId); if (!book) return; book.reservedBy = book.reservedBy.filter(uid => uid !== userId); save(); };
    const getBooks = () => DB.books;
    const getBookById = (id) => DB.books.find(b => b.id === id);
    const getBooksByBorrower = (userId) => DB.books.filter(b => b.borrower === userId);
    const getBooksByReserver = (userId) => DB.books.filter(b => b.reservedBy.includes(userId));
    const getRecommendedBooks = () => {
        const today = new Date();
        const weekSeed = Math.floor(today.getTime() / (1000 * 60 * 60 * 24 * 7));
        
        let seed = weekSeed;
        const random = () => {
            let x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        const shuffled = DB.books.slice().sort(() => random() - 0.5);
        return shuffled.slice(0, 5);
    };
    const getRooms = () => DB.rooms;
    const getRoomById = (id) => DB.rooms.find(r => r.id === id);
    const getRoomReservationsByUser = (userId) => DB.roomReservations.filter(r => r.userId === userId);
    const getRoomReservationsForDate = (roomId, date) => {
        return DB.roomReservations.filter(r => {
            if (r.roomId !== roomId) return false;
            const reservationDate = new Date(r.startTime);
            const year = reservationDate.getFullYear();
            const month = String(reservationDate.getMonth() + 1).padStart(2, '0');
            const day = String(reservationDate.getDate()).padStart(2, '0');
            const localDateString = `${year}-${month}-${day}`;
            return localDateString === date;
        });
    };
    const getBookIdOfTheDay = () => {
        const today = new Date();
        const daySeed = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
        const randomIndex = daySeed % DB.books.length;
        return DB.books[randomIndex].id;
    };

    const getGenres = () => {
        const genres = [...new Set(DB.books.map(book => book.genre))];
        return ['전체', ...genres.sort()];
    };

    return { init, authenticateUser, addUser, updateBook, getBooks, getBookById, getBooksByBorrower, getBooksByReserver, getRecommendedBooks, getRooms, getRoomById, getRoomReservationsByUser, addRoomReservation, removeRoomReservation, addBookReservation, removeBookReservation, getRoomReservationsForDate, isTimeslotAvailable, getBookIdOfTheDay, canLoan, getUserById, MAX_LOAN_COUNT, getNotices, getLatestNotice, getNoticeById, getReservationsAtTime, getGenres };
})();
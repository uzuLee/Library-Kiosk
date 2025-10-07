const UI = (function() {
    const $ = (selector) => document.querySelector(selector);
    const elements = {};

    const screenTemplates = {
        start: `
            <div class="content-center screen-content">
                <h2 class="page-title">Library Kiosk</h2>
                <p class="page-subtitle">도서관 서비스를 쉽고 빠르게 이용하세요.</p>
                <div class="button-group">
                    <button data-action="navigate" data-screen="login" class="btn primary">로그인</button>
                    <button data-action="navigate" data-screen="signup" class="btn secondary">회원가입</button>
                    <button data-action="guest-mode" class="btn secondary"><span>👀</span>비회원으로 둘러보기</button>
                </div>
            </div>`,
        login: `
            <div class="content-center screen-content">
                <h2 class="page-title">로그인</h2>
                <div class="input-group">
                    <input id="login-id" class="input" type="text" placeholder="아이디">
                    <input id="login-password" class="input" type="password" placeholder="비밀번호">
                </div>
                <div class="button-group">
                    <button data-action="login" class="btn primary">로그인</button>
                    <button data-action="navigate" data-screen="start" class="btn secondary">뒤로</button>
                </div>
            </div>`,
        signup: `
            <div class="content-center screen-content">
                <h2 class="page-title">회원가입</h2>
                <div class="input-group">
                    <input id="signup-id" class="input" type="text" placeholder="사용할 아이디">
                    <input id="signup-name" class="input" type="text" placeholder="이름">
                    <input id="signup-password" class="input" type="password" placeholder="비밀번호">
                    <input id="signup-password-confirm" class="input" type="password" placeholder="비밀번호 확인">
                </div>
                <div class="button-group">
                    <button data-action="signup" class="btn primary">가입하기</button>
                    <button data-action="navigate" data-screen="start" class="btn secondary">뒤로</button>
                </div>
            </div>`,
        main: (data) => {
            const user = data.currentUser;
            const latestNotice = data.latestNotice;
            const bookOfTheDay = data.bookOfTheDay;
            return `
            <div class="screen-content">
                ${latestNotice ? `
                <div class="notice-panel ${latestNotice.type}" data-action="navigate" data-screen="notices">
                    <h3>${latestNotice.type === 'pinned' ? '📌' : '📢'} ${latestNotice.title}</h3>
                </div>` : ''}
                ${bookOfTheDay ? `
                <div class="book-of-the-day-panel" data-action="show-detail" data-book-id="${bookOfTheDay.id}">
                    <img src="${bookOfTheDay.coverImg}" alt="${bookOfTheDay.title}" class="cover">
                    <h3>오늘의 추천 도서</h3>
                    <p>${bookOfTheDay.title}</p>
                </div>` : ''}
                <div class="menu-grid">
                    <div class="menu-item" data-action="navigate" data-screen="search"><div class="icon">🔍</div><h3>도서 검색</h3></div>
                    ${!user ? '' : `<div class="menu-item" data-action="navigate" data-screen="my-info"><div class="icon">👤</div><h3>내 정보</h3></div>`}
                    <div class="menu-item" data-action="navigate" data-screen="reservation"><div class="icon">📅</div><h3>시설 예약</h3></div>
                    <div class="menu-item" data-action="navigate" data-screen="recommendations"><div class="icon">✨</div><h3>추천 도서 목록</h3></div>
                </div>
            </div>`;
        },
        search: (data) => {
            const genres = Api.getGenres();
            const genreButtons = genres.map(g => 
                `<button class="btn ${g === '전체' ? 'primary' : 'secondary'} genre-btn" data-action="filter-genre" data-genre="${g}">${g}</button>`
            ).join('');
            return `
            <div class="screen-content">
                <div class="search-bar"><input id="search-input" type="text" class="input" placeholder="제목, 저자로 검색"></div>
                <div id="genre-filters" class="genre-filters">
                    ${genreButtons}
                </div>
                <div class="list" id="search-results">${renderBookItems(data.allBooks, false, data.currentUser)}</div>
            </div>`
        },
        detail: (data) => {
            const book = data.payload;
            const user = data.currentUser;
            let actionButtons = '';

            if (user) {
                const isBorrowedByCurrentUser = book.borrower === user.id;
                if (isBorrowedByCurrentUser) {
                    actionButtons += `<button data-action="return" data-book-id="${book.id}" class="btn danger">반납하기</button>`;
                } else if (book.available) {
                    if (Api.canLoan(user.id)) {
                        actionButtons += `<button data-action="loan" data-book-id="${book.id}" class="btn primary">대출하기</button>`;
                    } else {
                        actionButtons += `<div class="empty-message">대출은 최대 ${Api.MAX_LOAN_COUNT}권까지 가능합니다.</div>`;
                    }
                } else {
                    const isReservedByUser = book.reservedBy.includes(user.id);
                    if (isReservedByUser) {
                        actionButtons += `<button data-action="cancel-book-reservation" data-book-id="${book.id}" class="btn danger">예약 취소</button>`;
                    } else {
                        actionButtons += `<button data-action="reserve-book" data-book-id="${book.id}" class="btn secondary">예약하기</button>`;
                    }
                }
            } else {
                actionButtons += `<button data-action="navigate" data-screen="login" class="btn primary">로그인 후 이용</button>`;
            }

            return `
            <div class="screen-content">
                <div style="text-align: center; margin-bottom: 24px;"><img src="${book.coverImg}" alt="${book.title}" class="cover-large"></div>
                <h2 class="page-title">${book.title}</h2>
                <p class="page-subtitle">${book.author} / ${book.publisher} / ${book.pages}p</p>
                <div class="status ${book.available ? 'available' : 'borrowed'}">${book.available ? '대출 가능' : `대출 중 (예약 ${book.reservedBy.length}명)`}</div>
                <div class="button-group">${actionButtons}</div>
            </div>`;
        },
        'my-info': (data) => `
            <div class="screen-content">
                <h2 class="page-title">${data.currentUser.name}님의 정보</h2>
                <div class="content-title">대출 현황</div>
                <div class="list">${renderBookItems(data.borrowedBooks, true, data.currentUser)}</div>
                <div class="content-title">도서 예약 현황</div>
                <div class="list">${renderBookReservationItems(data.reservedBooks, data.currentUser.id)}</div>
                <div class="content-title">시설 예약 현황</div>
                <div class="list">${renderRoomReservationItems(data.roomReservations)}</div>
            </div>`,
        reservation: (data) => `
            <div class="screen-content">
                <h2 class="page-title">시설 예약</h2>
                <p class="page-subtitle">예약을 원하는 시설을 선택하세요.</p>
                <div class="list">${renderRoomItems(data.rooms)}</div>
            </div>`,
        'reservation-detail': (data) => {
            const room = data.payload;
            const user = data.currentUser;
            let actionButton;

            if (user) {
                actionButton = `<button data-action="book-room" data-room-id="${room.id}" class="btn primary">예약하기</button>`;
            } else {
                actionButton = `<button data-action="navigate" data-screen="login" class="btn primary">로그인 후 이용</button>`;
            }

            return `
            <div class="screen-content">
                <h2 class="page-title">${room.name}</h2>
                <p class="page-subtitle">${room.description || (room.capacity ? `${room.capacity}인실` : '공용 공간')}</p>
                <div class="input-group">
                    <div class="fake-input" data-action="open-datepicker" data-room-id="${room.id}" id="datepicker-display">날짜 선택</div>
                    <div class="fake-input" data-action="open-timepicker" data-type="start" id="timepicker-start-display">시작 시간</div>
                    <div class="fake-input" data-action="open-timepicker" data-type="end" id="timepicker-end-display">종료 시간</div>
                </div>
                <div class="button-group">${actionButton}</div>
                <div class="content-title" style="margin-top: 24px;">예약 현황</div>
                <div id="reservation-slots" class="list">
                    <p class="empty-message">날짜를 선택하시면 해당 날짜의 예약 현황을 볼 수 있습니다.</p>
                </div>
            </div>`;
        },
        recommendations: (data) => `
            <div class="screen-content">
                <h2 class="page-title">추천 도서</h2>
                <p class="page-subtitle">사서가 엄선한 추천 도서 목록입니다.</p>
                <div class="list">${renderBookItems(data.recommendedBooks, false, data.currentUser)}</div>
            </div>`,
        notices: (data) => `
            <div class="screen-content">
                <h2 class="page-title">공지사항</h2>
                <div class="list">${renderNoticeItems(data.notices)}</div>
            </div>`,
        'notice-detail': (data) => {
            const notice = data.payload;
            const typeMap = { pinned: '고정', normal: '일반', warning: '주의', danger: '경고' };
            return `
            <div class="screen-content">
                <h2 class="page-title">${notice.title}</h2>
                <p class="page-subtitle">[${typeMap[notice.type]}] ${notice.date} / ${notice.author}</p>
                <div class="content-title"></div>
                <p style="white-space: pre-wrap;">${notice.content}</p>
            </div>`;
        },
    };

    const renderBookItems = (books, isMyInfo = false, user = null) => {
        if (!books || books.length === 0) {
            if (isMyInfo) return '<p class="empty-message">대출/예약한 도서가 없습니다.</p>';
            return '<p class="empty-message">해당하는 도서가 없습니다.</p>';
        }

        if (isMyInfo) {
            return books.map(book => renderSingleBookItem(book, true, user)).join('');
        }

        const booksByGenre = books.reduce((acc, book) => {
            const genre = book.genre || '기타';
            if (!acc[genre]) {
                acc[genre] = [];
            }
            acc[genre].push(book);
            return acc;
        }, {});

        const genreOrder = [...Api.getGenres().filter(g => g !== '전체'), '기타'];
        let html = '';

        for (const genre of genreOrder) {
            if (booksByGenre[genre]) {
                html += `<div class="content-title">${genre}</div>`;
                html += '<div class="list">';
                html += booksByGenre[genre].map(book => renderSingleBookItem(book, false, user)).join('');
                html += '</div>';
            }
        }

        return html;
    };

    const renderSingleBookItem = (book, isMyInfo, user) => {
        let statusOrButton;
        if (isMyInfo) {
            statusOrButton = `<button data-action="return" data-book-id="${book.id}" class="btn danger">반납</button>`;
        } else {
            const isBorrowedByCurrentUser = user && book.borrower === user.id;
            statusOrButton = `<div class="status ${book.available ? 'available' : 'borrowed'}">${isBorrowedByCurrentUser ? '대출중' : (book.available ? '대출 가능' : '대출 중')}</div>`;
        }
        return `
        <div class="list-item" data-action="show-detail" data-book-id="${book.id}">
            <img src="${book.coverImg}" alt="${book.title}" class="cover-small">
            <div class="list-item-meta">
                <h4>${book.title}</h4>
                <p>${book.author}</p>
            </div>
            ${statusOrButton}
        </div>`;
    };

    const renderRoomItems = (rooms) => {
        if (!rooms || rooms.length === 0) return '<p class="empty-message">예약 가능한 시설이 없습니다.</p>';
        return rooms.map(room => {
            const reservations = Api.getReservationsAtTime(room.id, new Date(), new Date(Date.now() + 1));
            const reservationCount = reservations.length;
            let status;

            if (reservationCount > 0 && reservationCount < room.capacity) {
                status = `<div class="status using">${reservationCount}/${room.capacity}명 이용중</div>`;
            } else if (reservationCount >= room.capacity) {
                status = `<div class="status borrowed">예약 마감</div>`;
            } else {
                status = `<div class="status available">이용 가능</div>`;
            }

            return `
            <div class="list-item room-item" data-action="show-room-detail" data-room-id="${room.id}">
                <img src="${room.img}" alt="${room.name}" class="room-image">
                <div class="list-item-meta">
                    <h4>${room.name}</h4>
                    <p>${room.description}</p>
                </div>
                ${status}
            </div>`;
        }).join('');
    };

    const renderNoticeItems = (notices) => {
        if (!notices || notices.length === 0) return '<p class="empty-message">공지사항이 없습니다.</p>';
        return notices.map(notice => `
            <div class="list-item notice-item ${notice.type}" data-action="show-notice-detail" data-notice-id="${notice.id}">
                <div class="list-item-meta">
                    <h4>${notice.type === 'pinned' ? '📌 ' : ''}${notice.title}</h4>
                    <p class="notice-content-preview">${notice.content}</p>
                </div>
            </div>`).join('');
    };

    const renderBookReservationItems = (books, userId) => {
        if (!books || books.length === 0) return '<p class="empty-message">예약한 도서가 없습니다.</p>';
        return books.map(book => `
            <div class="list-item">
                <img src="${book.coverImg}" alt="${book.title}" class="cover-small">
                <div class="list-item-meta">
                    <h4>${book.title}</h4>
                    <p>${book.author} / ${book.reservedBy.indexOf(userId) + 1}번째 순서</p>
                </div>
                <button data-action="cancel-book-reservation" data-book-id="${book.id}" class="btn danger">예약 취소</button>
            </div>`).join('');
    };

    const renderRoomReservationItems = (reservations) => {
        if (!reservations || reservations.length === 0) return '<p class="empty-message">예약 내역이 없습니다.</p>';
        return reservations.sort((a,b) => new Date(b.startTime) - new Date(a.startTime)).map(res => {
            const room = Api.getRoomById(res.roomId);
            if (!room) return '';
            
            const now = new Date();
            const startTime = new Date(res.startTime);
            const endTime = new Date(res.endTime);

            const startTimeString = startTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
            const endTimeString = endTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
            
            let buttonText, buttonClass;

            if (endTime < now) {
                buttonText = '내역 삭제';
                buttonClass = 'secondary';
            } else if (startTime <= now && endTime >= now) {
                buttonText = '이용 종료';
                buttonClass = 'primary';
            } else {
                buttonText = '취소';
                buttonClass = 'danger';
            }

            return `
            <div class="list-item">
                <div class="list-item-meta">
                    <h4>${room.name}</h4>
                    <p>${new Date(res.startTime).toLocaleDateString('ko-KR')} / ${startTimeString} ~ ${endTimeString}</p>
                </div>
                <button data-action="cancel-room-reservation" data-reservation-id="${res.id}" class="btn ${buttonClass}">${buttonText}</button>
            </div>`;
        }).join('');
    };

    const renderTimeSlots = (reservations) => {
        if (!reservations || reservations.length === 0) return '<p class="empty-message">해당 날짜에 예약이 없습니다.</p>';
        
        return reservations.sort((a,b) => new Date(a.startTime) - new Date(b.startTime)).map(res => {
            const user = Api.getUserById(res.userId);
            const startTime = new Date(res.startTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
            const endTime = new Date(res.endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
            return `
            <div class="list-item">
                <div class="list-item-meta">
                    <h4>${user.name}님</h4>
                    <p>${startTime} ~ ${endTime}</p>
                </div>
            </div>`;
        }).join('');
    };

    const render = (screen, data) => {
        const isAuthScreen = screen === 'start' || screen === 'login' || screen === 'signup';
        elements.header.classList.toggle('hidden', isAuthScreen);
        elements.footer.classList.toggle('hidden', isAuthScreen);

        const template = screenTemplates[screen];
        if (template) {
            elements.main.innerHTML = typeof template === 'function' ? template(data) : template;
        } else {
            elements.main.innerHTML = '<p>오류: 화면을 찾을 수 없습니다.</p>';
        }
        const user = data.currentUser;
        elements.userInfo.textContent = user ? `${user.name}님` : (isAuthScreen ? '' : '비회원');
    };

    const showModal = (message, buttons = [{ text: '확인' }]) => {
        elements.modalMessage.innerHTML = message.replace(/\n/g, '<br>');
        elements.modalButtons.innerHTML = '';
        buttons.forEach(btnInfo => {
            const button = document.createElement('button');
            button.textContent = btnInfo.text;
            button.className = `btn ${btnInfo.type || 'secondary'}`;
            button.onclick = () => {
                hideModal();
                if (btnInfo.action) btnInfo.action();
            };
            elements.modalButtons.appendChild(button);
        });
        elements.modalContainer.classList.add('active');
    };

    const hideModal = () => elements.modalContainer.classList.remove('active');

    const showPickerModal = (title, contentGenerator, footerGenerator) => {
        elements.pickerHeader.style.display = title ? 'flex' : 'none';
        if (title) {
            elements.pickerTitleBtn.textContent = title;
        }
        contentGenerator(elements.pickerContent);
        elements.pickerFooter.innerHTML = '';
        if (footerGenerator) {
            footerGenerator(elements.pickerFooter);
        }
        elements.pickerModal.classList.add('active');
    };

    const hidePickerModal = () => elements.pickerModal.classList.remove('active');

    const init = () => {
        elements.header = $('.app-header');
        elements.footer = $('.app-footer');
        elements.main = $('#app-main');
        elements.userInfo = $('#user-info');
        elements.modalContainer = $('#modal-container');
        elements.modalDialog = $('#modal-container .modal-dialog');
        elements.modalMessage = $('#modal-message');
        elements.modalButtons = $('#modal-buttons');
        elements.pickerModal = $('#picker-modal-container');
        elements.pickerDialog = $('#picker-modal-container .picker-dialog');
        elements.pickerHeader = $('#picker-modal-container .picker-header');
        elements.pickerTitleBtn = $('#picker-title-btn');
        elements.pickerContent = $('#picker-content');
        elements.pickerPrev = $('#picker-prev');
        elements.pickerNext = $('#picker-next');
        elements.pickerFooter = $('#picker-footer');
    };

    return { init, render, showModal, hideModal, showPickerModal, hidePickerModal, elements, renderBookItems, renderRoomItems, renderTimeSlots };
})();
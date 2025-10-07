const Events = (function(Api, State, UI) {
    let appInstance;
    let tempReservation = {};
    let pickerDate = new Date();
    let currentPicker = null;

    const handleLogin = () => {
        const id = document.querySelector('#login-id').value;
        const password = document.querySelector('#login-password').value;
        const user = Api.authenticateUser(id, password);
        if (user) {
            State.setCurrentUser(user);
            const lastRoute = State.getState().history.slice(-2)[0];
            appInstance.goTo(lastRoute || { screen: 'main' });
        } else {
            UI.showModal('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
    };

    const handleSignup = () => {
        const id = document.querySelector('#signup-id').value;
        const name = document.querySelector('#signup-name').value;
        const password = document.querySelector('#signup-password').value;
        const passwordConfirm = document.querySelector('#signup-password-confirm').value;

        if (!id || !name || !password) return UI.showModal('모든 항목을 입력해주세요.');
        if (password !== passwordConfirm) return UI.showModal('비밀번호가 일치하지 않습니다.');

        const newUser = Api.addUser(id, name, password);
        if (newUser) {
            UI.showModal('회원가입이 완료되었습니다. 로그인해주세요.', [
                { text: '확인', type: 'primary', action: () => appInstance.goTo({ screen: 'login' }) }
            ]);
        } else {
            UI.showModal('이미 존재하는 아이디입니다.');
        }
    };

    const handleLoan = (bookId) => {
        const user = State.getState().currentUser;
        if (!user) return;
        if (!Api.canLoan(user.id)) {
            return UI.showModal(`대출은 최대 ${Api.MAX_LOAN_COUNT}권까지 가능합니다.`);
        }
        const book = Api.getBookById(bookId);
        UI.showModal(`'${book.title}'을(를) 대출하시겠습니까?`, [
            { text: '취소' },
            { text: '확인', type: 'primary', action: () => { Api.updateBook(bookId, { available: false, borrower: user.id }); appInstance.refresh(); } },
        ]);
    };

    const handleReturn = (bookId, e) => {
        e.stopPropagation();
        const book = Api.getBookById(bookId);
        const hasReservation = book.reservedBy.length > 0;
        UI.showModal(`'${book.title}'을(를) 반납하시겠습니까?`, [
            { text: '취소' },
            { text: '확인', type: 'danger', action: () => {
                Api.updateBook(bookId, { available: true, borrower: null });
                appInstance.refresh();
                if(hasReservation) UI.showModal(`반납된 도서에 예약이 있습니다. 다음 예약자에게 알림이 전송됩니다.`);
            } },
        ]);
    };

    const handleBookReservation = (bookId) => {
        const user = State.getState().currentUser;
        if (!user) return;
        const result = Api.addBookReservation(bookId, user.id);
        if (result) UI.showModal('도서 예약을 완료했습니다.', [{ text: '확인', action: () => appInstance.refresh() }]);
        else UI.showModal('이미 예약했거나 예약할 수 없는 도서입니다.');
    };

    const handleCancelBookReservation = (bookId) => {
        const user = State.getState().currentUser;
        if (!user) return;
        UI.showModal('이 예약을 취소하시겠습니까?', [
            { text: '취소' },
            { text: '확인', type: 'danger', action: () => { Api.removeBookReservation(bookId, user.id); appInstance.refresh(); } },
        ]);
    };

    const handleRoomReservation = () => {
        const { roomId, date, start, end } = tempReservation;
        if (!roomId || !date || !start || !end) return UI.showModal('날짜와 시간을 모두 선택해주세요.');

        const startTime = new Date(`${date}T${start}:00`);
        const endTime = new Date(`${date}T${end}:00`);

        if (startTime >= endTime) return UI.showModal('종료 시간은 시작 시간보다 이후여야 합니다.');

        const room = Api.getRoomById(roomId);
        if (!room) return UI.showModal('존재하지 않는 시설입니다.');

        if (Api.isTimeslotAvailable(roomId, startTime, endTime)) {
            UI.showModal(`'${room.name}'을(를) ${date} ${start}~${end}에 예약하시겠습니까?`, [
                { text: '취소' },
                { text: '확인', type: 'primary', action: () => {
                    Api.addRoomReservation(roomId, State.getState().currentUser.id, startTime, endTime);
                    appInstance.goTo({ screen: 'my-info' });
                } },
            ]);
        } else {
            UI.showModal(`선택하신 시간은 예약이 가득 찼습니다. (정원: ${room.capacity}명)`);
        }
    };

    const handleCancelRoomReservation = (reservationId) => {
        UI.showModal('이 예약을 취소하시겠습니까?', [
            { text: '취소' },
            { text: '확인', type: 'danger', action: () => { Api.removeRoomReservation(reservationId); appInstance.refresh(); } },
        ]);
    };

    const openDatePicker = (roomId) => {
        currentPicker = 'date';
        tempReservation = { roomId };
        pickerDate = new Date();
        updateCalendar();
    };

    const updateCalendar = () => {
        const year = pickerDate.getFullYear();
        const month = pickerDate.getMonth();
        UI.showPickerModal(`${year}년 ${month + 1}월`, 
            (contentEl) => {
                const grid = document.createElement('div');
                grid.className = 'calendar-grid';
                const days = ['일', '월', '화', '수', '목', '금', '토'];
                grid.innerHTML = days.map(d => `<div class="day-name">${d}</div>`).join('');

                const firstDay = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const today = new Date();
                today.setHours(0,0,0,0);

                for (let i = 0; i < firstDay; i++) grid.insertAdjacentHTML('beforeend', '<div class="day empty"></div>');
                for (let i = 1; i <= daysInMonth; i++) {
                    const dayEl = document.createElement('div');
                    const thisDate = new Date(year, month, i);
                    dayEl.className = 'day';
                    dayEl.textContent = i;

                    if (thisDate < today) {
                        dayEl.classList.add('disabled');
                    } else {
                        dayEl.onclick = () => {
                            const selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                            tempReservation.date = selectedDate;
                            document.querySelector('#datepicker-display').textContent = tempReservation.date;
                            
                            const slotsEl = document.querySelector('#reservation-slots');
                            if (slotsEl) {
                                const reservations = Api.getRoomReservationsForDate(tempReservation.roomId, selectedDate);
                                slotsEl.innerHTML = UI.renderTimeSlots(reservations);
                            }

                            UI.hidePickerModal();
                        };
                    }
                    grid.appendChild(dayEl);
                }
                contentEl.innerHTML = '';
                contentEl.appendChild(grid);
            },
            (footerEl) => {
                const button = document.createElement('button');
                button.textContent = '취소';
                button.className = 'btn secondary';
                button.onclick = () => UI.hidePickerModal();
                footerEl.appendChild(button);
            }
        );
        UI.elements.pickerTitleBtn.onclick = () => openYearMonthPicker();
        UI.elements.pickerPrev.onclick = () => { if(currentPicker === 'date') { pickerDate.setMonth(pickerDate.getMonth() - 1); updateCalendar(); } };
        UI.elements.pickerNext.onclick = () => { if(currentPicker === 'date') { pickerDate.setMonth(pickerDate.getMonth() + 1); updateCalendar(); } };
    };

    const openYearMonthPicker = () => {
        currentPicker = 'ym';
        let year = pickerDate.getFullYear();
        let month = pickerDate.getMonth();
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        UI.showPickerModal('년/월 선택', 
            (contentEl) => {
                contentEl.innerHTML = `
                    <div class="dial-container">
                        <div class="dial-group">
                            <button id="year-up">▲</button>
                            <div id="year-value" class="dial-value">${year}</div>
                            <button id="year-down">▼</button>
                        </div>
                        <div class="dial-group">
                            <button id="month-up">▲</button>
                            <div id="month-value" class="dial-value">${month + 1}</div>
                            <button id="month-down">▼</button>
                        </div>
                    </div>
                `;
            },
            (footerEl) => {
                const confirmBtn = document.createElement('button');
                confirmBtn.textContent = '확인';
                confirmBtn.className = 'btn primary';
                confirmBtn.onclick = () => { pickerDate.setFullYear(year, month, 1); UI.hidePickerModal(); updateCalendar(); };
                footerEl.appendChild(confirmBtn);

                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = '취소';
                cancelBtn.className = 'btn secondary';
                cancelBtn.onclick = () => { UI.hidePickerModal(); updateCalendar(); };
                footerEl.insertBefore(cancelBtn, confirmBtn);
            }
        );
        document.querySelector('#year-up').onclick = () => { year++; document.querySelector('#year-value').textContent = year; };
        document.querySelector('#year-down').onclick = () => { if (year > currentYear) { year--; document.querySelector('#year-value').textContent = year; } };
        document.querySelector('#month-up').onclick = () => { month = (month + 1) % 12; document.querySelector('#month-value').textContent = month + 1; };
        document.querySelector('#month-down').onclick = () => { if (year > currentYear || month > currentMonth) { month = (month - 1 + 12) % 12; document.querySelector('#month-value').textContent = month + 1; } };
    };

    const openTimePicker = (type) => {
        currentPicker = 'time';
        if (!tempReservation.date) return UI.showModal('날짜를 먼저 선택해주세요.');
        if (type === 'end' && !tempReservation.start) return UI.showModal('시작 시간을 먼저 선택해주세요.');

        let hour, minute;

        const isTimeValid = (h, m) => {
            const testTime = new Date(`${tempReservation.date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
            const now = new Date();

            const todayYear = now.getFullYear();
            const todayMonth = String(now.getMonth() + 1).padStart(2, '0');
            const todayDate = String(now.getDate()).padStart(2, '0');
            const isToday = tempReservation.date === `${todayYear}-${todayMonth}-${todayDate}`;

            if (isToday && testTime < now) {
                return false;
            }

            if (type === 'end') {
                const startTime = new Date(`${tempReservation.date}T${tempReservation.start}:00`);
                if (testTime <= startTime) return false;
            }

            return Api.isTimeslotAvailable(tempReservation.roomId, testTime, new Date(testTime.getTime() + 10 * 60000));
        };

        const setInitialTime = () => {
            const now = new Date();
            let h = now.getHours();
            let m = now.getMinutes();

            if (type === 'start') {
                m = Math.ceil(m / 10) * 10;
                if (m >= 60) { h++; m = 0; }
                if (h >= 24) { h = 23; m = 50; }
            } else { // type === 'end'
                let [startHour, startMinute] = tempReservation.start.split(':').map(Number);
                h = startHour; m = startMinute + 10;
                if (m >= 60) { h++; m -= 60; }
                if (h >= 24) { h = 23; m = 50; }
            }

            if (isTimeValid(h, m)) {
                [hour, minute] = [h, m];
            } else {
                const initialDate = new Date(`${tempReservation.date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
                let nextDate = initialDate;
                for (let i = 0; i < 144; i++) {
                    nextDate.setMinutes(nextDate.getMinutes() + 10);
                    if (isTimeValid(nextDate.getHours(), nextDate.getMinutes())) {
                        [hour, minute] = [nextDate.getHours(), nextDate.getMinutes()];
                        return;
                    }
                }
                [hour, minute] = [initialDate.getHours(), initialDate.getMinutes()];
            }
        };

        const updateDial = () => {
            UI.showPickerModal(type === 'start' ? '시작 시간' : '종료 시간', 
                (contentEl) => {
                    contentEl.innerHTML = `
                        <div class="dial-container">
                            <div class="dial-group">
                                <button id="hour-up">▲</button>
                                <div id="hour-value" class="dial-value">${String(hour).padStart(2, '0')}</div>
                                <button id="hour-down">▼</button>
                            </div>
                            <div class="dial-value">:</div>
                            <div class="dial-group">
                                <button id="min-up">▲</button>
                                <div id="min-value" class="dial-value">${String(minute).padStart(2, '0')}</div>
                                <button id="min-down">▼</button>
                            </div>
                        </div>
                    `;
                },
                (footerEl) => {
                    const confirmBtn = document.createElement('button');
                    confirmBtn.textContent = '확인';
                    confirmBtn.className = 'btn primary';
                    confirmBtn.onclick = () => {
                        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                        tempReservation[type] = time;
                        document.querySelector(`#timepicker-${type}-display`).textContent = time;
                        UI.hidePickerModal();
                    };
                    footerEl.appendChild(confirmBtn);

                    const cancelBtn = document.createElement('button');
                    cancelBtn.textContent = '취소';
                    cancelBtn.className = 'btn secondary';
                    cancelBtn.onclick = () => UI.hidePickerModal();
                    footerEl.insertBefore(cancelBtn, confirmBtn);
                }
            );

            document.querySelector('#hour-up').onclick = () => {
                const newHour = (hour + 1) % 24;
                if (isTimeValid(newHour, minute)) {
                    hour = newHour;
                    updateDial();
                }
            };
            document.querySelector('#hour-down').onclick = () => {
                const newHour = (hour - 1 + 24) % 24;
                if (isTimeValid(newHour, minute)) {
                    hour = newHour;
                    updateDial();
                }
            };
            document.querySelector('#min-up').onclick = () => {
                const newMin = (minute + 10) % 60;
                if (isTimeValid(hour, newMin)) {
                    minute = newMin;
                    updateDial();
                }
            };
            document.querySelector('#min-down').onclick = () => {
                const newMin = (minute - 10 + 60) % 60;
                if (isTimeValid(hour, newMin)) {
                    minute = newMin;
                    updateDial();
                }
            };
        };
        
        setInitialTime();
        updateDial();
    };

    const showNoticeDetail = (noticeId) => {
        const notice = Api.getNoticeById(noticeId);
        if (!notice) return;
        appInstance.goTo({ screen: 'notice-detail', payload: notice });
    };

    const init = (app) => {
        appInstance = app;

        UI.elements.main.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;
            
            const { action, screen, bookId, roomId, reservationId, type, noticeId, genre } = target.dataset;

            const actions = {
                navigate: () => appInstance.goTo({ screen }),
                'guest-mode': () => { State.setCurrentUser(null); appInstance.goTo({ screen: 'main' }); },
                login: handleLogin,
                signup: handleSignup,
                'show-detail': () => appInstance.goTo({ screen: 'detail', payload: bookId }),
                'show-notice-detail': () => showNoticeDetail(noticeId),
                'show-room-detail': () => appInstance.goTo({ screen: 'reservation-detail', payload: roomId }),
                'open-datepicker': () => openDatePicker(roomId),
                'open-timepicker': () => openTimePicker(type),
                'book-room': handleRoomReservation,
                'cancel-room-reservation': () => handleCancelRoomReservation(reservationId),
                'reserve-book': () => handleBookReservation(bookId),
                'cancel-book-reservation': () => handleCancelBookReservation(bookId),
                loan: () => handleLoan(bookId),
                return: (e) => handleReturn(bookId, e),
                'filter-genre': () => {
                    const query = document.querySelector('#search-input').value;
                    appInstance.searchBooks(query, genre);
                    document.querySelectorAll('[data-action="filter-genre"]').forEach(btn => {
                        btn.classList.remove('primary');
                        btn.classList.add('secondary');
                    });
                    target.classList.remove('secondary');
                    target.classList.add('primary');
                }
            };

            if (actions[action]) {
                if (action === 'return') actions[action](e);
                else actions[action]();
            }
        });

        UI.elements.main.addEventListener('input', (e) => {
            if (e.target.id === 'search-input') {
                const activeGenre = document.querySelector('.genre-btn.active')?.dataset.genre || '전체';
                appInstance.searchBooks(e.target.value, activeGenre);
            }
            if (e.target.id === 'room-search-input') appInstance.searchRooms(e.target.value);
        });

        document.querySelector('#btn-back').addEventListener('click', () => appInstance.goBack());
        document.querySelector('#btn-home').addEventListener('click', () => {
            const currentState = State.getState();
            if (currentState.history.length <= 1 && currentState.history[0].screen === 'start') return;
            UI.showModal('처음 화면으로 돌아가시겠습니까?', [
                { text: '취소' },
                { text: '확인', type: 'primary', action: () => appInstance.goHome() },
            ]);
        });
    };

    return { init };
})(Api, State, UI);
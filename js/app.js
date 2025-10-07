const App = (function(Api, State, UI, Events) {
    let clockInterval = null;
    let lastTime = "";

    const startClock = () => {
        const clockWidget = document.querySelector('#datetime-widget');
        if (!clockWidget) return;

        const update = () => {
            const now = new Date();
            const time = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            const date = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

            let timeHTML = '';
            for (let i = 0; i < time.length; i++) {
                const oldChar = lastTime[i] || '';
                const newChar = time[i];
                if (oldChar !== newChar) {
                    timeHTML += `<span class="time-char-container" style="--new-char: '${newChar}'"><span class="time-char animate">${oldChar}</span><span class="time-char">${newChar}</span></span>`;
                } else {
                    timeHTML += `<span class="time-char-container"><span class="time-char">${newChar}</span></span>`;
                }
            }
            
            clockWidget.innerHTML = `<div class="time">${timeHTML}</div><div class="date">${date}</div>`;
            lastTime = time;
        };

        stopClock();
        update();
        clockInterval = setInterval(update, 1000);
    };

    const stopClock = () => {
        if (clockInterval) {
            clearInterval(clockInterval);
            clockInterval = null;
        }
    };

    const init = async () => {
        await Api.init();
        UI.init();
        Events.init(App);
        goHome();
    };

    const goTo = (route) => {
        stopClock();
        const { screen, payload } = route;
        State.setRoute(screen, payload);
        const state = State.getState();
        let data = { currentUser: state.currentUser, payload: null };

        switch (screen) {
            case 'main':
                data.bookOfTheDay = Api.getBookById(Api.getBookIdOfTheDay());
                data.latestNotice = Api.getLatestNotice();
                break;
            case 'search':
                data.allBooks = Api.getBooks();
                break;
            case 'my-info':
                if (state.currentUser) {
                    data.borrowedBooks = Api.getBooksByBorrower(state.currentUser.id);
                    data.reservedBooks = Api.getBooksByReserver(state.currentUser.id);
                    data.roomReservations = Api.getRoomReservationsByUser(state.currentUser.id);
                }
                break;
            case 'reservation':
                data.rooms = Api.getRooms();
                break;
            case 'notice-detail':
                data.payload = payload;
                break;
            case 'detail':
                data.payload = Api.getBookById(payload);
                break;
            case 'reservation-detail':
                data.payload = Api.getRoomById(payload);
                break;
            case 'recommendations':
                data.recommendedBooks = Api.getRecommendedBooks();
                break;
            case 'notices':
                data.notices = Api.getNotices();
                break;
        }

        UI.render(screen, data);

        if (screen === 'main') {
            startClock();
        }
        
        const listItems = document.querySelectorAll('.list-item');
        listItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.05}s`;
        });
    };

    const goBack = () => {
        const prevRoute = State.goBack();
        if (prevRoute) {
            goTo(prevRoute);
        } else {
            UI.showModal('이전 화면이 없습니다.\n처음 화면으로 돌아가시겠습니까?', [
                { text: '취소' },
                { text: '확인', type: 'primary', action: () => goHome() },
            ]);
        }
    };

    const goHome = () => {
        const homeRoute = State.goHome();
        goTo(homeRoute);
    };

    const refresh = () => {
        const { history } = State.getState();
        const currentRoute = history[history.length - 1];
        if (currentRoute) {
            goTo(currentRoute);
        }
    };

    const searchBooks = (query, genre) => {
        const lowerQuery = query.toLowerCase();
        let results = Api.getBooks();

        if (genre && genre !== '전체') {
            results = results.filter(b => b.genre === genre);
        }

        if (query) {
            results = results.filter(b => 
                b.title.toLowerCase().includes(lowerQuery) || 
                b.author.toLowerCase().includes(lowerQuery)
            );
        }

        document.querySelector('#search-results').innerHTML = UI.renderBookItems(results, false, State.getState().currentUser);
    };

    const searchRooms = (query) => {
        const lowerQuery = query.toLowerCase();
        const allRooms = Api.getRooms();
        const results = allRooms.filter(r => r.name.toLowerCase().includes(lowerQuery));
        document.querySelector('#room-search-results').innerHTML = UI.renderRoomItems(results);
    };

    return { init, goTo, goBack, goHome, refresh, searchBooks, searchRooms };

})(Api, State, UI, Events);

document.addEventListener('DOMContentLoaded', App.init);

/**
 * @module State
 * @description 앱의 현재 상태를 관리.
 */
const State = (function() {
    let currentState = {
        currentUser: null,
        history: [],
    };

    const getState = () => ({ ...currentState });

    const setCurrentUser = (user) => {
        currentState.currentUser = user;
        if (user) {
            currentState.history = [{ screen: 'main', payload: null }];
        }
    };

    const setRoute = (screen, payload = null) => {
        const currentRoute = currentState.history[currentState.history.length - 1];
        if (currentRoute && currentRoute.screen === screen && currentRoute.payload === payload) {
            return;
        }
        currentState.history.push({ screen, payload });
    };

    const goBack = () => {
        if (currentState.history.length > 1) {
            currentState.history.pop();
            return currentState.history[currentState.history.length - 1];
        }
        return null;
    };

    const goHome = () => {
        currentState.currentUser = null;
        currentState.history = [{ screen: 'start', payload: null }];
        return currentState.history[0];
    };

    return { getState, setCurrentUser, setRoute, goBack, goHome };
})();

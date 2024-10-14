export const state = () => ({
  globalErrorMessage: {},
  videoDomain: process.env.NODE_ENV === 'production' ? '/api/v1/reports/video/stream/' : 'http://localhost:8083/api/v1/reports/video/stream/',
  loading: true,
  windowWidth: '',
  redirects: [],
  redirectsMap: null,
  search: '',
  currentCity: process.browser ? JSON.parse(localStorage.getItem('city')) || null : null,
  searchResult: {},
  status: '',
  currentBranch: process.browser ? localStorage.getItem('branch') || '' : '',
  updateUser: false,
  refreshPageDataCallback: null,
  sourceId: process.browser ? JSON.parse(localStorage.getItem('sourceId')) || null : null,
  errorMessages: [],
});

export const mutations = {
  set_loading(state, payload) {
    state.loading = payload;
  },
  set_global_error_message(state, val) {
    state.globalErrorMessage = val;
  },
  add_error_messages(state, message) {
    state.errorMessages.push({ message: message, color: 'rgba(35,40,51,0.93)' });
    this.commit('close_messages');
  },
  add_success_messages(state, message) {
    state.errorMessages.push({ message: message, color: 'rgba(76,175,80,0.93)' });
    this.commit('close_messages');
  },
  close_messages(state) {
    if (!!state.errorMessages && Array.isArray(state.errorMessages) && state.errorMessages.length > 0) {
      setTimeout(() => {
        state.errorMessages = state.errorMessages.slice(0, -1);
      }, 3000);
    }
  },
  select_branch(state, value) {
    state.currentBranch = value;
    if (process.browser) {
      localStorage.setItem('branch', JSON.stringify(value));
    }
  },
  search_word(state, value) {
    state.search = value;
  },
  clear_search_word(state, value) {
    state.search = value;
  },
  set_search_result(state, payload) {
    state.searchResult = payload;
  },
  set_city(state, payload) {
    state.currentCity = payload;
    if (process.browser) {
      localStorage.setItem('city', JSON.stringify(payload));
    }
  },
  set_source_id(state, payload) {
    state.sourceId = payload;
    if (process.browser) {
      localStorage.setItem('sourceId', JSON.stringify(payload));
    }
  },
  window_width(state, payload) {
    state.windowWidth = payload;
  },
};

export const actions = {
  setWindowWidth({ commit }, val) {
    commit('window_width', val);
  },
  setLoading({ commit }, val) {
    commit('set_loading', val);
  },
  setGlobalErrorMessage({ commit }, message) {
    if (message === undefined) {
      commit('set_global_error_message', {
        message: 'Something went wrong',
        error: null,
      });
    } else if (message instanceof Error) {
      console.error(message);
      commit('set_global_error_message', {
        message: 'Something went wrong',
        error: message,
      });
    } else {
      commit('set_global_error_message', {
        message: message,
        error: null,
      });
    }
  },
  addErrorMessages({ commit }, message) {
    commit('add_error_messages', message);
  },
  addSuccessMessages({ commit }, message) {
    commit('add_success_messages', message);
  },
  selectBranch({ commit }, branch) {
    commit('select_branch', branch);
  },
  selectSearchWord({ commit }, word) {
    commit('search_word', word);
  },
  clearSearchWord({ commit }, word) {
    commit('clear_search_word', word);
  },
  setSearchResult({ commit }, val) {
    commit('set_search_result', val);
  },
  setCity({ commit }, val) {
    commit('set_city', val);
  },
  setSourceId({ commit }, val) {
    commit('set_source_id', val);
  },
};

export const getters = {
  authStatus: (state) => state.status,
  updateUser: (state) => state.updateUser,
  globalErrorMessage: (state) => state.globalErrorMessage,
  globalErrorDialog: (state) => state.globalErrorMessage && state.globalErrorMessage.message,
  errorMessages: (state) => state.errorMessages,
  currentBranch: (state) => state.currentBranch,
  loading: (state) => state.loading,
  searchResult: (state) => state.searchResult,
  currentCity: (state) => state.currentCity,
  sourceId: (state) => state.sourceId,
  windowWidth: (state) => state.windowWidth,
  videoDomain: (state) => state.videoDomain,
};

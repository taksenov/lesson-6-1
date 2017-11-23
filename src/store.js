import {createStore} from 'redux';
import rootReducer from './reducers';

export default initialState =>
  createStore(
    rootReducer,
    initialState,
    window.devToolsExtension
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  );

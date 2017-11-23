import {createStore, combineReducers} from 'redux';

const initState = {
  budget: 0,
  transactions: [],
  groups: {},
  userInfo: {
    firstName: '',
    lastName: '',
    parents: {
      mother: {
        firstName: '',
        lastName: ''
      }
    }
  }
};
const emptyReducer = (state = '', action) => state;

const splitedReducer = combineReducers({
  budget: budget,
  transactions: transactions,
  groups: groups,
  userInfo: combineReducers({
    firstName: emptyReducer,
    lastName: emptyReducer,
    parents: combineReducers({
      mother: combineReducers({
        firstName: (state = '', action) => {
          if (action.type === 'CHANGE_MOTHER_FIRST_NAME') {
            return action.payload;
          }
          return state;
        },
        lastName: emptyReducer
      })
    })
  })
});

function budget(state = 0, action) {
  switch (action.type) {
    case 'BANK_DIVIDENTS':
    case 'ADD_MONEY':
      return state + action.payload;
    case 'REMOVE_MONEY':
      return state - action.payload;
    default:
      return state;
  }
}

function transactions(state = [], action) {
  switch (action.type) {
    case 'ADD_MONEY':
    case 'BANK_DIVIDENTS':
      return [
        ...state,
        {
          money: action.payload,
          description: action.meta.description
        }
      ];
    case 'REMOVE_MONEY':
      return [
        ...state,
        {
          money: -action.payload,
          description: action.meta.description
        }
      ];
    default:
      return state;
  }
}

function groups(state = {}, action) {
  switch (action.type) {
    case 'REMOVE_MONEY':
    case 'ADD_MONEY':
    case 'BANK_DIVIDENTS':
      return {
        ...state,
        [action.meta.description]:
          (state[action.meta.description] || 0) +
          action.payload
      };
    default:
      return state;
  }
}

const reducer = (state = initState, action) => {
  console.log(action, state);

  if (action.type === 'ADD_MONEY') {
    return {
      ...state,
      budget: state.budget + action.payload,
      transactions: [
        ...state.transactions,
        {
          money: action.payload,
          description: action.meta.description
        }
      ],
      groups: {
        ...state.groups,
        [action.meta.description]:
          (state.groups[action.meta.description] || 0) +
          action.payload
      }
    };
  } else if (action.type === 'REMOVE_MONEY') {
    return {
      ...state,
      budget: state.budget - action.payload,
      transactions: [
        ...state.transactions,
        {
          money: -action.payload,
          description: action.meta.description
        }
      ],
      groups: {
        ...state.groups,
        [action.meta.description]:
          (state.groups[action.meta.description] || 0) +
          action.payload
      }
    };
  } else if (action.type === 'BANK_DIVIDENTS') {
    return {
      ...state,
      budget: state.budget * 1.1,
      transactions: [
        ...state.transactions,
        {
          money: state.budget * 0.1,
          description: 'Начисления банка'
        }
      ],
      groups: {
        ...state.groups,
        'Начисления банка':
          (state.groups['Начисления банка'] || 0) +
          state.budget * 0.1
      }
    };
  }
  return state;
};

const store = createStore(
  splitedReducer,
  {
    budget: -600,
    transactions: [
      {
        money: -600,
        description: 'Оплатил github'
      }
    ],
    groups: {
      'Оплатил github': -600
    },
    userInfo: {
      firstName: '',
      lastName: '',
      parents: {
        mother: {
          firstName: '',
          lastName: ''
        }
      }
    }
  },
  window.devToolsExtension
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f
);

console.log(store.getState());

store.dispatch({
  type: 'ADD_MONEY',
  payload: 1000,
  meta: {description: 'Зарплата'}
});

console.log(store.getState());

store.dispatch({
  type: 'REMOVE_MONEY',
  payload: 100,
  meta: {description: 'Обед'}
});

console.log(store.getState());

let dividents = store.getState().budget * 0.1;

store.dispatch({
  type: 'BANK_DIVIDENTS',
  payload: dividents,
  meta: {description: 'Начисление банка'}
});

console.log(store.getState());

store.dispatch({
  type: 'REMOVE_MONEY',
  payload: 130,
  meta: {description: 'Обед'}
});

console.log(store.getState());

store.dispatch({
  type: 'CHANGE_MOTHER_FIRST_NAME',
  payload: 'Глюза'
});

console.log(store.getState());

/**
 * Created by Justin on 2016-03-02.
 */
import _ from 'lodash';
import { Map } from 'immutable';

const initialState = Map({
  phase: 'menu',
});

export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case 'ACTION': {

      return state;
    }

    default: {
      return state;
    }
  }
};

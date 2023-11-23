// import { NavigationActions } from 'react-navigation'
import { NavigationActions } from 'react-navigation'

let _navigator;

export const setTopLevelNavigator = navigatorRef => {
  _navigator = navigatorRef;
};

export const navigate = (routeName, params) => {
  if (_navigator && routeName) {
    _navigator.navigate(routeName, params)
  }
};

export const goBack = () => {
  if (_navigator) {
    _navigator.dispatch(NavigationActions.back());
  }
};

export const reset = (name, params = {}) => {
  _navigator.reset({
    index: 0,
    routes: [{ name, params }]
  })
}

// add other navigation functions that you need and export them

export default {
  reset,
  navigate,
  goBack,
  setTopLevelNavigator
};

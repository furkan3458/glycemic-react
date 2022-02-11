import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector, connect } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Routes from './Routes';

import store from './states/store';

import { validateUser } from './states/actions/authActions';
import { setDrawer } from './states/actions/drawerActions';
import { getCategoryList } from './states/actions/categoryActions';
import { StateType } from './states/reducers';

import AuthContext, { AuthContextProvider } from './contexts/AuthContext';
import ToastContext, { ToastContextProvider } from './contexts/ToastContext';

import SpinnerComponent from './components/SpinnerComponent';

const App: React.FC = ({ ...props }: any): JSX.Element => {

  const [authLocale, setauthLocale] = useState("guest");
  const [authenticatedUser, setauthenticatedUser] = useState<AuthContextProvider>();
  const [toastContext, setToastContext] = useState<ToastContextProvider>();
  const [loaded, setloaded] = useState(false);

  const auth = useSelector((state: StateType) => state.auth);
  const drawer = useSelector((state: StateType) => state.drawer);
  const category = useSelector((state: StateType) => state.category);

  useEffect(() => {
    if (!loaded) {
      props.validateUser();
      props.setDrawer();
      props.getCategoryList();
      initToastContext();
    }
  }, []);

  useEffect(() => {
    if (auth.isValidate && drawer.isInitialize && category.isInitialize) {
      setAuthLevel();
      setloaded(true);
    }
  }, [auth.isValidate, drawer.isInitialize, category.isInitialize]);

  const initToastContext = () => {
    const context: ToastContextProvider = {
      toastSuccess: handleToastSuccess,
      toastInfo: handleToastInfo,
      toastError: handleToastError,
      toastWarn: handleToastWarn,
    }

    setToastContext(context);
  }

  const handleToastSuccess = (message: string) => {
    toast.success(message);
  }

  const handleToastInfo = (message: string) => {
    toast.info(message);
  }

  const handleToastError = (message: string) => {
    toast.error(message);
  }

  const handleToastWarn = (message: string) => {
    toast.warn(message);
  }

  const setAuthLevel = () => {
    auth.user ? buildAuthenticatedUser("user", auth.user) : buildAuthenticatedUser("guest", []);
  }

  const buildAuthenticatedUser = (authType: string, user: any) => {
    let authUser: AuthContextProvider = {
      authType: authType,
      authenticatedUser: {
        id: 0,
        fullname: "",
        username: "",
        email: "",
        roles: []
      }
    }
    if (authType === "user") {
      authUser.authenticatedUser.id = user.id;
      authUser.authenticatedUser.fullname = user.fullname;
      authUser.authenticatedUser.username = user.username;
      authUser.authenticatedUser.email = user.email;
      authUser.authenticatedUser.roles = user.roles;
    }

    setauthLocale(authType);
    setauthenticatedUser(authUser);
  }

  return ((!loaded || (!auth.isValidate || !drawer.isInitialize || !category.isInitialize)) ? <SpinnerComponent /> :
    <BrowserRouter>
      <HelmetProvider>
        <ToastContext.Provider value={toastContext!}>
          <AuthContext.Provider value={authenticatedUser!}>
            <Routes auth={authLocale} />
          </AuthContext.Provider>
        </ToastContext.Provider>
        <ToastContainer
          theme="dark"
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </HelmetProvider>
    </BrowserRouter>
  );
};

const mapDispatchToProps = { validateUser, setDrawer, getCategoryList };
const ConnectedApp = connect(null, mapDispatchToProps)(App);

const AppBuilder = () => {
  return (
    <Provider store={store}>
      <ConnectedApp />
    </Provider>
  );
}

ReactDOM.render(<AppBuilder />, document.getElementById('root'));

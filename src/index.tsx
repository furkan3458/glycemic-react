import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector, connect } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Sidebar, Segment, Menu, Icon } from 'semantic-ui-react';
import CookieConsent from 'react-cookie-consent';

import 'react-toastify/dist/ReactToastify.css';

import Routes from './Routes';

import store from './states/store';

import { validateUser } from './states/actions/authActions';
import { setList } from './states/actions/listActions';
import { getCategoryList } from './states/actions/categoryActions';
import { StateType } from './states/reducers';

import AuthContext, { AuthContextProvider } from './contexts/AuthContext';
import ToastContext, { ToastContextProvider } from './contexts/ToastContext';
//import SidebarContext, { SidebarContextProvider } from './contexts/SidebarContext';

import SpinnerComponent from './components/SpinnerComponent';


const App: React.FC = ({ ...props }: any): JSX.Element => {

  const [authenticatedUser, setauthenticatedUser] = useState<AuthContextProvider>();
  const [toastContext, setToastContext] = useState<ToastContextProvider>();
  //const [sidebarContext, setSidebarContext] = useState<SidebarContextProvider>();

  const [authLocale, setauthLocale] = useState("guest");
  const [loaded, setloaded] = useState(false);
  //const [showSidebar, setshowSidebar] = useState(false);

  const auth = useSelector((state: StateType) => state.auth);
  const list = useSelector((state: StateType) => state.list);
  const category = useSelector((state: StateType) => state.category);

  useEffect(() => {
    if (!loaded) {
      props.validateUser();
      props.setList();
      props.getCategoryList();
      initToastContext();
      //initSidebarContext();
    }
  }, []);

  useEffect(() => {
    if (auth.isValidate && list.isInitialize && category.isInitialize) {
      setAuthLevel();
      setloaded(true);
    }
  }, [auth.isValidate, list.isInitialize, category.isInitialize]);

  const initToastContext = () => {
    const context: ToastContextProvider = {
      toastSuccess: handleToastSuccess,
      toastInfo: handleToastInfo,
      toastError: handleToastError,
      toastWarn: handleToastWarn,
    }

    setToastContext(context);
  }

  /*const initSidebarContext = () => {
    const context: SidebarContextProvider = {
      handleSidebar: (state: boolean) => {
        setshowSidebar(state);
      }
    }

    setSidebarContext(context);
  }*/

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

  /*const setVisible = () => {
    setshowSidebar(false);
  }

  <SidebarContext.Provider value={sidebarContext!}>
              <Sidebar.Pushable>
                <Sidebar
                  as={Menu}
                  animation='overlay'
                  icon='labeled'
                  inverted
                  onHide={() => setVisible()}
                  vertical
                  visible={showSidebar}
                  width='wide'
                >
                  </Sidebar>

                  <Sidebar.Pusher dimmed={showSidebar}>
                    
                  </Sidebar.Pusher>
                </Sidebar.Pushable>
              </SidebarContext.Provider>
   */

  return ((!loaded || (!auth.isValidate || !list.isInitialize || !category.isInitialize)) ? <SpinnerComponent /> :
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
        <CookieConsent
          location="bottom"
          buttonText="Kabul ediyorum."
          cookieName={process.env.REACT_APP_COOKIE_NAME}
          style={{ background: "#1b1c1d" }}
          buttonStyle={{ borderRadius: "5px", color: "#fff", backgroundColor: "#2185d0", fontSize: "13px" }}
          expires={365}
        >Bilgi toplum hizmetleri için gerekli olduğundan sitemizde, çerezler yoluyla kişisel verilerinizi işliyoruz. Çerezlerin kullanımı sitenin işlevleri için gereklidir. Kabul etmediğiniz takdirde bu işlevler geçersiz kalır ve kullanamazsınız.</CookieConsent>
      </HelmetProvider>
    </BrowserRouter>
  );
};

const mapDispatchToProps = { validateUser, setList, getCategoryList };
const ConnectedApp = connect(null, mapDispatchToProps)(App);

const AppBuilder = () => {
  return (
    <Provider store={store}>
      <ConnectedApp />
    </Provider>
  );
}

ReactDOM.render(<AppBuilder />, document.getElementById('root'));

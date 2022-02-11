import React, { useState, useRef, useEffect } from 'react';
import { Container, Grid, Form, Button } from 'semantic-ui-react';
import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom';
import { useSelector, connect } from 'react-redux';
import $ from 'jquery';

import { StateType } from '../states/reducers';
//import { setAuthLoading, setAuthFail, setAuthenticated, loadUser } from './state/actions/authActions';

import NavbarComponent from '../components/NavbarComponent';
import SpinnerComponent from '../components/SpinnerComponent';
import FooterComponent from '../components/FooterComponent';

/**
import ToastComponent from './components/ToastComponent';
import AlertComponent from './components/AlertComponent';**/

export const Login = ({ ...props }: any) => {

    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [rememberme, setRememberme] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [usernameValid, setusernameValid] = useState(false);
    const [passwordValid, setpasswordValid] = useState(false);
    const [toastShow, settoastShow] = useState(false);
    const [toastMessage, settoastMessage] = useState("");

    const passwordSpan = useRef<HTMLSpanElement>(null);
    const usernameInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const submitButton = useRef<HTMLButtonElement>(null);

    const auth = useSelector((state: StateType) => state.auth);

    useEffect(() => {
        if (!loaded)
            setLoaded(true);
    }, [loaded]);

    useEffect(() => {
        handleSubmitAccess();
    }, [auth.isLoading]);

    useEffect(() => {
        if (auth.isAuthenticated)
            window.location.href = "/";
    }, [auth.isAuthenticated]);

    const onTogglePasswordClick = () => {
        if (passwordSpan.current === null)
            return;

        let $this = $(passwordSpan.current);

        $this.toggleClass("fa-eye fa-eye-slash");

        var input = $($this.data("toggle"));
        if (input.attr("type") === "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    }

    const onSubmitFormClick = (e: any) => {
        e.preventDefault();
        if (auth.isLoading) {
            settoastMessage("Please wait...");
            settoastShow(true);
            return;
        }

        if ((username === "" || !usernameValid) && usernameInput.current) {
            usernameInput.current.focus();
            settoastMessage("Please Enter the valid username.");
            settoastShow(true);
            return;
        }

        else if ((password === "" || !passwordValid) && passwordInput.current) {
            passwordInput.current.focus();
            settoastMessage("Please Enter the valid password.");
            settoastShow(true);
            return;
        }

        console.log("Submit", username, password, rememberme);
        props.loadUser({ username: username, password: password, rememberMe: rememberme });
    }

    const onChangeUsername = (value: string) => {
        if (usernameInput.current === null)
            return;

        let $this = $(usernameInput.current);

        const userNameRegex = new RegExp("^[a-zA-Z0-9.!@_]{6,30}$");
        let usernameValid = userNameRegex.test(value);


        if (value === "") {
            $this.removeClass("invalid");
            $this.removeClass("valid");
        }
        else if (!usernameValid) {
            $this.addClass("invalid");
            $this.removeClass("valid");
        }
        else if (usernameValid) {
            $this.addClass("valid");
            $this.removeClass("invalid");
        }

        setusername(value);
        setusernameValid(usernameValid);
    }

    const onChangePassword = (value: string) => {
        if (passwordInput.current === null)
            return;

        const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
        const passwordValid = passwordRegex.test(value);
        let $this = $(passwordInput.current);

        if (value === "") {
            $this.removeClass("invalid");
            $this.removeClass("valid");
        }
        else if (!passwordValid) {
            $this.addClass("invalid");
            $this.removeClass("valid");
        }
        else if (passwordValid) {
            $this.addClass("valid");
            $this.removeClass("invalid");
        }

        setpassword(value);
        setpasswordValid(passwordValid);
    }

    const toastCallback: Function = () => {
        if (toastShow)
            settoastShow(false);
    }

    const handleSubmitAccess = () => {
        if (submitButton.current === null)
            return;

        $(submitButton.current).prop("disabled", auth.isLoading);
    }

    const handleAlertClose = () => {
        props.setAuthFail(false);
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Glycemic Indexer - Giriş</title>
            </Helmet>
            <NavbarComponent />
            <Container>
                Login
            </Container>
            <FooterComponent/>
        </>
        );
    /* <>
         <NavbarComponent />
         <SpinnerComponent />
     </>
     :
     <>
         <Helmet>
             <meta charSet="utf-8" />
             <title>Brand - Login</title>
         </Helmet>
         <ToastComponent type={"Danger"} position={"top-end"} text={toastMessage}
             show={toastShow} header={"Brand"} iconClass={"fa-solid fa-circle"} delay={5000} autohide={true} close={() => toastCallback()} />
         <NavbarComponent />
         <section className="ftco-section text-black">
             <Container>
                 <Row className="justify-content-center">
                     <Col md={'6'} className="text-center mb-5">
                         <h2 className="heading-section">Login</h2>
                     </Col>
                 </Row>
                 <Row className="justify-content-center">
                     <Col md={'6'} lg={'4'}>
                         <div className="login-wrap p-0">
                             <h3 className="mb-4 text-center">Have an account?</h3>
                             <AlertComponent show={auth.isAuthFail} variant={'danger'} header={"Login Failed"} text={"You may entered wrong username or password. Try again."} onClose={()=> handleAlertClose()}/>
                             <Form className="signin-form">
                                 <Form.Group className="form-group" controlId="formUsername">
                                     <Form.Control ref={usernameInput} type="text" onKeyUp={(e) => onChangeUsername(e.currentTarget.value)} placeholder="Username" required />
                                     <span className="fa fa-fw fa-solid valid-icon"></span>
                                 </Form.Group>
                                 <Form.Group className="form-group d-md-flex" controlId="formPassword">
                                     <Form.Control ref={passwordInput} type="password" onKeyUp={(e) => onChangePassword(e.currentTarget.value)} placeholder="Password" required />
                                     <span className="fa fa-fw fa-solid valid-icon"></span>
                                     <span ref={passwordSpan} onClick={() => onTogglePasswordClick()} data-toggle="#formPassword" className="fa fa-fw fa-eye field-icon toggle-password"></span>
                                 </Form.Group>
                                 <Form.Group className="form-group">
                                     <Button ref={submitButton} type="submit" onClick={(e) => onSubmitFormClick(e)} className="btn-submit px-3">
                                         {auth.isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : <>Login</>}
                                     </Button>
                                 </Form.Group>
                                 <Form.Group className="form-group d-md-flex">
                                     <div className="w-50">
                                         <label className="checkbox-wrap checkbox-primary">Remember Me
                                             <input type="checkbox" onChange={(e) => setRememberme(e.target.checked)} defaultChecked />
                                             <span className="checkmark"></span>
                                         </label>
                                     </div>
                                     <div className="w-50 text-md-end">
                                         <Link to="/forgot_password" style={{ color: "#212529" }}>Forgot Password</Link>
                                     </div>
                                 </Form.Group>
                             </Form>
                             <p className="w-100 text-center" style={{ color: "#212529" }}>&mdash; Or Sign In With &mdash;</p>
                             <div className="social d-flex text-center">
                                 <Link to="/login_google" className="px-2 py-2 me-md-1 rounded"><span className="fa-brands fa-google mr-2"></span> Google</Link>
                                 <Link to="/login_twitter" className="px-2 py-2 ms-md-1 rounded"><span className="fa-brands fa-twitter mr-2"></span> Twitter</Link>
                             </div>
                         </div>
                     </Col>
                 </Row>
             </Container>
         </section>
         <FooterComponent />
     </>
 );*/
};

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {};

export default /*connect(mapStateToProps, mapDispatchToProps)*/(Login);

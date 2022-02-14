import React, { useState, useRef, useEffect } from 'react';
import { Container, Grid, Form, Button } from 'semantic-ui-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useSelector, connect } from 'react-redux';
import $ from 'jquery';

import { StateType } from '../states/reducers';
import { ValidityStates } from '../states/reducers/authReducer';
//import { setDefaultValidateUsername, setDefaultValidateEmail, setAuthFail, signupAuthAction, validateUsernameAuthAction, validateEmailAuthAction } from './state/actions/authActions';

import NavbarComponent from '../components/NavbarComponent';
import FooterComponent from '../components/FooterComponent';
import SpinnerComponent from '../components/SpinnerComponent';

/**

import ToastComponent from './components/ToastComponent';
import AlertComponent from './components/AlertComponent';**/


export const Signup = ({ ...props }: any) => {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [email, setemail] = useState("");
    const [fullname, setfullname] = useState("");
    const [usernameValid, setusernameValid] = useState(false);
    const [passwordValid, setpasswordValid] = useState(false);
    const [emailValid, setemailValid] = useState(false);
    const [fullnameValid, setfullnameValid] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const [toastShow, settoastShow] = useState(false);
    const [toastMessage, settoastMessage] = useState("");

    const passwordSpan = useRef<HTMLSpanElement>(null);
    const usernameInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const emailInput = useRef<HTMLInputElement>(null);
    const fullnameInput = useRef<HTMLInputElement>(null);
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

    useEffect(() => {
        if(usernameInput.current === null || emailInput.current === null)
            return;

        handleEmailValidity();
    }, [, auth.emailValidity])

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
        else if ((email === "" || !emailValid) && emailInput.current) {
            emailInput.current.focus();
            settoastMessage("Please Enter the valid email.");
            settoastShow(true);
            return;
        }
        else if ((fullname === "" || !fullnameValid) && fullnameInput.current) {
            fullnameInput.current.focus();
            settoastMessage("Please Enter the valid email.");
            settoastShow(true);
            return;
        }
        else if ((password === "" || !passwordValid) && passwordInput.current) {
            passwordInput.current.focus();
            settoastMessage("Please Enter the valid password.");
            settoastShow(true);
            return;
        }

        console.log("Submit", username, password, email, fullname);
        props.signupAuthAction({ username: username, password: password, email: email, fullname: fullname });
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

    const onChangeEmail = (value: string) => {
        if (emailInput.current === null)
            return;

        const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const emailValid = emailRegex.test(value);
        let $this = $(emailInput.current);

        if (value === "") {
            $this.removeClass("invalid");
            $this.removeClass("valid");
            props.setDefaultValidateEmail();
        }
        else if (!emailValid) {
            $this.addClass("invalid");
            $this.removeClass("valid");
        }
        else if (emailValid && !auth.emailValidity.isValidating) {
            $this.removeClass("invalid");
            $this.removeClass("valid");
            setTimeout(() => { checkEmail(value) }, 1 * 500);
        }

        setemail(value);
        setemailValid(emailValid);
    }

    const onChangeFullname = (value: string) => {
        if (fullnameInput.current === null)
            return;

        const fulnameRegex = new RegExp("");
        const fullnameInvalid = fulnameRegex.test(value);
        let $this = $(fullnameInput.current);

        if (value === "") {
            $this.removeClass("invalid");
            $this.removeClass("valid");
        }
        else if (!fullnameInvalid) {
            $this.addClass("invalid");
            $this.removeClass("valid");
        }
        else if (fullnameInvalid) {
            $this.addClass("valid");
            $this.removeClass("invalid");
        }

        setfullname(value);
        setfullnameValid(fullnameInvalid);
    }

    const checkUsername = (value:string) => {
        if (usernameInput.current!.value === value) {
            props.validateUsernameAuthAction(value);
        }
    }

    const checkEmail = (value:string) =>{
        if (emailInput.current!.value === value) {
            props.validateEmailAuthAction(value);
        }
    }

    const toastCallback: Function = () => {
        if (toastShow)
            settoastShow(false);
    }

    const handleEmailValidity = () =>{
        let $this = $(emailInput.current!);
        switch(auth.emailValidity.validateState){
            case ValidityStates.IDLE:
                $this.removeClass("invalid");
                $this.removeClass("valid");
                setemailValid(false);
                break;
            case ValidityStates.VALID:
                $this.removeClass("invalid");
                $this.addClass("valid");
                setemailValid(true);
                break;
            case ValidityStates.INVALID:
                $this.addClass("invalid");
                $this.removeClass("valid");
                setemailValid(false);
                break;
        }
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
                <title>Glycemic Indexer - Üye ol</title>
            </Helmet>
            <NavbarComponent />
            <Container>
                Signup
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
                <title>Brand - Signup</title>
            </Helmet>
            <ToastComponent type={"Danger"} position={"top-end"} text={toastMessage}
                show={toastShow} header={"Brand"} iconClass={"fa-solid fa-circle"} delay={5000} autohide={true} close={() => toastCallback()} />
            <NavbarComponent />
            <section className="ftco-section text-black">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={'6'} className="text-center mb-5">
                            <h2 className="heading-section">Signup</h2>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md={'6'} lg={'4'}>
                            <div className="login-wrap p-0">
                                <h3 className="mb-4 text-center">Create account</h3>
                                <AlertComponent show={auth.isAuthFail} variant={'danger'} header={"Login Failed"} text={"You may entered wrong username or password. Try again."} onClose={() => handleAlertClose()} />
                                <Form className="signin-form">
                                    <Form.Group className="form-group" controlId="formUsername">
                                        <Form.Control ref={usernameInput} type="text" onKeyUp={(e) => onChangeUsername(e.currentTarget.value)} placeholder="Username" required />
                                        {auth.usernameValidity.isValidating ? 
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="valid-icon"/>
                                            :   
                                            <span className="fa fa-fw fa-solid valid-icon"></span>
                                        }
                                    </Form.Group>
                                    <Form.Group className="form-group" controlId="forEmail">
                                        <Form.Control ref={emailInput} type="email" onKeyUp={(e) => onChangeEmail(e.currentTarget.value)} placeholder="Email" required />
                                        {auth.emailValidity.isValidating ? 
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="valid-icon"/>
                                            :   
                                            <span className="fa fa-fw fa-solid valid-icon"></span>
                                        }
                                    </Form.Group>
                                    <Form.Group className="form-group" controlId="formFullname">
                                        <Form.Control ref={fullnameInput} type="text" onKeyUp={(e) => onChangeFullname(e.currentTarget.value)} placeholder="Fullname" required />
                                        <span className="fa fa-fw fa-solid valid-icon"></span>
                                    </Form.Group>
                                    <Form.Group className="form-group d-md-flex" controlId="formPassword">
                                        <Form.Control ref={passwordInput} type="password" onKeyUp={(e) => onChangePassword(e.currentTarget.value)} placeholder="Password" required />
                                        <span className="fa fa-fw fa-solid valid-icon"></span>
                                        <span ref={passwordSpan} onClick={() => onTogglePasswordClick()} data-toggle="#formPassword" className="fa fa-fw fa-eye field-icon toggle-password"></span>
                                    </Form.Group>
                                    <Form.Group className="form-group">
                                        <Button ref={submitButton} type="submit" onClick={(e) => onSubmitFormClick(e)} className="btn-submit px-3">
                                            {auth.isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : <>Signup</>}
                                        </Button>
                                    </Form.Group>
                                </Form>
                                <p className="w-100 text-center" style={{ color: "#212529" }}>&mdash; Or Sign Up With &mdash;</p>
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

const mapDispatchToProps = { };

export default /*connect(mapStateToProps, mapDispatchToProps)*/(Signup);

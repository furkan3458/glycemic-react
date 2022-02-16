import { useContext, useEffect, useState } from 'react'
import { useSelector, connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Divider, Form, Grid, Header, Icon, List, Message, Modal } from 'semantic-ui-react';
import { useMediaQuery } from 'react-responsive';

import { StateType } from '../states/reducers';
import { authLogin } from '../states/actions/authActions';

import ToastContext, { ToastContextProvider } from '../contexts/ToastContext';

interface LoginProps {
    showModal: boolean;
    onClose: Function;
    onSignupClick: Function;
    authLogin?: Function;
}

const LoginModalComponent = ({ ...props }: LoginProps) => {

    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const auth = useSelector((state: StateType) => state.auth);

    const toastContext = useContext<ToastContextProvider>(ToastContext);

    const isMobileOrTablet = useMediaQuery({ query: '(max-width: 992px)' });

    useEffect(() => {
        if (auth.isAuthenticated)
            window.location.href = "/";
    }, [auth.isAuthenticated])
    

    const onCloseModal = () => {
        props.onClose(false);
    }

    const onSignupTrigger = () => {
        props.onSignupClick();
    }

    const onChangeEmail = (value: string) => {
        const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const emailValid = emailRegex.test(value);

        setEmail(value);
        setEmailError(false);
        setEmailValid(emailValid);
    }

    const onChangePassword = (value: string) => {
        const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
        const passwordValid = passwordRegex.test(value);

        setPassword(value);
        setPasswordError(false);
        setPasswordValid(passwordValid);
    }

    const onChangeRememberMe = (value: any) => {
        setRememberMe(value.checked);
    }

    const onClickLogin = () => {
        if (auth.isLoading) {
            toastContext.toastInfo("Lütfen bekleyiniz...");
            return;
        }
        else if (!emailValid) {
            let emailInput = document.querySelector<HTMLInputElement>("#email");
            emailInput!.focus();
            setEmailError(true);
            return;
        }
        else if (!passwordValid) {
            let passwordInput = document.querySelector<HTMLInputElement>("#password");
            passwordInput!.focus();
            setPasswordError(true);
            return;
        }

        const authObject = {
            email: email,
            password: password,
            rememberMe: rememberMe
        }

        props.authLogin!(authObject);
    }

    return (
        <Modal
            dimmer={'blurring'}
            open={props.showModal}
            onClose={() => onCloseModal()}
            closeIcon
        >
            <Modal.Content>
                <Grid stackable centered>
                    <Grid.Column computer={8} mobile={16}>
                        <Form size={"small"} loading={auth.isLoading} error={auth.isAuthFail}>
                            <Message
                                error
                                header='Giriş Başarısız'
                                content='Girdiğiniz e-posta veya şifre yanlış. Lütfen kontrol ederek tekrar giriniz.'
                            />
                            <Form.Input id={"email"}
                                icon='at'
                                iconPosition='left'
                                label='E-Posta'
                                placeholder='E-Posta'
                                error={emailError ? {
                                    content: 'Lütfen geçerli bir e-posta adresi girin.',
                                    pointing: 'below',
                                } : false}
                                onKeyUp={(e: any) => onChangeEmail(e.currentTarget.value)}
                                autoFocus
                            />
                            <Form.Input id={"password"}
                                icon='lock'
                                iconPosition='left'
                                label='Şifre'
                                type='password'
                                placeholder='Şifre'
                                error={passwordError ? {
                                    content: 'Lütfen geçerli bir şifre girin.',
                                    pointing: 'below',
                                } : false}
                                onKeyUp={(e: any) => onChangePassword(e.currentTarget.value)}
                            />
                            <Form.Checkbox label='Beni hatırla' onChange={(e, val) => onChangeRememberMe(val)} />
                            <Button content='Giriş' primary onClick={() => onClickLogin()} />
                        </Form>
                        <Divider></Divider>
                        <List>
                            <List.Item
                                icon='help'
                                content={<Link to='/test'>Şifreni mi unuttun? Buraya tıkla!</Link>}
                            />
                        </List>
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle' computer={8} mobile={16}>
                        <div>
                            <Header as='h3'>Henüz kayıt olmadın mı?</Header>
                            <Button content='Kayıt ol' icon='signup' size='big' onClick={() => onSignupTrigger()} />
                        </div>
                        <Divider horizontal>Yada</Divider>
                        <div>
                            <Header as='h3'>Sosyal medya hesaplarınla giriş yapabilirsin.</Header>
                            <div>
                                <Button color='google plus'>
                                    <Icon name='google' /> Google
                                </Button>
                                <Button color='linkedin'>
                                    <Icon name='linkedin' /> LinkedIn
                                </Button>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid>
                {!isMobileOrTablet && <Divider vertical ><Icon name="circle" /></Divider>}
            </Modal.Content>
        </Modal>
    );
}
const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = { authLogin };

export default connect(mapStateToProps, mapDispatchToProps)(LoginModalComponent);
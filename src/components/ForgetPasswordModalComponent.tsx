import { useContext, useEffect, useState } from 'react';
import { useSelector, connect } from 'react-redux';
import { Button, Divider, Form, Grid, Header, Icon, List, Message, Modal } from 'semantic-ui-react';
import { useMediaQuery } from 'react-responsive';

import { StateType } from '../states/reducers';
import { authForgetPassword } from '../states/actions/authActions';

import ToastContext, { ToastContextProvider } from '../contexts/ToastContext';

interface ForgetPasswordProps {
    showModal: boolean;
    onClose: Function;
    onSignupClick: Function;
    onLoginClick: Function;
    authForgetPassword:Function;
}

const ForgetPasswordModalComponent = ({...props}:ForgetPasswordProps) => {

    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const auth = useSelector((state: StateType) => state.auth);

    const toastContext = useContext<ToastContextProvider>(ToastContext);

    const isMobileOrTablet = useMediaQuery({ query: '(max-width: 992px)' });

    const onChangeEmail = (value: string) => {
        const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const emailValid = emailRegex.test(value);

        setEmail(value);
        setEmailError(false);
        setEmailValid(emailValid);
    }

    const onCloseModal = () => {
        props.onClose(false);
    }

    const onLoginTrigger = () => {
        props.onLoginClick();
    }

    const onSignupTrigger = () => {
        props.onSignupClick();
    }

    const onForgetPasswordSend = () => {
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

        props.authForgetPassword(email);
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
                            <Button content='Gönder' primary onClick={() => onForgetPasswordSend()} />
                        </Form>
                        <Divider></Divider>
                        <List>
                            <List.Item
                                icon='help'
                                content={<a onClick={()=> onLoginTrigger()}>Giriş yapmak için buraya tıkla.</a>}
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

const mapDispatchToProps = { authForgetPassword };

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPasswordModalComponent);
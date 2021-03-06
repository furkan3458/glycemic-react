import { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Container, Header, Icon, Segment, Form } from 'semantic-ui-react';

import { ActivityStates } from '../states/reducers/authReducer';
import { StateType } from '../states/reducers';

import { validateResetPassParams, authResetPassword, setAuthActivityReset } from '../states/actions/authActions';

import States from '../utils/states';

import NavbarComponent from '../components/NavbarComponent';
import FooterComponent from '../components/FooterComponent';
import SpinnerComponent from '../components/SpinnerComponent';

import ToastContext, { ToastContextProvider } from '../contexts/ToastContext';

interface ResetPasswordProps {
    validateResetPassParams: Function;
    authResetPassword: Function;
    setAuthActivityReset: Function;
}

const ResetPassword = ({ ...props }: ResetPasswordProps) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [key, setKey] = useState("");

    const [pageState, setPageState] = useState<States>(States.INIT);
    const [password, setPassword] = useState("");
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordConfirmValid, setPasswordConfirmValid] = useState(false);
    const [passwordConfirmError, setPasswordConfirmError] = useState(false);

    const toastContext = useContext<ToastContextProvider>(ToastContext);

    const auth = useSelector((state: StateType) => state.auth);

    useEffect(() => {
        handleParameters();
    }, []);

    useEffect(() => {
        if (auth.isLoading && pageState === States.INIT) {
            setPageState(States.PENDING);
        } else if (!auth.isLoading && pageState === States.PENDING) {
            setPageState(States.FINISH);
        }
        else if(!auth.isLoading && auth.passwordReset !== ActivityStates.NULL){
            handleResetResult();
        }
    }, [auth.isLoading]);

    const handleParameters = () => {
        const key = searchParams.get('forgetKey');
        const to = searchParams.get('to');

        const form = {
            email: to,
            forgetKey: key
        }

        setEmail(to!);
        setKey(key!);

        props.validateResetPassParams(form);
    }

    const handleResetResult = () => {
        switch(auth.passwordReset){
            case ActivityStates.OK:
                toastContext.toastSuccess("??ifre ba??ar??yla de??i??tirildi.");
                redirectHome();
                break;
            case ActivityStates.INVALID:
                toastContext.toastError("Bilgileriniz hatal??. L??tfen farkl?? ba??lant?? olu??turun.");
                break;
            case ActivityStates.EXPIRED:
                toastContext.toastError("Girdi??iniz ??ifreler e??le??miyor. L??tfen kontrol edip tekrar deneyin.");
                break;
            case ActivityStates.ALREADY:
                toastContext.toastError("L??tfen en az bir b??y??k harf bir k??????k harf bir say?? ve ??zel karakter i??eren minimum 8 uzunluktan olu??an bir ??ifre giriniz.");
                break;
        }
    }

    const redirectHome = () => {
        navigate("/");
        setPageState(States.INIT);
        props.setAuthActivityReset();
    }

    const onChangePassword = (value: string) => {
        const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
        const passwordValid = passwordRegex.test(value);

        setPassword(value);
        setPasswordError(false);
        setPasswordValid(passwordValid);
    }

    const onChangePasswordConf = (value: string) => {
        const passwordConfirmValid = value === password;

        setPasswordConfirm(value);
        setPasswordConfirmError(false);
        setPasswordConfirmValid(passwordConfirmValid);
    }

    const changePasswordClick = () => {
        if (auth.isLoading) {
            toastContext.toastInfo("L??tfen bekleyiniz...");
            return;
        }
        else if (!passwordValid) {
            let passwordInput = document.querySelector<HTMLInputElement>("#password");
            passwordInput!.focus();
            setPasswordError(true);
            return;
        }
        else if (!passwordConfirmValid) {
            let passwordConfirmInput = document.querySelector<HTMLInputElement>("#password_confirm");
            passwordConfirmInput!.focus();
            setPasswordConfirmError(true);
            return;
        }

        const form:any = {
            email:email,
            forgetKey:key,
            password:password,
            passwordConfirm:passwordConfirm
        }

        props.authResetPassword(form);
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Glycemic Indexer - ??ifreni s??f??rla</title>
            </Helmet>
            <NavbarComponent />
            {
                (pageState === States.PENDING || pageState === States.INIT) &&
                <SpinnerComponent />
            }
            {
                pageState === States.FINISH &&
                <Container>
                    <Segment placeholder>
                        {auth.activity === ActivityStates.OK &&
                            <>
                                <Header textAlign='center'>??ifreni s??f??rla</Header>
                                <Form size={"small"} loading={auth.isLoading} error={auth.isAuthFail}>

                                    <Form.Input id={"password"}
                                        icon='lock'
                                        iconPosition='left'
                                        label='??ifre'
                                        type='password'
                                        placeholder='??ifre'
                                        error={passwordError ? {
                                            content: 'L??tfen ge??erli bir ??ifre girin.',
                                            pointing: 'below',
                                        } : false}
                                        onKeyUp={(e: any) => onChangePassword(e.currentTarget.value)}
                                    />
                                    <Form.Input id={"password_confirm"}
                                        icon='lock'
                                        iconPosition='left'
                                        label='??ifre(Tekrar)'
                                        type='password'
                                        placeholder='??ifre(Tekrar)'
                                        error={passwordConfirmError ? {
                                            content: '??ifreler e??le??medi. L??tfen ??ifreyi tekrar girin.',
                                            pointing: 'below',
                                        } : false}
                                        onKeyUp={(e: any) => onChangePasswordConf(e.currentTarget.value)}
                                    />
                                    <Button fluid content='De??i??tir' primary onClick={() => changePasswordClick()} />
                                </Form>
                            </>
                        }
                        {auth.activity === ActivityStates.NULL &&
                            <>
                                <Header icon>
                                    <Icon name='times circle outline' />
                                    S??f??rlamada bir hata ile kar????la????ld??.
                                </Header>
                                <Button primary onClick={() => navigate("/")}>Ana Sayfaya D??n</Button>
                            </>
                        }
                        {auth.activity === ActivityStates.INVALID &&
                            <>
                                <Header icon>
                                    <Icon name='times circle outline' />
                                    Bu s??f??rlama ba??lant??s?? ge??ersiz.
                                </Header>
                                <Button primary onClick={() => navigate("/")}>Ana Sayfaya D??n</Button>
                            </>
                        }
                        {auth.activity === ActivityStates.EXPIRED &&
                            <>
                                <Header icon>
                                    <Icon name='calendar times outline' />
                                    Bu s??f??rlama ba??lant??s??n??n s??resi ge??mi??.
                                </Header>
                                <Button primary onClick={() => navigate("/")}>Ana Sayfaya D??n</Button>
                            </>
                        }
                        {auth.activity === ActivityStates.ALREADY &&
                            <>
                                <Header icon>
                                    <Icon name='times circle outline' />
                                    Bu ba??lant?? daha ??nceden kullan??lm????.
                                </Header>
                                <Button primary onClick={() => navigate("/")}>Ana Sayfaya D??n</Button>
                            </>
                        }
                    </Segment>
                </Container>
            }
            <FooterComponent />
        </>
    )
}
const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = { validateResetPassParams,authResetPassword, setAuthActivityReset };

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
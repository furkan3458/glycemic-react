import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Container, Header, Icon, Segment, Form } from 'semantic-ui-react';

import { ActivityStates } from '../states/reducers/authReducer';
import { StateType } from '../states/reducers';

import { validateResetPassParams } from '../states/actions/authActions';

import States from '../utils/states';

import NavbarComponent from '../components/NavbarComponent';
import FooterComponent from '../components/FooterComponent';
import SpinnerComponent from '../components/SpinnerComponent';

interface ResetPasswordProps{
    validateResetPassParams:Function;
}

const ResetPassword = ({...props}:ResetPasswordProps) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [pageState, setPageState] = useState<States>(States.INIT);
    const [password, setPassword] = useState("");
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordConfirmValid, setPasswordConfirmValid] = useState(false);
    const [passwordConfirmError, setPasswordConfirmError] = useState(false);

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
    }, [auth.isLoading]);

    const handleParameters = () => {
        const key = searchParams.get('forgetKey');
        const to = searchParams.get('to');

        const form = {
            email: to,
            forgetKey: key
        }
        props.validateResetPassParams(form);
    }

    const onChangePassword = (value: string) => {
        const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
        const passwordValid = passwordRegex.test(value);

        setPassword(value);
        setPasswordError(false);
        setPasswordValid(passwordValid);
    }

    const onChangePasswordConf = (value: string) => {
        const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
        const passwordValid = passwordRegex.test(value);

        setPassword(value);
        setPasswordError(false);
        setPasswordValid(passwordValid);
    }

    const changePasswordClick = () => {

    }

    const ActivationResult = (): JSX.Element => {

        return (
            <>
                {auth.activity === ActivityStates.OK &&
                    <>
                        <Header textAlign='center'>Şifreni sıfırla</Header>
                        <Form size={"small"} loading={auth.isLoading} error={auth.isAuthFail}>

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
                        <Form.Input id={"password"}
                                icon='lock'
                                iconPosition='left'
                                label='Şifre'
                                type='password'
                                placeholder='Şifre(Tekrar)'
                                error={passwordConfirmError ? {
                                    content: 'Lütfen şifreyi tekrar girin.',
                                    pointing: 'below',
                                } : false}
                                onKeyUp={(e: any) => onChangePasswordConf(e.currentTarget.value)}
                            />
                            <Button fluid content='Değiştir' primary onClick={() => changePasswordClick()}></Button>
                        </Form>
                    </>
                }
                {auth.activity === ActivityStates.NULL &&
                    <>
                        <Header icon>
                            <Icon name='times circle outline' />
                            Aktivasyon sırasında bir hata ile karşılaşıldı.
                        </Header>
                        <Button primary onClick={() => navigate("/")}>Ana Sayfaya Dön</Button>
                    </>
                }
                {auth.activity === ActivityStates.INVALID &&
                    <>
                        <Header icon>
                            <Icon name='times circle outline' />
                            Bu aktivasyon bağlantısı geçersiz.
                        </Header>
                        <Button primary onClick={() => navigate("/")}>Ana Sayfaya Dön</Button>
                    </>
                }
                {auth.activity === ActivityStates.EXPIRED &&
                    <>
                        <Header icon>
                            <Icon name='calendar times outline' />
                            Bu aktivasyon bağlantısının süresi geçmiş. 
                        </Header>
                        <Button primary onClick={() => navigate("/")}>Ana Sayfaya Dön</Button>
                    </>
                }
                {auth.activity === ActivityStates.ALREADY &&
                    <>
                        <Header icon>
                            <Icon name='times circle outline' />
                            Bu hesap zaten aktivasyon işlemini tamamladı.
                        </Header>
                        <Button primary onClick={() => navigate("/")}>Ana Sayfaya Dön</Button>
                    </>
                }
            </>
        );
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Glycemic Indexer - Şifreni sıfırla</title>
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
                        <ActivationResult/>
                    </Segment>
                </Container>
            }
            <FooterComponent />
        </>
    )
}
const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = { validateResetPassParams };

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
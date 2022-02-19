import { useContext, useEffect,useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { Button, Divider, Form, Grid, Header, Icon, Message, Modal } from 'semantic-ui-react'

import { validateEmail, authSignup } from '../states/actions/authActions';
import { setCity } from '../states/actions/cityActions';

import { ValidityStates } from '../states/reducers/authReducer';
import { StateType } from '../states/reducers';

import ToastContext, { ToastContextProvider } from '../contexts/ToastContext';
import isEmpty from '../utils/isEmpty';

interface SignupProps {
    showModal: boolean;
    onClose: Function;
    onLoginClick: Function;
    setCity?:Function;
    authSignup?:Function;
    validateEmail?:Function;
}

interface cityOptionProp{
    key:string;
    text:string;
    value:string;
}

const SignupModalComponent = ({ ...props }: SignupProps) => {

    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [name, setName] = useState("");
    const [nameValid, setNameValid] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [surname, setSurname] = useState("");
    const [surnameValid, setSurnameValid] = useState(false);
    const [surnameError, setSurnameError] = useState(false);
    const [citySelect, setCitySelect] = useState("");
    const [cityValid, setCityValid] = useState(false);
    const [cityError, setCityError] = useState(false);

    const [cityOptions, setCityOptions] = useState<cityOptionProp[]>([]);

    const city = useSelector((state: StateType) => state.city);
    const auth = useSelector((state: StateType) => state.auth);

    const toastContext = useContext<ToastContextProvider>(ToastContext);

    useEffect(() => {
        if(isEmpty(city.city))
            props.setCity!();
    }, []);

    useEffect(() => {
        if (auth.isAuthenticated)
            window.location.href = "/";
    }, [auth.isAuthenticated])

    useEffect(() => {
        if(!city.isLoading)
            initializeCityList();

    }, [city.isLoading]);

    useEffect(() => {
        handleEmailValidity();
    }, [auth.emailValidity])
    
    const initializeCityList = () => {
        let options:cityOptionProp[] = [];

        city.city.map((item:any,index:number)=> {
            options.push({
                key:item.id,
                text:item.name,
                value:item.id,
            })
        });

        setCityOptions(options);
    }

    const onChangeEmail = (value:string) => {
        const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const emailValid = emailRegex.test(value);

        setEmail(value);
        setEmailError(false);
        setEmailValid(emailValid);

        if(emailValid){
            setTimeout(() => { checkEmail(value) }, 1 * 500);
        }

    }

    const onChangePassword = (value:string) => {
        const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
        const passwordValid = passwordRegex.test(value);

        setPassword(value);
        setPasswordError(false);
        setPasswordValid(passwordValid);
    }

    const onChangeName = (value:string) => {
        const nameValid = value === "" ? false : true;

        setName(value);
        setNameError(false);
        setNameValid(nameValid);
    }

    const onChangeSurname = (value:string) => {
        const surnameValid = value === "" ? false : true;

        setSurname(value);
        setSurnameError(false);
        setSurnameValid(surnameValid);
    }

    const onChangeCity = (data:any) => {
        console.log(data.value);
        setCitySelect(data.value);
        setCityValid(true);
        setCityError(false);
    }

    const onClickRegister = () =>{
        if (auth.isLoading) {
            toastContext.toastInfo("Lütfen bekleyiniz...");
            return;
        }
        else if (!emailValid) {
            let emailInput = document.querySelector<HTMLInputElement>("#email_signup");
            emailInput!.focus();
            setEmailError(true);
            return;
        }
        else if (!passwordValid) {
            let passwordInput = document.querySelector<HTMLInputElement>("#password_signup");
            passwordInput!.focus();
            setPasswordError(true);
            return;
        }
        else if (!nameValid) {
            let nameInput = document.querySelector<HTMLInputElement>("#name_signup");
            nameInput!.focus();
            setNameError(true);
            return;
        }
        else if (!surnameValid) {
            let surnameInput = document.querySelector<HTMLInputElement>("#surname_signup");
            surnameInput!.focus();
            setSurnameError(true);
            return;
        }
        else if(!cityValid){
            setCityError(true);
            return;
        }

        const form = {
            name:name,
            surname:surname,
            email:email,
            password:password,
            city:{
                id:Number.parseInt(citySelect)
            }
        }

        props.authSignup!(form);
    }

    const checkEmail = (value:string) =>{
        let emailInput = document.querySelector<HTMLInputElement>("#email_signup");
        if (emailInput!.value === value) {
            props.validateEmail!(value);
        }
    }

    const handleEmailValidity = () =>{
        switch(auth.emailValidity.validateState){
            case ValidityStates.IDLE:
                setEmailValid(false);
                setEmailError(false);
                break;
            case ValidityStates.INVALID:
                setEmailValid(false);
                setEmailError(true);
                break;
            case ValidityStates.VALID:
                setEmailValid(true);
                setEmailError(false);
                break;
        }
    }
    
    const onCloseModal = () => {
        props.onClose();
    }

    const onLoginTrigger = () => {
        props.onLoginClick();
    }

    return (
        <Modal
            dimmer={'blurring'}
            open={props.showModal}
            onClose={() => onCloseModal()}
            closeIcon
        >
            <Modal.Content>
                <Form size={"small"} loading={auth.isLoading} error={auth.isAuthFail}>
                    <Grid columns={2} stackable>
                        <Grid.Row>
                            <Grid.Column width={8} style={{ paddingRight: 20 }}>
                                <Form.Input
                                    id={"email_signup"}
                                    icon='at'
                                    iconPosition='left'
                                    label='Email'
                                    placeholder='Email'
                                    error={emailError ? {
                                        content: auth.emailValidity.validateState === ValidityStates.INVALID ?
                                            'Bu e-posta adresi kullanılıyor.' : 'Lütfen geçerli bir e-posta adresi girin.',
                                        pointing: 'below',
                                    } : false}
                                    onKeyUp={(e: any) => onChangeEmail(e.currentTarget.value)}
                                    autoFocus
                                    loading = {auth.emailValidity.isValidating}
                                />
                                <Form.Input
                                    id={"password_signup"}
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
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Form.Input
                                    id={"name_signup"}
                                    icon='user'
                                    iconPosition='left'
                                    label='İsim'
                                    type='text'
                                    placeholder='İsim'
                                    error={nameError ? {
                                        content: 'Lütfen isim girin.',
                                        pointing: 'below',
                                    } : false}
                                    onKeyUp={(e: any) => onChangeName(e.currentTarget.value)}
                                />
                                <Form.Input
                                    id={"surname_signup"}
                                    icon='user'
                                    iconPosition='left'
                                    label='Soyisim'
                                    type='text'
                                    placeholder='Soyisim'
                                    error={surnameError ? {
                                        content: 'Lütfen şifre girin.',
                                        pointing: 'below',
                                    } : false}
                                    onKeyUp={(e: any) => onChangeSurname(e.currentTarget.value)}
                                />
                                <Form.Select
                                    fluid
                                    label='Şehir'
                                    options={cityOptions}
                                    placeholder='Şehir'
                                    onChange={(e,value)=> onChangeCity(value)}
                                    error={cityError ? {
                                        content: 'Lütfen bir şehir seçin.',
                                        pointing: 'below',
                                    } : false}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row textAlign='left'>
                            <Grid.Column width={16} textAlign='center'>
                                <Form.Field>
                                    <Message warning visible={true}>
                                        <Icon name='help' />
                                        Zaten bir hesabın var mı?&nbsp;<a href='#' onClick={() => onLoginTrigger()}> Giriş yap.</a>
                                    </Message>
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row centered>
                            <Grid.Column width={8}>
                                <Button content='Kaydol' primary fluid onClick={() => onClickRegister()}/>
                            </Grid.Column>
                        </Grid.Row>
                        <Divider></Divider>
                        <Grid.Row centered>
                            <Grid.Column verticalAlign='middle' width={8}>
                                <div>
                                    <Header as='h3'>Sosyal medya hesaplarınla hızlıca kayıt olabilirsin.</Header>
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
                        </Grid.Row>
                    </Grid>
                </Form>
            </Modal.Content>
        </Modal>
    )
}
const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {setCity, authSignup, validateEmail};

export default connect(mapStateToProps, mapDispatchToProps)(SignupModalComponent);
import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Divider, Form, Grid, Header, Icon, List, Message, Modal } from 'semantic-ui-react'

interface SignupProps {
    showModal: boolean;
    onClose: Function;
    onLoginClick: Function;
}

const SignupModalComponent = ({ ...props }: SignupProps) => {

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
                <Grid columns={2} stackable centered>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Form size={"small"}>
                                <Form.Input
                                    icon='at'
                                    iconPosition='left'
                                    label='Email'
                                    placeholder='Email'
                                />
                                <Form.Input
                                    icon='lock'
                                    iconPosition='left'
                                    label='Şifre'
                                    type='password'
                                    placeholder='Şifre'
                                />
                                <Form.Input
                                    icon='user'
                                    iconPosition='left'
                                    label='İsim'
                                    type='text'
                                    placeholder='İsim'
                                />
                                <Form.Input
                                    icon='lock'
                                    iconPosition='left'
                                    label='Soyisim'
                                    type='text'
                                    placeholder='Soyisim'
                                />
                                <Form.Input
                                    icon='lock'
                                    iconPosition='left'
                                    label='Şifre'
                                    type='password'
                                    placeholder='Şifre'
                                />
                                <Form.Field>
                                    <Button content='Giriş' primary />
                                    <Message warning visible={true}>
                                        <Icon name='help' />
                                        Zaten bir hesabın var mı?&nbsp;<a href='#' onClick={() => onLoginTrigger()}> Giriş yap.</a>
                                    </Message>
                                </Form.Field>
                            </Form>
                        </Grid.Column>
                        <Grid.Column verticalAlign='middle' width={8}>
                            <Header as='h3'>Devam</Header>
                        </Grid.Column>
                        <Divider vertical>Or</Divider>
                    </Grid.Row>
                    <Divider></Divider>
                    <Grid.Row>
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

            </Modal.Content>
        </Modal>
    )
}

export default SignupModalComponent
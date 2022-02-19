import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Container, Header, Icon, Segment } from 'semantic-ui-react';

import { StateType } from '../states/reducers';

import { setActivateAuth } from '../states/actions/authActions';

import { ActivationStates } from '../states/reducers/authReducer';
import States from '../utils/states';

import NavbarComponent from '../components/NavbarComponent';
import FooterComponent from '../components/FooterComponent';
import SpinnerComponent from '../components/SpinnerComponent';

interface ActivateProps {
    setActivateAuth: Function;
};

const Activation = ({ ...props }: ActivateProps) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [pageState, setPageState] = useState<States>(States.INIT);

    const auth = useSelector((state: StateType) => state.auth);

    useEffect(() => {
        handleSearchActivateParameters();
    }, []);

    useEffect(() => {
        if (auth.isLoading && pageState === States.INIT) {
            setPageState(States.PENDING);
        } else if (!auth.isLoading && pageState === States.PENDING) {
            setPageState(States.FINISH);
        }
    }, [auth.isLoading]);

    const handleSearchActivateParameters = () => {
        const key = searchParams.get('activateKey');
        const to = searchParams.get('to');

        const form = {
            email: to,
            activateKey: key
        }
        props.setActivateAuth(form);
    }

    const ActivationResult = (): JSX.Element => {

        return (
            <>
                {auth.activation === ActivationStates.OK &&
                    <>
                        <Header icon>
                            <Icon name='thumbs up outline' />
                            Aktivasyon tamamlandı.
                        </Header>
                        <Button primary onClick={() => navigate("/")}>Ana Sayfaya Dön</Button>
                    </>
                }
                {auth.activation === ActivationStates.NULL &&
                    <>
                        <Header icon>
                            <Icon name='times circle outline' />
                            Aktivasyon sırasında bir hata ile karşılaşıldı.
                        </Header>
                        <Button primary onClick={() => navigate("/")}>Ana Sayfaya Dön</Button>
                    </>
                }
                {auth.activation === ActivationStates.INVALID &&
                    <>
                        <Header icon>
                            <Icon name='times circle outline' />
                            Bu aktivasyon bağlantısı geçersiz.
                        </Header>
                        <Button primary onClick={() => navigate("/")}>Ana Sayfaya Dön</Button>
                    </>
                }
                {auth.activation === ActivationStates.EXPIRED &&
                    <>
                        <Header icon>
                            <Icon name='calendar times outline' />
                            Bu aktivasyon bağlantısının süresi geçmiş. 
                        </Header>
                        <Button primary onClick={() => navigate("/")}>Ana Sayfaya Dön</Button>
                    </>
                }
                {auth.activation === ActivationStates.ALREADY &&
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

    /**
     * 
     */
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Glycemic Indexer - Aktivasyon</title>
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
    );
}
const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = { setActivateAuth };

export default connect(mapStateToProps, mapDispatchToProps)(Activation);
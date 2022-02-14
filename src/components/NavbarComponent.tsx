import React, { useRef, useEffect, useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { Menu, Container, Grid, Dropdown, Icon, Image, Button, Modal, Form, Divider, Header, List } from 'semantic-ui-react'

import { StateType } from '../states/reducers';

//import { logoutAction } from '../states/actions/authActions';

import AuthContext, { AuthContextProvider } from '../contexts/AuthContext';
import { ResultCategory } from '../models/ICategory';

import LoginModalComponent from './LoginModalComponent';
import SignupModalComponent from './SignupModalComponent';

const NavbarComponent = ({ ...props }: any) => {

    const navigate = useNavigate();

    const [activeItem, setActiveItem] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setshowSignupModal] = useState(false);

    const authContext = useContext<AuthContextProvider>(AuthContext);

    const category = useSelector((state: StateType) => state.category);

    const handleNavigateClick = (item: string, path: string) => {
        setActiveItem(item);
        navigate(path);
    }

    const openLoginModal = () => {
        setShowLoginModal(true);
        setshowSignupModal(false);
    }

    const openSignupModal = () => {
        setShowLoginModal(false);
        setshowSignupModal(true);
    }

    const onCloseModal = () => {
        setShowLoginModal(false);
        setshowSignupModal(false);
    }

    return (
        <>
            {
                authContext.authType === "guest" ? 
                <>
                    <LoginModalComponent showModal={showLoginModal} onClose={()=> onCloseModal()} onSignupClick={() => openSignupModal()}/>
                    <SignupModalComponent showModal={showSignupModal} onClose={()=> onCloseModal()} onLoginClick={() => openLoginModal()}/>
                </> : <></>
            }
            <Menu borderless={true} size='massive' inverted fluid>
                <Grid container className="fluid">
                    <Grid.Row only='computer'>
                        <Menu.Item name='home' active={activeItem === 'home'} onClick={() => handleNavigateClick("home", "/")} link>
                            <Image size='mini' src='/logo192.png' style={{ marginRight: '1.5em' }} />
                            Glycemic Indexer
                        </Menu.Item>
                        <Dropdown item simple text='Türler'>
                            <Dropdown.Menu>
                                {category.categories.map((item: ResultCategory, index: number) => (
                                    <Dropdown.Item key={index} active={activeItem === item.url} onClick={() => handleNavigateClick(item.url!, "/category/" + item.url)}>{item.name}</Dropdown.Item>
                                ))
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        <Menu.Item name='popular' active={activeItem === 'popular'} onClick={() => handleNavigateClick("popular", "/high_index")} link>
                            Yüksek Indeksler
                        </Menu.Item>
                        {
                            authContext.authType === "guest" ?
                                <>
                                    <Menu.Item name='login' active={activeItem === 'login'} position="right">
                                        <Button primary onClick={() => openLoginModal()}>Giriş</Button>
                                    </Menu.Item>
                                    <Menu.Item name='signup' active={activeItem === 'signup'}>
                                        <Button primary onClick={() => openSignupModal()}>Üye ol</Button>
                                    </Menu.Item>
                                </> :
                                <>
                                <Menu.Item position='right'>
                                    <Dropdown item simple text={authContext.authenticatedUser.fullname}>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleNavigateClick("insert", "/insert")}>Index ekle</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleNavigateClick("popular", "/settings")}>Ayarlar</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleNavigateClick("popular", "/logout")}>Çıkış Yap</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Menu.Item>
                                </>
                        }
                    </Grid.Row>
                    <Grid.Row only='tablet mobile'>
                        <Menu.Item name='home' active={activeItem === 'home'} onClick={() => handleNavigateClick("home", "/")} >
                            <Image size='mini' src='/logo192.png' />
                        </Menu.Item>
                        {
                            authContext.authType === "guest" ?
                                <>
                                    <Menu.Item name='login' active={activeItem === 'login'} position="right" onClick={() => openLoginModal()}>
                                        <Icon name='user' />
                                    </Menu.Item>
                                    <Menu.Item name='signup' active={activeItem === 'signup'} onClick={() => openSignupModal()}>
                                        <Icon name='user plus' />
                                    </Menu.Item>
                                </> :
                                <>
                                    <Dropdown item text={authContext.authenticatedUser.fullname} position="right">
                                        <Dropdown.Menu>
                                            <Dropdown.Item><Link to="/insert">Index ekle</Link></Dropdown.Item>
                                            <Dropdown.Item><Link to="/settings">Ayarlar</Link></Dropdown.Item>
                                            <Dropdown.Item><Link to="/logout">Çıkış Yap</Link></Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                        }
                        <Dropdown item icon="th" direction='left'>
                            <Dropdown.Menu>
                                {category.categories.map((item: ResultCategory, index: number) => (
                                    <Dropdown.Item key={index} active={activeItem === item.url} onClick={() => handleNavigateClick(item.url!, "/category/" + item.url)}>{item.name}</Dropdown.Item>
                                ))
                                }
                                <Dropdown.Item>
                                    <i className='dropdown icon' />
                                    <span className='text'>Listeler</span>
                                    <Dropdown.Menu>
                                        <Dropdown.Item active={activeItem === 'desert'} onClick={() => handleNavigateClick("desert", "/category/high")}>Yüksek Indeksler</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Grid.Row>
                </Grid>
            </Menu>
        </>
    );
}

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {};

export default /*connect(mapStateToProps, mapDispatchToProps)*/(NavbarComponent);

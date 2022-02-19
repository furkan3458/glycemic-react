import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { Menu, Grid, Dropdown, Icon, Image, Button, Label } from 'semantic-ui-react'

import { StateType } from '../states/reducers';

import { authLogout } from '../states/actions/authActions';

import AuthContext, { AuthContextProvider } from '../contexts/AuthContext';
import SidebarContext, { SidebarContextProvider } from '../contexts/SidebarContext';

import { ResultCategory } from '../models/ICategory';

import LoginModalComponent from './LoginModalComponent';
import SignupModalComponent from './SignupModalComponent';

interface NavbarProps {
    authLogout?: Function;
}

const NavbarComponent = ({ ...props }: NavbarProps) => {

    const navigate = useNavigate();

    const [activeItem, setActiveItem] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setshowSignupModal] = useState(false);

    const authContext = useContext<AuthContextProvider>(AuthContext);
    const sidebarContext = useContext<SidebarContextProvider>(SidebarContext);

    const category = useSelector((state: StateType) => state.category);
    const list = useSelector((state: StateType) => state.list);

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

    const onLogout = () => {
        const token = localStorage.getItem("token");
        props.authLogout!({ token: token });
    }

    //We haven't used or needed it yet.
    const showSidebar = () => {
        sidebarContext.handleSidebar(true);
    }

    return (
        <>
            {
                authContext.authType === "guest" ?
                    <>
                        <LoginModalComponent showModal={showLoginModal} onClose={() => onCloseModal()} onSignupClick={() => openSignupModal()} />
                        <SignupModalComponent showModal={showSignupModal} onClose={() => onCloseModal()} onLoginClick={() => openLoginModal()} />
                    </> : <></>
            }
            <Menu borderless={true} size='massive' inverted fluid>
                <Grid container className="fluid">
                    <Grid.Row only='computer'>
                        <Menu.Item name='home' active={activeItem === 'home'} onClick={() => handleNavigateClick("home", "/")} link>
                            <Image size='mini' src='/logo512.png' style={{ marginRight: '1.5em' }} />
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
                        <Menu.Item name='list' active={activeItem === 'list'} position="right" onClick={() => handleNavigateClick("list", "/list")} link><Icon name="clipboard list"><Label color='red' style={{top:10}} floating>{list.foodCount}</Label></Icon></Menu.Item>
                        {
                            authContext.authType === "guest" ?
                                <>
                                    <Menu.Item name='login' active={activeItem === 'login'} >
                                        <Button primary onClick={() => openLoginModal()}>Giriş</Button>
                                    </Menu.Item>
                                    <Menu.Item name='signup' active={activeItem === 'signup'}>
                                        <Button primary onClick={() => openSignupModal()}>Üye ol</Button>
                                    </Menu.Item>
                                </> :
                                <>
                                    <Menu.Item>
                                        <Dropdown item simple text={authContext.authenticatedUser.fullname}>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleNavigateClick("insert", "/insert")}>İndeks ekle</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleNavigateClick("my-indexes", "/my-indexes")}>Eklediklerim</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleNavigateClick("popular", "/settings")}>Ayarlar</Dropdown.Item>
                                                <Dropdown.Item onClick={() => onLogout()}>Çıkış Yap</Dropdown.Item>
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
                        <Menu.Item name='list' active={activeItem === 'list'} position="right" onClick={() => handleNavigateClick("list", "/list")} link><Icon name="clipboard list"><Label color='red' floating style={{top:10}}>{list.foodCount}</Label></Icon></Menu.Item>
                        {
                            authContext.authType === "guest" ?
                                <>
                                    <Menu.Item name='login' active={activeItem === 'login'} onClick={() => openLoginModal()}>
                                        <Icon name='user' />
                                    </Menu.Item>
                                    <Menu.Item name='signup' active={activeItem === 'signup'} onClick={() => openSignupModal()}>
                                        <Icon name='user plus' />
                                    </Menu.Item>
                                </> :
                                <>
                                    <Dropdown item text={authContext.authenticatedUser.fullname}>
                                        <Dropdown.Menu>
                                            <Dropdown.Item><Link to="/insert">İndeks ekle</Link></Dropdown.Item>
                                            <Dropdown.Item><Link to="/settings">Ayarlar</Link></Dropdown.Item>
                                            <Dropdown.Item><Link to="/logout">Çıkış Yap</Link></Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                        }
                        <Dropdown item icon="th" direction='left' >
                            <Dropdown.Menu>
                                {category.categories.map((item: ResultCategory, index: number) => (
                                    <Dropdown.Item key={index} active={activeItem === item.url} onClick={() => handleNavigateClick(item.url!, "/category/" + item.url)}>{item.name}</Dropdown.Item>
                                ))
                                }
                                <Dropdown.Item>
                                    <Dropdown text="Listeler">
                                        <Dropdown.Menu>
                                            <Dropdown.Item active={activeItem === 'desert'} onClick={() => handleNavigateClick("desert", "/category/high")}>Yüksek Indeksler</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
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

const mapDispatchToProps = { authLogout };

export default connect(mapStateToProps, mapDispatchToProps)(NavbarComponent);

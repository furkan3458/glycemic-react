import { Container, Segment, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Error = () => {

    return (
        <Container>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Glycemic Indexer - Sayfa bulunamadı...</title>
            </Helmet>
            <Grid columns={2} centered style={{height:100+"vh"}}>
                <Grid.Row verticalAlign='middle' only='computer'>
                    <Grid.Column width={5}>
                        <div className="loader animation-7">
                            <div className="shape shape1"></div>
                            <div className="shape shape2"></div>
                            <div className="shape shape3"></div>
                            <div className="shape shape4"></div>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={7}>
                        <div className="message-box">
                            <h1>404</h1>
                            <p>Sayfa bulunamadı!</p>
                            <div className="d-flex align-items-center">
                                <Link to="/" className="ui animated fade large button" style={{display:"inline-block"}}>
                                    <div className="visible content">Ana sayfa</div>
                                    <div className="hidden content">
                                        <i className="right arrow icon"></i>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row verticalAlign='middle' only='tablet mobile'>
                    <Grid.Column width={6} >
                        <div className="loader animation-7">
                            <div className="shape shape1"></div>
                            <div className="shape shape2"></div>
                            <div className="shape shape3"></div>
                            <div className="shape shape4"></div>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={6} textAlign='center'>
                        <div className="message-box">
                            <h1>404</h1>
                            <p>Sayfa bulunamadı!</p>
                            <div className="d-flex align-items-center">
                                <Link to="/" className="ui animated fade large button" style={{display:"inline-block"}}>
                                    <div className="visible content">Ana sayfa</div>
                                    <div className="hidden content">
                                        <i className="right arrow icon"></i>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
}

export default Error;

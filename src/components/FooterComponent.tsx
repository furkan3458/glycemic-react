import { Segment, Grid, List, Header, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const FooterComponent = () => {
    return (
        <footer>
            <Segment inverted vertical style={{ padding: '5em 0em' }} className="footer">
                <Container>
                    <Grid divided inverted stackable>
                        <Grid.Row>
                            <Grid.Column width={3}>
                                <Header inverted as='h4' content='Hakkımızda' />
                                <List link inverted>
                                    <List.Item><Link to="/sitemap">Site Haritası</Link></List.Item>
                                    <List.Item><Link to="/contactus">Bize Ulaşın</Link></List.Item>
                                    <List.Item><Link to="/donate">Katkıda Bulun</Link></List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Header inverted as='h4' content='Servisler' />
                                <List link inverted>
                                    <List.Item><Link to="/rss">RSS</Link></List.Item>
                                    <List.Item><Link to="/faq">FAQ</Link></List.Item>
                                    <List.Item><Link to="/mailservice">Bültene kayıt olun</Link></List.Item>
                                    <List.Item><Link to="/cookie">Çerez politikası</Link></List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={7}>
                                <Header as='h4' inverted>
                                    Glycemic Indexer
                                </Header>
                                <p>
                                    Glycemic Indexer kuruluşu besin içerisindeki glisemik oranlarına ulaşabileceğiniz ücretsiz bir servistir.
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Segment>
        </footer>
    );
};

export default FooterComponent;

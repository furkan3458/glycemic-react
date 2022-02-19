import { Grid } from 'semantic-ui-react';

const SpinnerComponent = () =>{
    return (
        <Grid centered={true} style={{height:100+"vh"}}>
            <Grid.Row verticalAlign='middle'>
                <Grid.Column width={3} textAlign='center'>
                    <div className="loader animation-5">
                        <div className="shape shape1"></div>
                        <div className="shape shape2"></div>
                        <div className="shape shape3"></div>
                        <div className="shape shape4"></div>
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default SpinnerComponent;

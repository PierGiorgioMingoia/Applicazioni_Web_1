import React from 'react';
import { Row, Container, Col, Card, Spinner } from 'react-bootstrap';
import moment from 'moment';
import API from './API';


class PastRentals extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: false, csrfToken: props.csrfToken, errorMsg: '' };
        this.rentals = [];
        //this.handleErrors = props.handleErrors;
    }


    componentDidMount() {
        this.loadPastRentals();
    }

    loadPastRentals = () => {
        this.setState({ loading: true }, () => {
            API.getPastUserRental().then((r) => {
                this.rentals = [...r];
                this.setState({ loading: false })
            }).catch(
                //TODO ERROR
                (errorObj) => { this.props.handleErrors(errorObj) }
            )
        });

    }

    render() {

        if (this.state.loading)
            return <Spinner animation="border" variant="dark" />;
        else {
            return <>
                <Container>
                    <Row>
                        <Col md={12} >
                            <Col className="text-center pageTitle">
                                <h3 className="rentalsTitle font-weight-light">My past Rentals</h3>
                            </Col>
                            <Row>
                                {
                                    this.rentals.length > 0 ?
                                        this.rentals.map((r) =>
                                            <Col md={4} key={r.id}>
                                                <PastRentalCard rental={r} key={r.id}>
                                                </PastRentalCard>
                                            </Col>
                                        )
                                        : <h3>No Rentals</h3>
                                }
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </>
        }
    }
}

function PastRentalCard(props) {
    return <Card className='PastRentalCard' style={{ width: '18rem' }}>
        <Card.Img variant="top" />
        <Card.Body>
            <Card.Title> Rental: {props.rental.id} </Card.Title>
            <Card.Text>
                Car: {props.rental.idCar} <br />
                Start Date: {moment(props.rental.startDate).format('LL')} <br />
                End Date: {moment(props.rental.endDate).format('LL')} <br />
                Price: {props.rental.price}€ <br />
                Km/d: {props.rental.km} <br />
                Insurance: {props.rental.insurance ? 'Yes' : 'No'} <br />
                More Driver: {props.rental.moreDriver ? 'Yes' : 'No'}
            </Card.Text>
        </Card.Body>
        <Card.Footer>
            <small className="text-muted">The best rental in the world</small>
        </Card.Footer>
    </Card>
}

export { PastRentals };
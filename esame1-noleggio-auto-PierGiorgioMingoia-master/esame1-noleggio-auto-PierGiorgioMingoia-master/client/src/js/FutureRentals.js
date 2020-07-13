import React from 'react';
import { Row, Container, Col, Card, Spinner, Button } from 'react-bootstrap';
import moment from 'moment';
import API from './API';

class FutureRentals extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: false, csrfToken: props.csrfToken, rentals: [] };
        this.handleErrors = props.handleErrors;
    }

    componentDidMount() {
        this.loadFutureRentals();
    }

    loadFutureRentals = () => {
        this.setState({ loading: true }, () => {
            API.getFutureUserRental().then((r) => {
                this.setState({ rentals: r, loading: false })
            }).catch(
                //TODO ERROR
                (errorObj) => { this.handleErrors(errorObj) }
            )
        })
    }

    deleteRental = (rental) => {

        const c = window.confirm("Are you sure?");
        if (c) {
            API.deleteRental(rental, this.state.csrfToken).then(
                () => this.loadFutureRentals()
            ).catch(
                //TODO ERROR
                (errorObj) => { this.handleErrors(errorObj) }
            )
        } else {

        }

    }

    render() {

        if (this.state.loading)
            return <Spinner animation="border" variant="dark" />;
        else {
            return <>
                <Container>
                    <Row>
                        <Col md={12}>
                            <Col className="text-center pageTitle">
                                <h3 className="rentalsTitle font-weight-light">My future Rentals</h3>
                            </Col>
                            <Row>
                                {
                                    this.state.rentals.length > 0 ?
                                        this.state.rentals.map((r) =>
                                            <Col md={4} key={r.id}>
                                                <FutureRentalCard rental={r} key={r.id} deleteRental={this.deleteRental}>
                                                </FutureRentalCard>
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


function FutureRentalCard(props) {
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
            <Button variant="danger" onClick={() => props.deleteRental(props.rental)}>Cancel reservation</Button>
        </Card.Body>
        <Card.Footer>
            <small className="text-muted">The best rental in the world</small>
        </Card.Footer>
    </Card>
}


export { FutureRentals }
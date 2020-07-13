import React from 'react';
import { Row, Container, Col, Form, Button, Modal, Spinner, Card } from 'react-bootstrap';
import moment from 'moment';
import API from './API';
import PaymentForm from './CreditCard';
import { SuccesfulPayment } from './ErrorMsg';

class InteractiveConfiguration extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: props.user, nAvaiableCars: -1, csrfToken: props.csrfToken,
            loading: false,
            updating: false,
            successMsg: '',
            filters: {
                startDate: moment().add(1, 'days').format("YYYY-MM-DD"),
                endDate: moment().add(7, 'days').format("YYYY-MM-DD"),
                category: 'A',
                moreDriver: 0,
                insurance: false,
                age: 25,
                km: 60,
            }
        }

        this.defaulFilter = {
            startDate: moment().add(1, 'days').format("YYYY-MM-DD"),
            endDate: moment().add(8, 'days').format("YYYY-MM-DD"),
            category: 'A',
            moreDriver: 0,
            insurance: false,
            age: 25,
            km: 60,
        }
        this.price = computePrice(this.state.filters, this.state.user, this.lowN);
        this.rental = {
            category: this.state.filters.category,
            startDate: this.state.filters.startDate,
            endDate: this.state.filters.endDate,
            price: this.price,
            insurance: this.state.filters.insurance,
            moreDriver: this.state.filters.moreDriver,
            km: this.state.filters.moreDriver,
        };

    }
    //Setting deafault state and caluculate initial price
    componentDidMount() {
        this.setState({ filters: this.defaulFilter }, () => {
            this.loadPastRentals(() => this.updateAvaiableCars(this.state.filters));
        });
    }

    /*Update fields and requesting the server*/
    updateField = (name, value) => {
        if (this.form.checkValidity()) {
            this.setState((prevState) => {
                let filters = Object.assign({}, prevState.filters)
                filters[name] = value;
                if (moment(filters.endDate).isBefore(moment(filters.startDate))) {
                    filters.endDate = filters.startDate;
                }
                return { filters }
            }, () => {
                this.updateAvaiableCars(this.state.filters);
            })
        } else {
            this.form.reportValidity();
            this.setState((prevState) => {
                let filters = Object.assign({}, prevState.filters)
                filters[name] = value;
                if (moment(filters.endDate).isBefore(moment(filters.startDate))) {
                    filters.endDate = filters.startDate;
                }
                return { filters }
            }, () => {
                this.setState({ nAvaiableCars: -1 });
            });
        }

    }

    /*Number of avaiable cars from the server*/
    updateAvaiableCars = (filters) => {
        this.setState({ updating: true });
        const filter = { category: filters.category, startDate: filters.startDate, endDate: filters.endDate };
        API.getAvaiableCars(filter, this.state.csrfToken).then((avaiableObj) => {
            this.setState({ nAvaiableCars: avaiableObj.n, updating: false }, () => {
                this.price = computePrice(this.state.filters, this.state.user, avaiableObj.lowN);
                this.setState({ price: this.price }, () => {
                    this.rental = {
                        category: this.state.filters.category,
                        startDate: this.state.filters.startDate,
                        endDate: this.state.filters.endDate,
                        price: this.price,
                        insurance: this.state.filters.insurance,
                        moreDriver: this.state.filters.moreDriver,
                        km: this.state.filters.km,
                    };
                });
            });
        }).catch(
            (errorObj) => { this.props.handleErrors(errorObj) }
        );
    }

    //Accept payment and crate a new Rental
    insertNewRental = (creditCard) => {
        API.checkCreditCard(creditCard, this.price, this.state.csrfToken).then((cardObj) => {
            API.insertNewRental(this.rental, this.state.csrfToken).then((rentObj) => {
                this.updateAvaiableCars(this.state.filters);
                this.setState({ successMsg: 'Rental successfully created' });
            }).catch(
                (errorObj) => { this.props.handleErrors(errorObj) }
            )
        }).catch(
            (errorObj) => { this.props.handleErrors(errorObj) }
        )
    }

    //Load users past rental for the discount
    loadPastRentals = (callback) => {
        this.setState({ loading: true }, () => {
            API.getPastUserRental().then((r) => {
                this.setState({ user: { userID: this.state.user.userID, nRental: r.length }, loading: false }, () => {
                    callback();
                });

            }).catch(
                (errorObj) => { this.props.handleErrors(errorObj) }
            )
        });
    }

    validateForm = (event) => {
        event.preventDefault();
    }

    //Delete the success msg
    cancelSuccessMsg = () => {
        this.setState({ successMsg: '' });
    }

    render() {
        if (this.state.loading)
            return <Spinner animation="border" variant="dark" />;
        else {
            return <>
                <Container>
                    <SuccesfulPayment successMsg={this.state.successMsg} cancelSuccessMsg={this.cancelSuccessMsg}></SuccesfulPayment>
                    <Row>
                        <Col md={9}>
                            <div style={{marginTop:"5px"}} className="text-center">
                                <h3 className="font-weight-light"> Enter the details of your rental</h3>
                            </div>
                            <Form method={'POST'} onSubmit={this.validateForm} ref={form => this.form = form}>
                                <Form.Group controlid="startDate">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date" name="startDate" onChange={(ev) => {
                                        this.updateField(ev.target.name, ev.target.value);
                                    }}
                                        min={moment().add(1, 'days').format("YYYY-MM-DD")} required
                                        value={this.state.filters.startDate} />
                                </Form.Group>
                                <Form.Group controlid="endDate">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="date" name="endDate" onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} min={this.state.filters.startDate} value={this.state.filters.endDate} required />
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Category select</Form.Label>
                                    <Form.Control value={this.state.filters.category} as="select" name='category' onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                                        <option value='A'>A</option>
                                        <option value='B'>B</option>
                                        <option value='C'>C</option>
                                        <option value='D'>D</option>
                                        <option value='E'>E</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlid="age">
                                    <Form.Label>Age of the driver</Form.Label>
                                    <Form.Control type="number" placeholder="Enter age of the driver" name='age' value={this.state.filters.age} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} min={18} required />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Row controlid="km/day">
                                        <Col>
                                            <Form.Label>Number of km/day</Form.Label>
                                            <Form.Control type="number" placeholder="Enter number of km/day" name='km' value={this.state.filters.km} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} min={0} required />
                                        </Col>
                                        <Col>
                                            <Form.Label>Number of additional drivers</Form.Label>
                                            <Form.Control type="number" placeholder="Enter number of additional driver" name='moreDriver' value={this.state.filters.moreDriver} min={0} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} required />
                                        </Col>
                                    </Form.Row>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Check inline label="Insurance" type={"checkbox"} name='insurance' onChange={(ev) => this.updateField(ev.target.name, ev.target.checked)} checked={this.state.filters.insurance} />
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col md={3}>
                            <Row>
                                <Card className='ConfigCard'>
                                    <Card.Body>
                                        <Card.Title>
                                            Rent Now
                                        </Card.Title>
                                        <NumberOfCars configCard={this.configCard} cars={this.state.nAvaiableCars} price={this.state.price} updating={this.state.updating}></NumberOfCars>
                                        {this.state.nAvaiableCars > 0 && !this.state.updating ?
                                            <PaymentModal payment={this.insertNewRental}></PaymentModal>
                                            : <h3>No car avaiable</h3>
                                        }
                                    </Card.Body>
                                    <Card.Footer>
                                        <small className="text-muted">The best car in the world</small>
                                    </Card.Footer>
                                </Card>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </>
        }
    }
}

/*MODAL FOR Payment*/
const PaymentModal = (props) => {
    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Accept configuration
      </Button>
            <Modal animation={false} show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Payment method</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PaymentForm payment={props.payment}></PaymentForm>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </>
    )
}


function NumberOfCars(props) {
    if (props.updating)
        return <><Spinner animation="border" variant="dark" /></>;
    else if (props.cars === -1) {
        return <Card.Text>
            Please insert correct value
        </Card.Text>
    }
    else
        return <Card.Text> Number of avaiable cars: {props.cars} <br /> Price: {props.price}€</Card.Text>

}


function computePrice(filters, customer, lowN) {
    let gg = 1;
    gg = gg + moment(filters.endDate).diff(moment(filters.startDate), 'days');
    let p = 0;
    switch (filters.category) {
        case 'A':
            p = gg * 80;
            break;
        case 'B':
            p = gg * 70;
            break;
        case 'C':
            p = gg * 60;
            break;
        case 'D':
            p = gg * 50;
            break;
        case 'E':
            p = gg * 40;
            break;
        default:
            p = gg * 80;
            break;
    }

    switch (true) {
        case (filters.km < 50):
            p = p * 0.95;
            break;
        case (filters.km > 149):
            p = p * 1.05;
            break;
        default:
            break;
    }

    switch (true) {
        case filters.age < 25:
            p = p * 1.05;
            break;
        case filters.age > 65:
            p = p * 1.10;
            break;
        default:
            break;
    }

    if (filters.moreDriver > 0)
        p = p * 1.15;
    if (filters.insurance)
        p = p * 1.20;
    if (lowN)
        p = p * 1.10;
    if (customer.nRental >= 3) {
        p = p * 0.90;
    }
    return p.toFixed(2);
}

export { InteractiveConfiguration };
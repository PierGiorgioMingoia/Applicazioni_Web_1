import React from 'react';
import { Button, Form } from 'react-bootstrap';


export default class PaymentForm extends React.Component {
    state = {
        cvc: '',
        name: '',
        number: '',
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;

        this.setState({ [name]: value });
    }

    payment = (event) => {
        event.preventDefault();
        /*FORM CHECK TODO*/
        if (this.form.checkValidity()) {
            let creditCard = {
                cvc: this.state.cvc,
                name: this.state.name,
                number: this.state.number,
            };
            this.props.payment(creditCard);
        }
        else {
            this.form.reportValidity();
        }
    }

    validateForm = (event) => {
        event.preventDefault();
    }

    render() {
        return (
            <Form className='form' method={'POST'} onSubmit={this.validateForm} ref={form => this.form = form}>
                <Form.Group>
                <Form.Label>Card Number</Form.Label>
                <Form.Control
                    type="tel"
                    name="number"
                    placeholder="Card Number"
                    onChange={this.handleInputChange}
                    required
                />
                <Form.Label>CVC</Form.Label>
                <Form.Control
                    type="tel"
                    name="cvc"
                    placeholder="CVC"
                    onChange={this.handleInputChange}
                    required
                />
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                    type="tel"
                    name="name"
                    placeholder="Full Name"
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                    required
                />
                </Form.Group>
                <Button type='button' variant="primary"
                    onClick={this.payment}>
                    Confirm Payment
                            </Button>
            </Form>
        );
    }
}
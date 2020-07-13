import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import { OptionalErrorMsg } from './ErrorMsg';
import API from './API';


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loginSuccess: false, wrongLoginMsg: false, doingLogin: false, }
    }

    doLoginCall = (user, pass) => {
        this.setState({ doingLogin: true });
        API.userLogin(user, pass).then((userObj) => {
            this.setState({ loginSuccess: true });
            this.props.setLoggedInUser(userObj);
        }).catch(
            () => { this.setState({ wrongLoginMsg: true, doingLogin: false }) }
        );
    }

    cancelLoginErrorMsg = () => {
        this.setState({ wrongLoginMsg: false, doingLogin: false })
    }

    render() {
        if (this.state.loginSuccess) {
            return <Redirect to={{
                pathname: '/user',
                state: { isLoggedIn: true },
            }} />;
        } else {
            return <>
                <OptionalErrorMsg errorMsg={this.state.wrongLoginMsg ? 'Wrong username and/or password' : ''}
                    cancelErrorMsg={this.cancelLoginErrorMsg} />
                <LoginForm doLoginCall={this.doLoginCall} doingLogin={this.state.doingLogin} />
            </>
        }
    }

}

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: 'mario', password: '1234' };

    }

    /*form field*/
    updateField = (name, value) => {
        this.setState({ [name]: value });
    }

    doLogin = (event) => {
        event.preventDefault();
        if (this.form.checkValidity()) {
            this.props.doLoginCall(this.state.username, this.state.password);
        } else {
            this.form.reportValidity();
        }
    }

    validateForm = (event) => {
        event.preventDefault();
    }



    render() {
        return <Modal.Dialog>
            <Modal.Header >
                <Modal.Title>
                    Login
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className='form' method={'POST'}
                    onSubmit={this.validateForm} ref={form => this.form = form}>
                    <Form.Group>
                        <Form.Label htmlFor='username'>Username</Form.Label>
                        <Form.Control id='username' type="text" placeholder="Enter username" required={true} name='username'
                            value={this.state.username}
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} />
                        <Form.Text className="text-muted">
                            We'll never share your name with anyone else.
                        </Form.Text>
                        <Form.Label htmlFor='password'>Password</Form.Label>
                        <Form.Control id='password' type="password" placeholder="Enter password" required={true} name='password'
                            value={this.state.password}
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} />
                        <Form.Text className="text-muted">
                            We'll never share your password with anyone else.
                        </Form.Text>
                        <Form.Row>
                            <Button type='button' variant="primary" disabled={this.props.doingLogin}
                                onClick={this.doLogin}>
                                Login
                            </Button>
                            <Button type='button' variant="secondary" disabled={this.props.doingLogin} as={Link} to='/'>
                                Exit
                            </Button>
                        </Form.Row>
                    </Form.Group>
                </form>
            </Modal.Body>
        </Modal.Dialog>
    }
}

export { Login };
import React from "react";
import { Card, Container, Row, Col } from 'react-bootstrap';
import DropdownMultiselect from "./MultiSelect";

class Car {
    static from(json) {
        return Object.assign(new Car(), json);
    }
}

class CarsShow extends React.Component {
    render() {
        return <>
            <Container>
                <Row>
                    <Col xl={10}>
                        <Col className="text-center pageTitle">
                            <h3 className="font-weight-light">Ours Cars</h3>
                        </Col>
                        <Row>
                            {
                                this.props.cars.length > 0 ?
                                    this.props.cars.map((c) =>
                                        <Col md={4} key={c.id}>
                                            <CarCard car={c} key={c.id}>
                                            </CarCard>
                                        </Col>
                                    )
                                    : <h3>No cars</h3>
                            }

                        </Row>
                    </Col>
                    <Col xl={2}>
                        <h3 className=" text-center font-weight-light">Filters</h3>
                        <DeckFilter brands={this.props.brands} brandFilter={this.props.brandFilter} categoryFilter={this.props.categoryFilter}>
                        </DeckFilter>
                    </Col>
                </Row>
            </Container>
        </>
    }
}

function DeckFilter(props) {
    const categories = ['A', 'B', 'C', 'D', 'E'];
    return <>
        <label htmlFor='brands'>Brand</label>
        <DropdownMultiselect
            as="select"
            options={props.brands}
            name={'brands'}
            handleOnChange={(selected) => {
                props.brandFilter(selected);
            }}
        />
        <label htmlFor='categories'>Category</label>
        <DropdownMultiselect
            options={categories}
            name={'categories'}
            handleOnChange={(selected) => {
                props.categoryFilter(selected);
            }}
        />
    </>
};

function CarCard(props) {
    return <Card className='CarCard' style={{ width: '18rem' }}>
        <Card.Img variant="top" />
        <Card.Body>
            <Card.Title> {props.car.model} </Card.Title>
            <Card.Text>
                Category: {props.car.category} &nbsp;
                Brand: {props.car.brand}
            </Card.Text>
        </Card.Body>
        <Card.Footer>
            <small className="text-muted">The best car in the world</small>
        </Card.Footer>
    </Card>
}

export { Car, CarsShow };
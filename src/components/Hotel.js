import React, { useState, useEffect } from 'react';
import HotelDataService from "../services/hotels";
import { Link, useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import moment from 'moment';
import axios from 'axios';


const Hotel  = ({ user }) => {
    let params = useParams();
    const [hotel, setHotel] = useState({
        id: null,
        hotel_name: "",
        rated: "",
        reviews: []
    });

    useEffect(() => {
        const getHotel = id => {
            HotelDataService.get(id).then(response => {
                setHotel(response.data);
            })
            .catch(e => {
                console.log(e);
            });
        }
        getHotel(params.id)
    }, [params.id]);

    const deleteReview = (reviewId, index) => {
        let data = {
            review_id: reviewId,
            user_id: user.googleId
        }
        HotelDataService.deleteReview(data).then(response => {
            setHotel((prevState) => {
                prevState.reviews.splice(index, 1);
                return ({
                    ...prevState
                })
            })
        })
        .catch(e => {
            console.log(e);
        });
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                    <div className="poster">
                        <Image
                            className="bigPicture"
                            src={hotel.poster+"/100px250"}
                            fluid 
                            onError={({currentTarget}) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src="/images/NoPosterAvailable-crop.jpg";
                               }}/>
                    </div>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header as="h5">{hotel.hotel_name}</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {hotel.compare_hotels}
                                </Card.Text>
                                { user &&
                                    <Link to={"/hotels/" + params.id + "/review"}>
                                        Add Review
                                    </Link> }
                            </Card.Body>
                        </Card>
                        <h2> Reviews </h2>
                        <br></br>


                        { hotel.reviews.map((review, index) => {
                            return (
                                <div className="d-flex">
                                    <div className="flex-shrink-0 reviewsText">
                                        <h5>{review.name + " reviewed on "} { moment(review.date).format("Do MMMM YYYY") } </h5>
                                        <p className="review">{review.review}</p>
                                        { user && user.googleId === review.user_id && 
                                            <Row>
                                                <Col>
                                                    <Link to={{
                                                        pathname: "/hotels/"+params.id+"/review"
                                                    }}
                                                    state = {{
                                                        currentReview: review
                                                    }} > Edit </Link>
                                                </Col>
                                                <Col>
                                                    <Button varriant="Link" onClick={ () =>
                                                    {
                                                        // TODO: Implement delete behavior
                                                        deleteReview(review._id, index)
                                                    } }> Delete </Button>
                                                </Col>
                                            </Row>
                                        }
                                    </div>
                                </div>
                            )
                        }) }



                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Hotel;
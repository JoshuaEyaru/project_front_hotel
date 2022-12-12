import React, { useState} from 'react';
import HotelDataService from "../services/hotels";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
// import Movie from './Movie';

const AddReview = ({ user }) => {
    const navigate = useNavigate()
    const params = useParams();
    const location = useLocation();

    let editing = false;
    let initialReviewState = "";

    // initialReviewState will have a different value
    // if we're editing an existing review

    if (location.state && location.state.currentReview) {
        editing = true;
        initialReviewState = location.state.currentReview.review;
        //console.log(initialReviewState); // consoled to see the structure
    }

    const [review, setReview] = useState(initialReviewState);

    const onChangeReview = e => {
        const review = e.target.value;
        setReview(review);
    }

    const saveReview = () => {
        var data = {
            review: review,
            name: user.name,
            user_id: user.googleId,
            hotel_id: params.id // get hotel id from url
        }

        if (editing) {
            // get existing review id
            data.review_id = location.state.currentReview._id;
            HotelDataService.updateReview(data).then(response => {
                navigate("/hotels/"+params.id)
            })
            .catch(e => {
                console.log(e)
            })
        } else {
            HotelDataService.createReview(data).then(response => {
                navigate("/hotels/"+params.id)
            }).catch(e => {
                console.log(e);
            });
        }
    }

    return (
        <Container className="main-container">
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>{ editing ? "Edit" : "Create" } Review </Form.Label>
                    <Form.Control 
                        as="textarea"
                        type="text"
                        required
                        review={ review }
                        onChange={ onChangeReview }
                        defaultValue={ editing ? location.state.currentReview.review : "" }
                    />
                </Form.Group>
                    <Button variant="primary" onClick={ saveReview } >
                        Submit
                    </Button>
            </Form>
        </Container>
    )

}

export default AddReview;
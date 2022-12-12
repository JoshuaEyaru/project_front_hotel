import React, { useState, useEffect, useCallback, } from 'react';
import HotelDataService from "../services/hotels";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { BsStar, BsStarFill } from "react-icons/bs";

import './HotelsList.css';


const HotelsList = ({
    user,
    favorites,
    addFavorite,
    deleteFavorite
  }) => {
   // useState to set state values
    const [hotels, setHotels] = useState([]);
    const [searchHotel_name, setSearchHotel_name] = useState("");
    const [searchRating, setSearchRating] = useState("");
    const [ratings, setRatings] = useState(["All Ratings"]);
    const [currentPage, setCurrentPage] = useState(0);
    const [entriesPerPage, setEntriesPerPage] = useState(0);
    const [currentSearchMode, setCurrentSearchMode] = useState("");

    // useCallback to define functions which should 
    // only be created once and will be dependencies for
    // useEffects
    const retrieveRatings = useCallback(() => {
        HotelDataService.getRatings()
            .then(response => {
                setRatings(["All Ratings"].concat(response.data))
            })
            .catch(e => {
                console.log(e);
            });
    }, []);

    const retrieveHotels = useCallback(() => {
        setCurrentSearchMode("");
        HotelDataService.getAll(currentPage)
            .then(response => {
                setHotels(response.data.hotels);
                setCurrentPage(response.data.page);
                setEntriesPerPage(response.data.entries_per_page);
            })
            .catch(e => {
                console.log(e);
            });
    }, [currentPage]);

    const find = useCallback((query, by) => {
        HotelDataService.find(query, by, currentPage)
            .then(response => {
                setHotels(response.data.hotels);
            })
            .catch(e => {
                console.log(e);
            });
    }, [currentPage]);

    const findByHotel_name = useCallback(() => {
        setCurrentSearchMode("findByHotel_name");
        find(searchHotel_name, "Hotel_name");
    }, [find, searchHotel_name]);

    const findByRating = useCallback(() => {
        setCurrentSearchMode("findByRating");
        if (searchRating === "All Ratings") {
            retrieveHotels();
        } else {
            find(searchRating, "rated");
        }
    }, [find, searchRating, retrieveHotels]);

    const retrieveNextPage = useCallback(() => {
        if (currentSearchMode === "findByHotel_name") {
            findByHotel_name();
        } else if (currentSearchMode === "findByRating") {
            findByRating();
        } else {
            retrieveHotels();
        }
    }, [currentSearchMode, findByHotel_name, findByRating, retrieveHotels]);


    // Use effect to carry out side effect functionality
    useEffect(() => {
        retrieveRatings();
    }, [retrieveRatings]);

    useEffect(() => {
        setCurrentPage(0);
    }, [currentSearchMode]);

    // retrieve the next pagge if currentPage value changes
    useEffect(() => {
        retrieveNextPage();
    }, [currentPage, retrieveNextPage]);


    // Other functions that are not depended on by useEffect
    const onChangeSearchHotel_name = e => {
        const searchHotel_name = e.target.value;
        setSearchHotel_name(searchHotel_name);
    }

    const onChangeSearchRating = e => {
        const searchRating = e.target.value;
        setSearchRating(searchRating);
    }

    return (
        <div className="App">
            <Container className="main-container">
                <Form>
                    <Row>
                        <Col>
                        <Form.Group className="mb-3">
                            <Form.Control
                            type="text"
                            placeholder="Search by hotel name"
                            value={searchHotel_name}
                            onChange={onChangeSearchHotel_name}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="button"
                            onClick={findByHotel_name}
                        >
                            Search
                        </Button>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="select"
                                    onChange={onChangeSearchRating}
                                >
                                    { ratings.map((rating, i) => {
                                        return (
                                            <option value={rating}
                                            key={i}>
                                                {rating}
                                            </option>
                                        )
                                    })}
                                </Form.Control>
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="button"
                                onClick={findByRating}
                            >
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Row className="hotelRow">
                    { hotels.map((hotel) => {
                        return(
                            <Col key={hotel._id}>
                                <Card className="hotelsListCard">
                                    { user && (
                                        favorites.includes(hotel._id) ? 
                                        <BsStarFill className="star starFill" onClick={() => {
                                            deleteFavorite(hotel._id);
                                        }}/>
                                        :
                                        <BsStar className="star starEmpty" onClick={() => {
                                            addFavorite(hotel._id);
                                        }} />
                                    )}
                                    <Card.Img 
                                        className="smallPoster"
                                       src={hotel.poster+"/100px180"} // if default image fails try changing this to hotels.poster
                                       onError={({currentTarget}) => {
                                        currentTarget.onerror = null; // prevents looping
                                        currentTarget.src="/images/NoPosterAvailable-crop.jpeg";
                                       }}/>
                                    <Card.Body>
                                        <Card.Title> {hotel.hotel_name} </Card.Title>
                                        <Card.Text>
                                            Rating: {hotel.rated}
                                        </Card.Text>
                                        <Card.Text>
                                            {hotel.compare_hotels}
                                        </Card.Text>
                                        <Link to={"/hotels/"+hotel._id}>
                                            View reviews
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
                <br />
                Showing page: { currentPage + 1}.
                <Button
                    variant='="link'
                    onClick={ () => { setCurrentPage(currentPage + 1)}}
                    >
                        Get next { entriesPerPage } results
                </Button>
            </Container>
                
        </div>
    )
}

export default HotelsList;
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect, useCallback } from 'react';
import HotelsList from "./components/HotelsList";
import Hotel from "./components/Hotel"
import AddReview from "./components/AddReview.js";
import './App.css';
import Login from "./components/Login.js";
import Logout from "./components/Logout.js";
import FavoriteDataService from './services/favorites';
// import DndCard from "./DndCard.js";
import Favorites from "./components/Favorites.js";
import HotelDataService from './services/hotels.js';


const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {

  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [doSaveFaves, setDoSaveFaves] = useState(false);
  const [favHotels, setFavHotels] = useState([]);

  const retrieveFavorites = useCallback(() => {
    FavoriteDataService.getAll(user.googleId).then(response => {
      setFavorites(response.data.favorites);
    })
    .catch(e => {
      console.log(e);
    });
  }, [user]);

  const saveFavorites = useCallback(() => {
    if (doSaveFaves) {
    var data = {
      _id: user.googleId,
      favorites: favorites
    }

    FavoriteDataService.updateFavoriteList(data).catch(e => {
      console.log(e);
    })
    }
  }, [favorites, user, doSaveFaves]);

  const retrieveFavoriteHotels = useCallback(() => {
    HotelDataService.getByIdList(favorites).then(response => {
      //make sure to sort the movies by favorites as they will not be returned sorted otherwise
      let sorted = response.data.sort(
        function(a, b) {
          return favorites.indexOf(a._id) - favorites.indexOf(b._id);
        }
      );
      setFavHotels(
        sorted.map((element) => {
          return ({
            id: element._id,
            hotel_name: element.hotel_name,
            poster: element.poster
          });
        })
      );
    })
    .catch(e => {
      console.log(e);
    });
  }, [favorites]);



  const addFavorite = (movieId) => {
    setDoSaveFaves(true);
    setFavorites([...favorites, movieId]);
  }

  const deleteFavorite = (movieId) => {
    setDoSaveFaves(true);
    setFavorites(favorites.filter(f => f !== movieId));
    
  }

  const reorderFavorites = (newFavs) => {
    if (newFavs.length && newFavs.length > 0) {
      setDoSaveFaves(true);
      setFavorites(newFavs);
    }
  }

  useEffect(() => {
    let loginData = JSON.parse(localStorage.getItem("login"));
    if (loginData) {
      let loginExp = loginData.exp;
      let now = Date.now()/1000;
      if (now < loginExp) {
        // Not expired
        setUser(loginData);
      } else {
        // Expired
        localStorage.setItem("login", null);
      }
    }
  }, []);

  useEffect(() => {
    if (user && doSaveFaves) {
      saveFavorites();
      setDoSaveFaves(false);
    }
  }, [user, favorites, saveFavorites, doSaveFaves]);

  useEffect(() => {
    if (user) {
      retrieveFavorites();
    }
  }, [user, retrieveFavorites]);

  useEffect(() => {
    retrieveFavoriteHotels();
  }, [favorites, retrieveFavoriteHotels]);


  return (
    <GoogleOAuthProvider clientId={clientId}>
    <div className="App">
      <Navbar bg="primary" expand="lg" sticky="top" variant="dark" >
        <Container className="container-fluid">
          <Navbar.Brand className="brand" href="/">
            <img src="/images/hotel-logo.png" alt="movies logo" className="hotelsLogo" /> 
            HOTEL LIST
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" >
            <Nav className="ml-auto">
              <Nav.Link as={Link} to={"/hotels"}>
                Hotels
              </Nav.Link>
            </Nav>
            <Nav className="ml-auto">
              <Nav.Link as={Link} to={"/favorites"}>
                Favorites
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          { user ? (
              <Logout setUser={setUser} />
          ) : (
              <Login setUser={setUser} />
          )}
        </Container>
      </Navbar>
      
      <Routes>
        <Route exact path={"/"} element={
          <HotelsList 
            user={ user }
            addFavorite={ addFavorite }
            deleteFavorite={ deleteFavorite }
            favorites={ favorites }
          />}
        />
        <Route exact path={"/hotels"} element={
          <HotelsList 
            user={ user }
            addFavorite={ addFavorite }
            deleteFavorite={ deleteFavorite }
            favorites={ favorites }
          /> }
        />
        <Route path={"/hotels/:id/"} element={
          <Hotel user={ user } /> }
        />

        <Route path={"/hotels/:id/review"} element={
          <AddReview user={ user } />
        } />

      <Route path={"/favorites"} element={
        user ? 
         <Favorites
          user = {user}
          favorites={ favorites } 
          favHotels = {favHotels}
          setFavorites = {setDoSaveFaves}
          doSaveFaves = {setDoSaveFaves}
          reorderFavorites = {reorderFavorites} />
        :
        <HotelsList 
          user = {user}
          addFavorite = {addFavorite}
          deleteFavorite = {deleteFavorite}
          favorites = {favorites} />
       } />

      </Routes>
    </div>
    </GoogleOAuthProvider>
  );
}

export default App;
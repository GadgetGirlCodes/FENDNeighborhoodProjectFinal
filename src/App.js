import React, { Component } from 'react';
import ListMenu from './components/ListMenu';
import MapContainer from './components/MapContainer';
import locations from './data/locations.json';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './App.css';

library.add(faBars)

const YELP_KEY = 'nURSXAKqkUMPdntGky6KItOf0vSFaLnwcaN-w7MPeI5543g1OtE6dVSA_tXWRMwZaSUzNuzeyGIfT_gsINuzE_9_HO8B__a3-cvcVUNrWgOLH2yX0FvC8q3ECcnXW3Yx'

class App extends Component {
  state = {
    locations: locations,
    yelpData: [],
    menuOpen: false
  }

  // Step 1: Get location information from Yelp
  getYelpInfo = () => {
      let url = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?radius=1000&latitude=32.322613&longitude=-95.262592"
      let headers = new Headers({
          Authorization: `Bearer ${YELP_KEY}`
        });
      let request = new Request(url, {
        method: 'GET',
        headers
      })
      fetch(request)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong...');
          }
        })
        .then(data => this.setState({ yelpData: data.businesses}))
        .catch(error => this.setState({ error }));
    };

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  componentDidMount() {
    // this.getYelpInfo();
  };

  render() {
    return (
      <div className="App">
        <nav className="mainHeader">
          <h2>Nom-Nom Finder</h2>
          <button onClick={this.toggleMenu}><FontAwesomeIcon icon="bars"/></button>
        </nav>
        <ListMenu
          yelpData={this.state.yelpData}
          getYelpInfo={this.getYelpInfo}
          menuOpen={this.state.menuOpen}
          toggleMenu={this.toggleMenu} />
        <MapContainer
          locations={this.state.locations}
          yelpData={this.state.yelpData}
          getYelpInfo={this.getYelpInfo} />
      </div>

      // TODO: Create a full-screen map that displays markers for restaurants
      // near the UT Tyler campus. 

      // Step 1: Display Map

      // Step 2: Display ListMenu

      // Step 3: Add functionality
      // ---------------------------------------------------
      // Step 1: Get location information from Yelp

      // Step 2: Display location information as markers on map

      // Step 3: Display location information on ListMenu

      // Step 4a: When marker clicked, display location information

      // Step 4: When clicked on ListMenu, display InfoWindow on marker

      // Step 5: Add filter functionality
    );
  }
}

export default App;

import React, { Component } from 'react';
import MapContainer from './components/MapContainer';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './App.css';

library.add(faBars)

const YELP_KEY = 'nURSXAKqkUMPdntGky6KItOf0vSFaLnwcaN-w7MPeI5543g1OtE6dVSA_tXWRMwZaSUzNuzeyGIfT_gsINuzE_9_HO8B__a3-cvcVUNrWgOLH2yX0FvC8q3ECcnXW3Yx'

class App extends Component {
  state = {
    yelpData: [],
    markerInfo: null,
    menuOpen: false,
    error: false
  }

  // Use FetchAPI to retrieve and store location information from YelpAPI
  // Fix for adding headers found here: https://stackoverflow.com/questions/44444777/calling-yelp-api-from-frontend-javascript-code-running-in-a-browser
  // Access to emulated backend found here: https://github.com/Rob--W/cors-anywhere
  getYelpInfo = () => {
    let url = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?radius=5000&latitude=32.322613&longitude=-95.262592&sort_by=distance&limit=50"
    let headers = new Headers({
      Authorization: `Bearer ${YELP_KEY}`
    });
    let request = new Request(url, {
      method: 'GET',
      headers
    })
    fetch(request)
      .then(response => {return response.json();})
      .then(data => this.setState({ yelpData: data.businesses }))
      .then(() => this.getMarkerInfo(this.state.yelpData))
      // set error state to true to display Error Message
      .catch(() => this.setState({ error: true }));
  };

  // Create an array to hold specific information from the YelpAPI to use for markers and listings.
  getMarkerInfo = (markerData) => {
    let markerInfo = [];
    // Map over YelpAPI data to create array for markerInfo and set that array to markerInfo state
    markerData.map(element => {
      let info = {
        key: element.id,
        name: element.name,
        position: { lat: element.coordinates.latitude, lng: element.coordinates.longitude },
        phone: element.display_phone,
        address: element.location.display_address,
        image_url: element.image_url,
        url: element.url
      };
      return markerInfo.push(info);
    })
    this.setState({ markerInfo: markerInfo })
  };

  // Toggle ListMenu
  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  // Fetch yelp info when component is mounted
  componentDidMount() {
    this.getYelpInfo();
  };

  render() {
    if (this.state.error === true) {
      // Display Error Message
      return <div className='errorMessage'>Oh No! It looks like there was an error! Please try again later.</div>
    } else if (this.state.markerInfo === null) {
      // Wait for Yelp Data to populate. https://stackoverflow.com/questions/42132290/wait-for-react-promise-to-resolve-before-render
      return <div className='loadingYelp'>Please wait. Loading data from Yelp!</div>;
    } else {
      return (
        <div className="App">
          <nav className="mainHeader">
            <h2>Nom-Nom Finder</h2>
            <button aria-label="Listing Menu" onClick={this.toggleMenu}><FontAwesomeIcon icon="bars" /></button>
          </nav>
          <MapContainer
            markerInfo={this.state.markerInfo}
            menuOpen={this.state.menuOpen}
            toggleMenu={this.toggleMenu}
            filteredListings={this.state.filteredListings}
            filteredMarkers={this.state.filteredMarkers} />
        </div>
      );
    }
  }
}

export default App;

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
    menuOpen: false
  }

  // DONE: Application utilizes the Google Maps API or another mapping system and at least one non-Google third-party API.
  // DONE: All data requests are retrieved in an asynchronous manner using either the Fetch API.

  // Get and store location information from YelpAPI
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
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong...');
        }
      })
      .then(data => this.setState({ yelpData: data.businesses }))
      .then(markerData => this.getMarkerInfo(this.state.yelpData))
      .catch(error => this.setState({ error }));
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
    // Console log to test
    console.log(markerInfo);
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
    // Wait for Yelp Data to populate. https://stackoverflow.com/questions/42132290/wait-for-react-promise-to-resolve-before-render
    if (this.state.markerInfo === null) return 'Please wait. Loading data from Yelp!';

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

export default App;

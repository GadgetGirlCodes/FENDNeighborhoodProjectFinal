import React, { Component } from 'react';
import ListMenu from './components/ListMenu';
import MapContainer from './components/MapContainer';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './App.css';

library.add(faBars)

const YELP_KEY = 'nURSXAKqkUMPdntGky6KItOf0vSFaLnwcaN-w7MPeI5543g1OtE6dVSA_tXWRMwZaSUzNuzeyGIfT_gsINuzE_9_HO8B__a3-cvcVUNrWgOLH2yX0FvC8q3ECcnXW3Yx'

class App extends Component {
  state = {
    markers: [],
    yelpData: [],
    filteredListings: [],
    menuOpen: false
  }

  // Get and store location information from Yelp
  getYelpInfo = () => {
      let url = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?radius=2000&latitude=32.322613&longitude=-95.262592&sort_by=distance"
      let headers = new Headers({
          Authorization: `Bearer ${YELP_KEY}`
        });
      let request = new Request(url, {
        method: 'GET',
        headers
      })
      let markers = [];
      fetch(request)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong...');
          }
        })
        .then(data => this.setState({ yelpData: data.businesses }))
        .catch(error => this.setState({ error }));
    };

  // Toggle side menu to open
  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  // updateListing = (query) => {
  //   if (query) {
  //     this.props.yelpInfo.search(query).then((filteredListings) => {
  //       if (filteredListings.error) {
  //         this.setState({ filteredListings: [] })
  //       } else {
  //         this.setState({ filteredListings: filteredListings })
  //       }
  //     })
  //   }
  // };

  componentDidMount() {
    this.getYelpInfo();
  };

  render() {
    return (
      <div className="App">
        <nav className="mainHeader">
          <h2>Nom-Nom Finder</h2>
          <button aria-label="Listing" onClick={this.toggleMenu}><FontAwesomeIcon icon="bars"/></button>
        </nav>
        <ListMenu
          yelpData={this.state.yelpData}
          menuOpen={this.state.menuOpen}
          toggleMenu={this.toggleMenu}
          filteredListings={this.state.filteredListings} />
        <MapContainer
          yelpData={this.state.yelpData}
          filteredListings={this.state.filteredListings} />
      </div>

      // TODO: Create a full-screen map that displays markers for restaurants
      // near the UT Tyler campus. 

      // Step 2: Display location information as markers on map

      // Step 4a: When marker clicked, display location information

      // Step 4: When clicked on ListMenu, display InfoWindow on marker

      // Step 5: Add filter functionality
    );
  }
}

export default App;

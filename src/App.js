import React, { Component } from 'react';
import MapContainer from './components/MapContainer';
import Listing from './components/Listing';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './App.css';

library.add(faBars)

const YELP_KEY = 'nURSXAKqkUMPdntGky6KItOf0vSFaLnwcaN-w7MPeI5543g1OtE6dVSA_tXWRMwZaSUzNuzeyGIfT_gsINuzE_9_HO8B__a3-cvcVUNrWgOLH2yX0FvC8q3ECcnXW3Yx'

class App extends Component {
  state = {
    yelpData: [],
    markerInfo: [],
    allListings: [],
    allMarkers: [],
    filteredMarkers: null,
    filteredListings: null,
    menuOpen: false,
    query: ""
  }

  // Get and store location information from YelpAPI. Method for obtaining Yelp info was provided thanks to 
  getYelpInfo = () => {
    let url = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?radius=5000&latitude=32.322613&longitude=-95.262592&sort_by=distance&limit=50"
    let headers = new Headers({
      Authorization: `Bearer ${YELP_KEY}`
    });
    let request = new Request(url, {
      method: 'GET',
      headers
    })
    // Obtain info via FetchAPI then return data to response. If data is unavailable, show error
    fetch(request)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong...');
        }
      })
      // set retrieved data to yelpData state
      .then(data => this.setState({ yelpData: data.businesses }))
      // pass specific data to markerInfo state using getMarkerInfo method
      .then(markerData => this.getMarkerInfo(this.state.yelpData))
      // if error, throw error on console
      .catch(error => this.setState({ error }));
  };

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
      // push info to markerInfo array
      return markerInfo.push(info);
    })
    // Console log to test
    console.log(markerInfo);
    this.setState({ markerInfo: markerInfo })
  };

  // Create listings based on the info taken from YelpData in MarkerInfo then store in state and push to MapContainer.js and Listing.js
  createListings = () => {
    let newListings = this.state.markerInfo.map((listing, index) => (
        <li key={listing.key}>
          <Listing
            handleListingClick={this.props.handleListingClick}
            listing={listing}
            index={index}
            markers={this.state.markers}
            activeMarker={this.state.activeMarker}
            google={this.props.google} />
        </li>
    ));
    
    console.log(newListings);

    this.setState({ allListings: newListings })
  };

  // Create markers using the props given from google-maps-react via 
  // mapProps and map https://github.com/fullstackreact/google-maps-react
  createMarkers = (mapProps, map) => {
    // set google to mapProps from Map for marker creation
    const { google } = mapProps;
    const infoWindow = new google.maps.InfoWindow();

    // if there is an open infoWindow, and another is clicked, 
    // close the active marker and set activeMarker state to null. References:
    // https://developers.google.com/maps/documentation/javascript/events
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
    // https://stackoverflow.com/questions/34053826/how-to-use-this-in-google-maps-event-addlistener
    google.maps.event.addListener(infoWindow, 'closeclick', () => {
      this.state.activeMarker.setAnimation(null);
      this.setState({ activeMarker: null });
    });

    // array to store all markers
    let markers = [];

    // For each markerInfo object, generate a Marker
    this.state.markerInfo.forEach(item => {
      const marker = new google.maps.Marker({
        position: { lat: item.position.lat, lng: item.position.lng },
        key: item.key,
        name: item.name,
        map: map,
        phone: item.phone,
        animation: google.maps.Animation.DROP,
      });

      // Content for each infoWindow. Reference found here
      // https://developers.google.com/maps/documentation/javascript/infowindows
      let windowContent =
        `<div className="infoWindow">
            <h3>${marker.name}</h3>
            <p>Phone: ${marker.phone}</p>
          </div>`;

      marker.addListener('click', (index) => {
        // Use slice to create a temporary marker array that can be iterated over to stop the animation for the markers
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
        let tempMarkers = this.state.markers.slice();
        tempMarkers.forEach(mark => {
          mark.setAnimation(null);
        })

        //set the content for the new window
        infoWindow.setContent(windowContent);
        //show the new window based on the clicked marker
        infoWindow.open(map, marker);
        //set state to activeMarker
        this.setState({ activeMarker: marker });
        //set marker animation
        marker.setAnimation(google.maps.Animation.BOUNCE);
      });

      // store marker into array to push to set to state
      markers.push(marker);
    });

    // set state for markers
    this.setState({ allMarkers: markers, filteredMarkers: markers });
  }

  // Toggle ListMenu using open state boolean
  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  // Set filteredListings state if query input.
  updateListing = (query, map) => {
    if (query) {
      // check listing with query, set state to show only filtered listings.
      // Used toLowerCase to prevent any hangups with case-sensitivity
      let filteredListings = this.state.allListings.filter(listing => (listing.name.toLowerCase().includes(query.toLowerCase())));
      this.setState({ filteredListings: filteredListings });
      this.state.filteredMarkers.forEach((listing) => {
        // check markers with query, if no match, then hide markers
        if (!listing.name.toLowerCase().includes(query.toLowerCase())) {
          return listing.setVisible(false);
        }
      })
    } else {
      //clear filtered listings from state, show all listings and markers
      this.setState({ filteredListings: null });
      this.setVisibleOnAll();
    }
  };

  //Set all markers to visible
  setVisibleOnAll = () => {
    this.state.filteredMarkers.forEach((marker) => marker.setVisible(true))
  };

  // handleChange = (e) => {  

  // }

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
          allListings={this.state.allListings}
          allMarkers={this.state.allMarkers}
          filteredListings={this.state.filteredListings}
          filteredMarkers={this.state.filteredMarkers}
          menuOpen={this.state.menuOpen}
          query={this.state.query}
          updateListing={this.updateListing}
          handleListingClick={this.handleListingClick}
          toggleMenu={this.toggleMenu}
        />
      </div>
    );
  }
}

export default App;

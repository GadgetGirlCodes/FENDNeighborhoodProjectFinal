import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import Drawer from '@material-ui/core/Drawer';
import { DebounceInput } from 'react-debounce-input';
import Listing from './Listing';


// Sets an alert window if there is an authentication error with the Google Maps API.
// Help was provided by an Udacity reviewer and the following sites:
// https://developers.google.com/maps/documentation/javascript/events
// https://stackoverflow.com/questions/45633672/detect-query-limit-message-on-map-load-with-google-maps-javascript-api
window.gm_authFailure = function gm_authFailure(){
  window.alert("Oh No! It looks like there was an error loading the map! Please try again later.")
}

class MapContainer extends Component {
  state = {
    allMarkers: [],
    filteredMarkers: null,
    filteredListings: null,
    query: ""
  }

   
 
  // Create markers using the props passed from the Google map via google-maps-react
  // https://github.com/fullstackreact/google-maps-react
  createMarkers = (mapProps, map) => {
    // set google to mapProps from Map to allow for marker and info window creation
    const { google } = mapProps;
    const infoWindow = new google.maps.InfoWindow();

    // if there is an open infoWindow, and another is clicked, close the active marker and set activeMarker state to null
    google.maps.event.addListener(infoWindow, 'closeclick', () => {
      this.state.activeMarker.setAnimation(null);
      this.setState({ activeMarker: null });
    });

    // array to store all markers
    let markers = [];

    // For each markerInfo object, generate a GoogleMaps Marker object
    this.props.markerInfo.forEach(item => {
      const marker = new google.maps.Marker({
        position: { lat: item.position.lat, lng: item.position.lng },
        key: item.key,
        name: item.name,
        map: map,
        phone: item.phone,
        animation: google.maps.Animation.DROP
      });

      // Content for each infoWindow. Reference found here
      // https://developers.google.com/maps/documentation/javascript/infowindows
      let windowContent =
        `<div className="infoWindow">
            <h3>${marker.name}</h3>
            <p>Phone: ${marker.phone}</p>
          </div>`;

      marker.addListener('click', () => {
        // Use slice to create a temporary marker array that can be iterated over to stop the animation for the markers
        let tempMarkers = this.state.allMarkers.slice();
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
        this.state.activeMarker.setAnimation(google.maps.Animation.BOUNCE);
      });

      // store marker into array to push to set to state
      markers.push(marker);
    });

    // set state for markers
    this.setState({ allMarkers: markers, filteredMarkers: markers });
  };

  // Set the animation for the marker that corresponds to each listing. 
  toggleListingMarker = (index) => {
    if (this.state.filteredListings !== null) {
      let filteredMarker = this.state.filteredMarkers[index];
      let thisListing = document.getElementById(index);
      this.toggleListingVisible(thisListing);
      this.toggleMarkerAnimation(filteredMarker);
    } else {
      let clickedMarker = this.state.allMarkers[index];
      let thisListing = document.getElementById(index);
      this.toggleListingVisible(thisListing);
      this.toggleMarkerAnimation(clickedMarker);
    }
  };

  // Activates animation for a marker based on it's current animation. Used for toggleListingMarker to toggle marker animation.
  toggleMarkerAnimation = (animatedMarker) => {
    if (animatedMarker.animating === false) {
      animatedMarker.setAnimation(this.props.google.maps.Animation.BOUNCE)
    } else {
      animatedMarker.setAnimation(this.props.google.maps.Animation.NONE)
    }
  }

  // Shows or hides the details of a listing based on the current attribute. Used for toggleListingMarker 
  toggleListingVisible = (clickedListing) => {
    if (clickedListing.hasAttribute('hidden')) {
      clickedListing.removeAttribute('hidden');
      clickedListing.setAttribute('aria-expanded', true);
    } else {
      clickedListing.setAttribute('hidden', true);
      clickedListing.setAttribute('aria-expanded', false);
    }
  };

  onInfoWindowClose = (marker) => {
    marker.setAnimation(null);
  }

  // Updates filter input if there's a query, then updates listings and markers
  updateQuery = (query) => {
    this.setState({ query: query })
    this.updateListing(query)
  };

  // Set filteredListings state if query input.
  updateListing = (query, map) => {
    if (query) {
      // check listing with query, set state to show only filtered listings.
      // Used toLowerCase to prevent any hangups with case-sensitivity
      let filteredListings = this.props.markerInfo.filter(listing => (listing.name.toLowerCase().includes(query.toLowerCase())));
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
      this.toggleVisibleOnAll();
    }
  };

  //Set all markers to visible
  toggleVisibleOnAll = () => {
    this.state.allMarkers.forEach((marker) => marker.setVisible(true))
  };

  // Map over filteredListings and display filtered listings. If null, display all listings
  displayListings = () => {
    if (this.state.filteredListings !== null) {
      let filteredListing = this.state.filteredListings.map((listing, index) => (
        <li aria-label="Restaurant Information" role="link" key={listing.key}>
          <Listing
            index={index}
            listing={listing}
            allMarkers={this.state.allMarkers}
            toggleListingMarker={this.toggleListingMarker}
            google={this.props.google} />
        </li>
      ));
      return filteredListing;
    } else {
      //if no filtered listings, display all listings
      return this.props.markerInfo.map((listing, index) => (
        <li aria-label="Restaurant Information" role="link" key={listing.key}>
          <Listing
            index={index}
            listing={listing}
            allMarkers={this.state.allMarkers}
            toggleListingMarker={this.toggleListingMarker}
            google={this.props.google} />
        </li>));
    }
  }

  render() {
    const center = {
      lat: 32.322631,
      lng: -95.265738
    }

    return (
      // Displays Map and markers.
      <section>
        <Map
          aria-label="map"
          role="application"
          google={this.props.google}
          zoom={14}
          initialCenter={center}
          onClick={this.props.toggleMenu}
          onReady={this.createMarkers} />
        <Drawer
          open={this.props.menuOpen}
          onClose={this.props.toggleMenu} >
          <section aria-label="Restaurant List and Filter" className="listMenu">
            <DebounceInput
              minLength={1}
              debounceTimeout={500}
              className='filter'
              element="input"
              type='text'
              placeholder='Filter Listings by Name'
              onChange={e => this.updateQuery(e.target.value)}
              value={this.state.query} />
            <ul aria-label="Restaurant Listings" role="directory" className='list'>
              {this.displayListings()}
            </ul>
          </section>
        </Drawer>
      </section>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCxXK6lMDoTo4dHosssdE0SyJ8UtVOtpbU")
})(MapContainer)
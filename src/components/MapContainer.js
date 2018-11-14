import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import Drawer from '@material-ui/core/Drawer';
import { DebounceInput } from 'react-debounce-input';
import Listing from './Listing';

class MapContainer extends Component {
  state = {
    markers: [],
    filteredMarkers: null,
    filteredListings: null,
    activeMarker: null,
    query: ""
  }

  // DONE: Map displays all location markers by default, and displays the filtered subset of location markers when a filter is applied.

  // Create markers using the props given from google-maps-react via 
  // mapProps and map https://github.com/fullstackreact/google-maps-react
  createMarkers = (mapProps, map) => {
    // set google to mapProps from Map for marker creation
    const { google } = mapProps;
    const infoWindow = new google.maps.InfoWindow();

    // if there is an open infoWindow, and another is clicked, close the active marker and set activeMarker state to null
    google.maps.event.addListener(infoWindow, 'closeclick', () => {
      this.state.activeMarker.setAnimation(null);
      this.setState({ activeMarker: null });
    });

    // array to store all markers
    let markers = [];

    // For each markerInfo object, generate a Marker
    this.props.markerInfo.forEach(item => {
      const marker = new google.maps.Marker({
        position: { lat: item.position.lat, lng: item.position.lng },
        key: item.key,
        name: item.name,
        map: map,
        phone: item.phone,
        animation: google.maps.Animation.DROP,
      });

      // DONE: Clicking a marker displays unique information about a location
      // somewhere on the page (modal, separate div, inside an infoWindow).

      // Content for each infoWindow. Reference found here
      // https://developers.google.com/maps/documentation/javascript/infowindows
      let windowContent =
        `<div className="infoWindow">
            <h3>${marker.name}</h3>
            <p>Phone: ${marker.phone}</p>
          </div>`;

      marker.addListener('click', () => {
        // Use slice to create a temporary marker array that can be iterated over to stop the animation for the markers
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
    this.setState({ markers: markers, filteredMarkers: markers });
  };

  // Toggle the animation for the marker that corresponds to each listing. https://reactjs.org/docs/handling-events.html
  // https://codeburst.io/comparison-of-two-arrays-using-javascript-3251d03877fe
  toggleListingMarker = () => {
    if (this.state.activeMarker !== null) {
      let matchedMarker =
        this.state.markers.forEach(marker => this.state.markerInfo.forEach(listing => {
          if (marker.key === listing.key) {
            return marker;
          }
        }));
      this.setState({ activeMarker: matchedMarker })
      console.log('You clicked it!')
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
      this.setVisibleOnAll();
    }
  };

  //Set all markers to visible
  setVisibleOnAll = () => {
    this.state.filteredMarkers.forEach((marker) => marker.setVisible(true))
  };

  // Map over filteredListings and display filtered listings. If null, display all listings
  displayListings = () => {
    if (this.state.filteredListings !== null) {
      let filteredListing = this.state.filteredListings.map(listing => (
        <li key={listing.key}>
          <Listing
            listing={listing}
            // activeMarker={this.state.activeMarker}
            // onClick={this.state.activeMarker.setAnimation(this.props.google.maps.Animation.BOUNCE)}
            google={this.props.google} />
        </li>
      ))
      return filteredListing;
    } else {
      return this.props.markerInfo.map(listing => (
        <li key={listing.key}>
          <Listing
            listing={listing}
            // activeMarker={this.state.activeMarker}
            toggleListingMarker={this.toggleListingMarker}
            google={this.props.google} />
        </li>))
    }
  }

  // listingClickEvent = (listing) => {
  //   const listingMarker = this.state.

  // }

  render() {
    const center = {
      lat: 32.314747,
      lng: -95.249265
    }

    return (
      // Displays Map and markers.
      <Map
        aria-label="map"
        role="application"
        google={this.props.google}
        zoom={14}
        initialCenter={center}
        onClick={this.props.toggleMenu}
        onReady={this.createMarkers} >
        <Drawer
          open={this.props.menuOpen}
          onClose={this.props.toggleMenu} >
          <section className="listMenu">
            <DebounceInput
              minLength={1}
              debounceTimeout={500}
              className='filter'
              element="input"
              type='text'
              placeholder='Filter Listings by Name'
              onChange={e => this.updateQuery(e.target.value)}
              value={this.state.query} />
            <ul className='list'>
              {this.displayListings()}
            </ul>
          </section>
        </Drawer>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCxXK6lMDoTo4dHosssdE0SyJ8UtVOtpbU")
})(MapContainer)
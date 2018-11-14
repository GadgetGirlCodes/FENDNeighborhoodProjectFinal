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

  // Create markers using the props given from google-maps-react via mapProps and map https://github.com/fullstackreact/google-maps-react
  createMarkers = (mapProps, map) => {
    // set google to mapProps from Map for marker creation
    const { google } = mapProps;
    const infoWindow = new google.maps.InfoWindow();

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

    // DONE: Clicking a marker displays unique information about a location somewhere on the page (modal, separate div, inside an infoWindow).

      // Content for each infoWindow. Reference found here https://developers.google.com/maps/documentation/javascript/infowindows
      let windowContent =
        `<div className="infoWindow">
            <h3>${marker.name}</h3>
            <p>Phone: ${marker.phone}</p>
          </div>`;

      marker.addListener('click', () => {
        //close any open infoWindow
        infoWindow.close();
        //set the content for the new window
        infoWindow.setContent(windowContent);
        //show the new window based on the clicked marker
        infoWindow.open(map, marker);
        //set state to activeMarker for use with Listing click event
        this.setState({ activeMarker: marker })
      });

      // store marker into array to push to set to state
      markers.push(marker);
    });

    // set state for markers
    this.setState({ markers: markers, filteredMarkers: markers });
  };

  // Updates filter input if there's a query, then updates listings and markers
  updateQuery = (query) => {
    this.setState({ query: query })
    this.updateListing(query)
  };

  // Set filteredListings state if query input.
  updateListing = (query, map) => {
    if (query) {
      // check listing with query. Used toLowerCase to prevent any hangups with case-sensitivity
      let filteredListings = this.props.markerInfo.filter(listing => (listing.name.toLowerCase().includes(query.toLowerCase())));
      this.setState({ filteredListings: filteredListings });
      this.state.filteredMarkers.forEach((listing) => {
        // check markers with query
        if (!listing.name.toLowerCase().includes(query.toLowerCase())) {
          return listing.setVisible(false);
        }
      })
    } else {
      //clear filtered listings
      this.setState({ filteredListings: null});
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
        <li key={listing.id}>
          <Listing
            listing={listing}
            activeMarker={this.state.activeMarker}
            google={this.props.google} />
        </li>
      ))
      return filteredListing;
    } else {
      return this.props.markerInfo.map(listing => (
        <li key={listing.id}>
          <Listing
            listing={listing}
            activeMarker={this.state.activeMarker}
            google={this.props.google} />
        </li>))
    }
  }

  render() {
    const center = {
      lat: 32.322613,
      lng: -95.262592
    }

    return (
      // Displays Map and markers.
      <Map
        aria-label="map"
        role="application"
        google={this.props.google}
        zoom={15}
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
        {/* <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showInfo}
          onClose={this.onInfoClose}>
          <div>
            <h1>Somethingsomethingsomething</h1>
          </div>
        </InfoWindow> */}
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCxXK6lMDoTo4dHosssdE0SyJ8UtVOtpbU")
})(MapContainer)
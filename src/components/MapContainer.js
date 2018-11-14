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
    selectedPlace: null,
    activeMarker: null,
    showInfo: false,
    query: "",
  }

  // google-maps-react documentation: passing mapProps and map in their examples. https://github.com/fullstackreact/google-maps-react
  createMarkers = (mapProps, map) => {
    // set google to mapProps from Map for marker creation
    const { google } = mapProps;

    // array to store all markers
    let markers = [];

    // For each markerInfo object, generate a Marker
    this.props.markerInfo.forEach(item => {
      const marker = new google.maps.Marker({
        position: { lat: item.position.lat, lng: item.position.lng },
        key: item.key,
        name: item.name,
        map: map,
        animation: google.maps.Animation.Drop,
      });
      
      // infoWindow for markers
      let windowContent =
        `<div className="infoWindow">
            <h3>${marker.name}</h3>
            <p>Phone: ${marker.phone}</p>
          </div>`
      let infoWindow = new google.maps.InfoWindow({
        content: windowContent
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        // if (this.state.activeMarker !== null) {
        //   this.setState({ activeMarker: null, showInfo: false })
        // } else {
        //   this.setState({ activeMarker: clickedMarker, showInfo: true })
        // }
      });


      // store marker into array to push to set to state
      markers.push(marker);
    });
    console.log(markers);
    // set state my markers
    this.setState({ markers: markers, filteredMarkers: markers });
  };

  // Updates filter input if there's a query, then updates listings and markers
  updateQuery = (query) => {
    this.setState({ query: query })
    this.updateListing(query)
  };

  // Set filteredListings state if query input
  updateListing = (query) => {
    if (query) {
      this.setState({
        ...this.state,
        filteredListings: this.filterListings(query),
        filteredMarkers: this.filterMarkers(query)
      });
    } else {
      this.setState({ filteredListings: null, filteredMarkers: null })
    }
  }

  //Update listings based on filter input
  filterListings = (query) => {
    if (!query) {
      return;
    } else {
      return this.props.markerInfo.filter(listing => listing.name.toLowerCase().includes(query.toLowerCase()));
    }
  }

  //Update markers based on filter input
  filterMarkers = (query) => {
    if (!query) {
      return;
    } else {
      return this.state.markers.filter(listing => listing.name.toLowerCase().includes(query.toLowerCase()));
    }
  }


  // // set InfoWindow to show and active marker state when marker is clicked
  // onMarkerClick = (marker, props, e) => {
  //   this.setState({
  //     activeMarker: marker,
  //     selectedPlace: props,
  //     showInfo: !this.state.showInfo
  //   })
  // };

  // onInfoClose = (props) => {
  //   if (this.state.showInfo) {
  //     this.setState({
  //       showInfo: false,
  //       selectedPlace: null,
  //       activeMarker: null
  //     })
  //   }
  // };


  // Map over filteredListings and display filtered listings. If null, display all listings
  displayListings = () => {
    if (this.state.filteredListings !== null) {
      let filteredListing = this.state.filteredListings.map(listing => (
        <li key={listing.id}>
          <Listing
            listing={listing} />
        </li>
      ))
      return filteredListing;
    } else {
      return this.props.markerInfo.map(listing => (
        <li key={listing.id}>
          <Listing
            listing={listing} />
        </li>))
    }
  }

  // componentDidUpdate() {
  //   this.updateListing();
  // }

  render() {
    const center = {
      lat: 32.322613,
      lng: -95.262592
    }

    // TODO: Map displays all location markers by default, and displays the filtered subset of location markers when a filter is applied.

    // TODO: Clicking a marker displays unique information about a location somewhere on the page (modal, separate div, inside an infoWindow).

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
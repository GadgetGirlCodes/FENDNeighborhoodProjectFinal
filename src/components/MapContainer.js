import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import Drawer from '@material-ui/core/Drawer';
import { DebounceInput } from 'react-debounce-input';

class MapContainer extends Component {
  state = {
    markers: [],
    filteredMarkers: null,
    filteredListings: null,
    activeMarker: null,
    query: ""
  }

  // Updates filter input if there's a query, then updates listings and markers
  updateQuery = (query) => {
    this.setState({ query: query })
    this.props.updateListing(query)
  };

  // Map over filteredListings and display filtered listings. If null, display all listings
  displayListings = () => {
    if (this.state.filteredListings !== null) {
      let filteredListing = this.state.filteredListings.map(() => {
        return filteredListing;
      });
    } else {
      let newListing = this.state.allListings.map(() => {
        return newListing;
      });
    }
  };

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
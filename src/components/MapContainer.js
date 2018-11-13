import React, { Component } from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';

class MapContainer extends Component {
  state = {
    showInfo: false
  }

  onMarkerClick = (marker, props, e) => {
    this.setState({
      showInfo: !this.state.showInfo
    })
  };

  onInfoClose = (props) => {
    if (this.state.showInfo) {
      this.setState({
        showInfo: false
      })
    }
  };

  render() {
    const center = {
      lat: 32.322613,
      lng: -95.262592
    }

    // DONE: Map displays all location markers by default, and displays the filtered subset of location markers when a filter is applied.

    // TODO: Clicking a marker displays unique information about a location somewhere on the page (modal, separate div, inside an infoWindow).

    // Displays Map and markers. If filtered, only filtered markers are shown
    return (
      <Map
        aria-label="map"
        role="application"
        google={this.props.google}
        zoom={15}
        initialCenter={center}
        onReady={this.createMarkers}
      >
        {/* Display location information as markers on map */}
        {this.props.filteredListings !== null ?
          (this.props.filteredListings.map((item) => (
            <Marker
              key={item.id}
              position={{ lat: item.coordinates.latitude, lng: item.coordinates.longitude }}
              name={item.name}
              onClick={this.onMarkerClick} >
              <InfoWindow
                key={item.id}
                visible={this.state.showInfo}
                onClose={this.onInfoClose}>
                <div>
                  <h1>Somethingsomethingsomething</h1>
                  <p>More Somethingsomethingsomething</p>
                </div>
              </InfoWindow>
            </Marker>
          ))) :
          (this.props.yelpData.map((item) => (
            <Marker
              key={item.id}
              position={{ lat: item.coordinates.latitude, lng: item.coordinates.longitude }}
              name={item.name}
              onClick={this.onMarkerClick} >
              <InfoWindow
                key={item.id}
                visible={this.state.showInfo}
                onClose={this.onInfoClose}>
                <div>
                  <h1>Somethingsomethingsomething</h1>
                </div>
              </InfoWindow>
            </Marker>
          )))
        }
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCxXK6lMDoTo4dHosssdE0SyJ8UtVOtpbU")
})(MapContainer)
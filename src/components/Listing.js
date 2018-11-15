import React, { Component } from 'react'

class Listing extends Component {
  // use this.props.index to call a new function then pass on the props to pass index back to MapContainer
  // click for the marker at that index position in the list of markers at this.state.markers
  // take the code you already have in the marker click listener and move it into another function that take the index as a parameter. Use that index to look up the marker, then do everything you’re already doing. You current click listener will figure out the index and call that new function. The new function can then also be called by the list and you should get the behavior you want.

  toggleSelectedListing = (index, e) => {
    let marker = this.props.markers[index]
    // let handleClick = this.props.handleListingClick(e.target)
    if (marker === index) {
      // return handleClick();
      return marker;
    // } else {
      //set state to activeMarker
      // this.props.activeMarker.setState({ activeMarker: marker });
      //set marker animation
      // this.props.activeMarker.setAnimation(this.props.google.maps.Animation.BOUNCE);
    }
    console.log(marker)
  }

  // handleMarkerChange = (e) => {
  //   this.props.handleListingClick(e.target.value)
  // }

    render() {
      let displayedImage = (this.props.listing.image_url !== "") ?
        this.props.listing.image_url : 'http://via.placeholder.com/250x250.jpg/FFFFFF/000000/?text=No+Image+Available';

      return (
        <section
          index={this.props.index}
          // Add empty params to onClick function to prevent max update error. Reference: https://stackoverflow.com/questions/48497358/reactjs-maximum-update-depth-exceeded-error
          onClick={() => this.toggleSelectedListing(this.props.index)}
          // onChange={this.handleMarkerChange}
          className='listing'
          marker={this.props.activeMarker}>
          <div tabIndex='0' className="listingName">{this.props.listing.name}</div>
          <div className="listingPhoto">
            <img alt={this.props.listing.name + " photo"} src={displayedImage} />
          </div>
          <div>{this.props.listing.address[0]}</div>
          <div>{this.props.listing.address[1]}</div>
          <div><a href={this.props.listing.url}>See Yelp For More Information about {this.props.listing.name}</a></div>
        </section>
      )
    }
  }

  export default Listing
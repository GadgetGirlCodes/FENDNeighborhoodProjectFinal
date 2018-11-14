import React, { Component } from 'react'

class Listing extends Component {
  render() {
    let displayedImage = (this.props.listing.image_url !== "") ?
      this.props.listing.image_url : 'http://via.placeholder.com/250x250.jpg/FFFFFF/000000/?text=No+Image+Available';

    return (
      <section onClick={this.props.toggleListingMarker()} className='listing' marker={this.props.activeMarker}>
        <div tabIndex='0' className="listingName">{this.props.listing.name}</div>
        <div className="listingPhoto">
          <img alt={this.props.listing.name + " photo"} src={displayedImage}/>
        </div>
        <div>{this.props.listing.address[0]}</div>
        <div>{this.props.listing.address[1]}</div>
        <div><a href={this.props.listing.url}>See Yelp For More Information</a></div>
      </section>
    )
  }
}

export default Listing
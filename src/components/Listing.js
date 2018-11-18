import React, { Component } from 'react'

class Listing extends Component {
  render() {
    //if no available image, display filler
    let displayedImage = (this.props.listing.image_url !== "") ?
      this.props.listing.image_url : 'http://via.placeholder.com/250x250.jpg/FFFFFF/000000/?text=No+Image+Available';

    return (
      <section className="listingContainer">
        <div
         // sets the corresponding marker animation
         onClick={() => this.props.toggleListingMarker(this.props.index)}
         tabIndex='0'
         className="listingName">
         {this.props.listing.name}
         </div>
        <section hidden={this.props.hidden} className="listingDetails" >
          <div className="listingPhoto">
            <img alt={this.props.listing.name + " photo"} src={displayedImage} />
          </div>
          <div>{this.props.listing.address[0]}</div>
          <div>{this.props.listing.address[1]}</div>
          <div><a href={this.props.listing.url}>See Yelp For More Information</a></div>
        </section> 
      </section>
    )
  }
}

export default Listing

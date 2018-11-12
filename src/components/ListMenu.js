import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import { DebounceInput } from 'react-debounce-input';
import Listing from './Listing';

class ListMenu extends Component {
  state = {
    query: "",
    menuOpen: false
  }

  updateQuery = (query) => {
    this.setState({ query: query })
    this.props.updateListing(query)
  };

  // displayFilteredListings = () => {
    
  //     )
  // };

  // displayAllListings = () => {

  //     ))
  // }


  // Display ListMenu and add functionality for open/close
  render() {

    return (
      <Drawer open={this.props.menuOpen} onClose={this.props.toggleMenu}>
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
            { this.props.filteredListings !== null ?
              (this.props.filteredListings
              .map(listing => (
                <li key={listing.id}>
                  <Listing
                    listing={listing}
                  />
                </li>))) :
              (this.props.yelpData
                .map(listing => (
                  <li key={listing.id}>
                    <Listing
                      listing={listing}
                    />
                  </li>)))
            }
          </ul>
        </section>
      </Drawer>
    )
  }
}
export default ListMenu

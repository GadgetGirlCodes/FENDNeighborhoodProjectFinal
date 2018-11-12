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

  // DONE: Includes a text input field or dropdown menu that filters the map markers and list items to locations matching the text input or selection. Filter function runs error-free.
  // DONE: A list-view of location names is provided which displays all locations by default, and displays the filtered subset of locations when a filter is applied.
  
  // TODO: Clicking a location on the list displays unique information about the location, and animates its associated map marker (e.g. bouncing, color change.)

  // Displays ListMenu, available Listings and FilterInput. If filtered, only filtered items are shown.
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

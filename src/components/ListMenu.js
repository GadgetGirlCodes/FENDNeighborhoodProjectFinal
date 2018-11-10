import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import { DebounceInput } from 'react-debounce-input';
import Listing from './Listing';
// import * as locations from './data/locations'



class ListMenu extends Component {
  state = {
    query: "",
    filteredListings: [],
    menuOpen: false
  }

  updateQuery = (query) => {
    this.setState({ query: query })
    this.updateListing(query)
  };

  updateListing = (query) => {
    if (query) {
      this.props.yelpInfo.search(query).then((filteredListings) => {
        if (filteredListings.error) {
          this.setState({ filteredListings: [] })
        } else {
          this.setState({ filteredListings: filteredListings })
        }
      })
    }
  };

  render() {
    return (
      <Drawer open={this.props.menuOpen} onClose={this.props.toggleMenu}>
        <section className="listMenu">
          <DebounceInput
            minLength={2}
            debounceTimeout={500}
            className='filter'
            element="input"
            type='text'
            placeholder='Filter Listings by Name'
            onChange={e => this.updateQuery(e.target.value)}
            value={this.state.query} />
          <ul className='list'>
            {/* <li key={}>
              <Listing
                 />
            </li> */}
          </ul>
        </section>
      </Drawer>
    )
  }
}
export default ListMenu

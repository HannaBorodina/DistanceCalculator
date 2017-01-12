import React, { Component } from 'react';
import Form from './Form';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickUpAddress: null,
      dropOffAddress: null,
      pickUpLatLng: null,
      dropOffLatLng: null
    };
  }

  changeStateDropOff(_dropOffLatLng, _dropOffAddress) {
    this.setState({
      dropOffLatLng: _dropOffLatLng,
      dropOffAddress: _dropOffAddress
    });
  }

  changeStatePickUp(_pickUpLatLng, _pickUpAddress) {
    this.setState({
      pickUpLatLng: _pickUpLatLng,
      pickUpAddress: _pickUpAddress
    });
  }

  render() {
    return (
      <div>
        <h3>Hello, choose addresses!</h3>
        <Form {...this.state} changeStateDropOff={this.changeStateDropOff.bind(this)} changeStatePickUp={this.changeStatePickUp.bind(this)} />
      </div>
    );
  }
}

export default App;

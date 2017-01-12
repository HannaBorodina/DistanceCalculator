import React, { Component } from 'react';
import firebase from 'firebase';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickUpAddress: null,
      dropOffAddress: null,
      pickUpLatLng: null,
      dropOffLatLng: null,
    };
  }
  componentWillMount() {
    const config = {
      apiKey: "AIzaSyAdJ9fuClWYzoYXBICfMDX05dnzJpcg0R4",
      authDomain: 'addresses-ac5de.firebaseio.com',
      databaseURL: "https://addresses-ac5de.firebaseio.com"
    };
    firebase.initializeApp(config);
  }

  componentDidMount() {
    const input1 = document.getElementById('dropoff');
    new window.google.maps.places.Autocomplete(input1);
    const input2 = document.getElementById('pickup');
    new window.google.maps.places.Autocomplete(input2);
  }

  btnOnclick(e) {
    e.preventDefault();
    let distanceMetre = window.google.maps.geometry.spherical.computeDistanceBetween(this.state.pickUpLatLng, this.state.dropOffLatLng);
    let distanceMiles = distanceMetre * 0.000621;
    console.log(distanceMetre);
    console.log(distanceMiles);
    let rootRef = firebase.database();
    if (distanceMiles < 20) {
      rootRef.ref('distances/' + this.uuid()).set({
        distance: distanceMiles,
        dropOffAddress: this.state.dropOffAddress,
        pickUpAddress: this.state.pickUpAddress
      });
      document.getElementById('textPush').innerHTML = "Distance is less than 20 miles, data pushed to firebase";
    }
    document.getElementById('pickup').value = "";
    document.getElementById('dropoff').value = "";
  }

  uuid() {
    let uuid = '';
    uuid += new Date().getTime();
    return uuid;
  }

  onChange1() {
    let self = this;
    let address1 = document.getElementById('pickup').value;
    let geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ 'address': address1 }, function handleResults(results, status) {
      if (status === window.google.maps.GeocoderStatus.OK) {
        let _pickUpLatLng = results[0].geometry.location;
        let _pickUpAddress = results[0].formatted_address;
        self.setState({
          pickUpLatLng: _pickUpLatLng,
          pickUpAddress: _pickUpAddress,
        });
      }
    });
    document.getElementById('textPush').innerHTML = "";
  }

  onChange2() {
    let self = this;
    let address2 = document.getElementById('dropoff').value;
    let geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ 'address': address2 }, function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK) {
        let _dropOffLatLng = results[0].geometry.location;
        let _dropOffAddress = results[0].formatted_address;
        self.setState({
          dropOffLatLng: _dropOffLatLng,
          dropOffAddress: _dropOffAddress,
        });
      }
    });
    document.getElementById('textPush').innerHTML = "";
  }

  render() {
    return (
      <form>
        <label>
          Pick up address:
          <input className="form-control" type="text" id="pickup" size="50" placeholder="input address" onBlur={this.onChange1.bind(this)} />
        </label><br />
        <label>
          Drop off address:
          <input className="form-control" type="text" id="dropoff" size="50" placeholder="input address" onBlur={this.onChange2.bind(this)} />
        </label><br />
        <button className="btn btn-info" onClick={this.btnOnclick.bind(this)}>Calculate distance</button>
        <p id="textPush"></p>
      </form>
    );
  }
}

export default Form;

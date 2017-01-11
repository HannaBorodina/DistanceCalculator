import React, { Component } from 'react';
import firebase from 'firebase';

let textInput1 = null;
let textInput2 = null;


class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickUpAddress: null,
      dropOffAddress: null,
      lat1: null,
      lng1: null,
      lat2: null,
      lng2: null
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
    var input = document.getElementById('dropoff');
    new window.google.maps.places.Autocomplete(input);
    var input2 = document.getElementById('pickup');
    new window.google.maps.places.Autocomplete(input2);
  }

  btnOnclick(e) {
    e.preventDefault();
    var k = new window.google.maps.LatLng(this.state.lat1, this.state.lng1);
    var p = new window.google.maps.LatLng(this.state.lat2, this.state.lng2);
    var distanceMetre = window.google.maps.geometry.spherical.computeDistanceBetween(k, p);
    var distanceMiles = distanceMetre * 0.000621
    var rootRef = firebase.database();
    if (distanceMiles < 20) {
      rootRef.ref('distances/' + this.uuid()).set({
        distance: distanceMiles,
        dropOffAddress: this.state.dropOffAddress,
        pickUpAddress: this.state.pickUpAddress
      });
      document.getElementById('textPush').innerHTML = "Distance is less than 20 miles, data pushed to firebase";
    }
  }

  uuid() {
    var uuid = '';
    uuid += new Date().getTime();
    return uuid;
  }

  onChange1() {
    var self = this;
    var address1 = textInput1.value;
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ 'address': address1 }, function handleResults(results, status) {
      if (status === window.google.maps.GeocoderStatus.OK) {
        var _pickUpAddress = results[0].formatted_address;
        var _lat1 = results[0].geometry.location.lat();
        var _lng1 = results[0].geometry.location.lng();
        self.setState({
          pickUpAddress: _pickUpAddress,
          lat1: _lat1,
          lng1: _lng1
        });
      }
    });
    document.getElementById('textPush').innerHTML = "";
  }

  onChange2() {
    var self = this;
    var address2 = textInput2.value;
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ 'address': address2 }, function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK) {
        var _dropOffAddress = results[0].formatted_address;
        var _lat2 = results[0].geometry.location.lat();
        var _lng2 = results[0].geometry.location.lng();
        self.setState({
          dropOffAddress: _dropOffAddress,
          lat2: _lat2,
          lng2: _lng2
        });
      }
    });
    document.getElementById('textPush').innerHTML = "";
  }

  render() {
    return (
      <form>
        <label>
          Pick-up address:
          <input className="form-control" type="text" ref={(input) => { textInput1 = input; } } id="pickup" size="50"
            placeholder="input address" onBlur={this.onChange1.bind(this)} />
        </label><br />
        <label>
          Drop off address:
          <input className="form-control" type="text" ref={(input) => { textInput2 = input; } } id="dropoff" size="50"
            placeholder="input address" onBlur={this.onChange2.bind(this)} />
        </label><br />
        <button className="btn btn-info" onClick={this.btnOnclick.bind(this)}>Calculate distance</button>
        <p>{this.state.lat1} {this.state.lng1} </p>
        <p>{this.state.lat2} {this.state.lng2} </p>
        <p id="textPush"></p>
      </form>
    );
  }
}

export default Form;

import React, { Component } from "react";
import axios from "axios";
import { HOME, API_ENDPOINT, LOGIN_CUSTOMER, FETCH_USER_DETAILS } from "../../data";
import { Authentication } from "../../services";
import GlobalNavbar from "../common/GlobalNavbar";
import "./FlightDetails.css";
import Switch from "@material-ui/core/Switch";

import InputLabel from '@mui/material/InputLabel';

import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';



export default class FlightDetails extends Component {
  constructor(props) {
    super(props);
    if (!this.props.location.state || !this.props.location.state._id) {
      this.props.history.push(HOME);
    }
    this.state = {
      flightId: this.props.location.state._id,
      departureDate: this.props.location.state.departureDate,
      price: this.props.location.state.price,
      flightDetails: {},
      userdetails:{},
      checked: false, 
      row: "",
      seat: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleBooking = this.handleBooking.bind(this);
    this.instance = axios.create({
      baseURL: API_ENDPOINT,
      timeout: 1000,
      headers: { Authorization: Authentication.bearerToken },
    });
  }

  handleChange = () =>{
    
    this.setState({
      checked: !(this.state.checked),
    })
  }

  confirmRow = (event) => {
    console.log(event.target.value);
    this.setState({
      row: event.target.value,
    })
  }

  confirmSeat = (event) => {
    console.log(event.target.value);
    this.setState({
      seat: event.target.value,
    })
  }
  
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }
  handleBooking() {

    console.log(this.state.checked);
    if(this.state.checked){
      this.setState({
        price : this.state.flightDetails.price - this.state.userdetails.mileagePoints/10,
      })
    }else{
      this.setState({
        price : this.state.flightDetails.price,
      })
    }
    const requestBody = {
      customerId: Authentication.userId,
      flightId: this.state.flightDetails._id,
      departureDate: this.state.flightDetails.departureDate,
      price: this.state.price,
      departureFrom: this.state.flightDetails.departureFrom,
      arrivalAt: this.state.flightDetails.arrivalAt,
      checked: this.state.checked,
      seatNo: this.state.seat,
      row: this.state.row,
    };
    this.instance
      .post("/booking/create", requestBody)
      .then((response) => {
        if (!response.data.errors) {
          console.log("Booking created successfully");
          this.props.history.push("/customer/dashboard");
        } else {
          console.log("Booking could not be created");
        }
      })
      .catch((error) => {
        console.error(
          "[FLIGHT-DETAILS] Error occured, redirecting to Login page."
        );
        Authentication.logout();
        this.props.history.push(LOGIN_CUSTOMER);
      });
  }
  componentDidMount() {
    document.title = "American Airlines :: Flight Details";
    this.instance
      .post("/flight/fetch", { id: this.state.flightId })
      .then((response) => {
        if (response.data.errors) {
          console.log("Flight not found");
        } else {
          console.log(response.data.payLoad[0]);
          this.setState({ flightDetails: response.data.payLoad[0] });
        }
      })
      .catch((error) => {
        console.error("[FLIGHT-DETAILS] Error occured");
        Authentication.logout();
        this.props.history.push(LOGIN_CUSTOMER);
      });

     
        this.instance
          .get(FETCH_USER_DETAILS + "/" + Authentication.userId)
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              const userDetails = response.data;
              this.setState({
               userdetails : userDetails,
              });
            } else {
              console.log(response.data.errors);
            }
          }) 
          .catch((error) => {
            console.error(error);
          });
  }
  render() {
    return (
      <div>
      <div>
        <GlobalNavbar></GlobalNavbar>
        <div className="container property-container">
          <div className="row property-details-in-page-nav">
            <ul class="nav">
              <li class="nav-item property-details-nav-item">
                <a class="nav-link active" href="#overview">
                  Overview
                </a>
              </li>
            </ul>
          </div>
          <div className="row property-details-body">
            <div className="col-9 property-details-content">
              {/* Title */}
              <div id="overview">
                <h2 className="property-detail-heading">
                 {/* <strong>{this.state.flightDetails.flightNo}</strong> */} 
                </h2>
              </div>
              <hr className="property-line"></hr>
              {/* Description */}
              <div id="about">
                <div class="row">
                  <div class="col-2">
                    <div class="property-summary">Special Instructions</div>
                  </div>
                  <div class="col-10">
                    <div class="property-description">
                      <p align="justify">
                        { /*this.state.flightDetails.description */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="property-line"></hr>
              <div id="amenities">
                <h2>
                  <strong>Details</strong>
                </h2>
                <table class="table amenity-table table-striped">
                  <tbody>
                    <tr>
                      <td align="center">
                        <strong>Departure From :</strong>
                      </td>
                      <td align="left">
                        {this.state.flightDetails.departureFrom}
                      </td>
                      <td align="left"></td>
                    </tr>
                    <tr>
                      <td align="center">
                        <strong>Arrival At :</strong>
                      </td>
                      <td align="left">{this.state.flightDetails.arrivalAt}</td>
                      <td align="left"></td>
                    </tr>
                    <tr>
                      <td align="center">
                        <strong>Departure Date :</strong>
                      </td>
                      <td align="left">
                        {new Date(
                          this.state.flightDetails.departureDate
                        ).toDateString()}
                      </td>
                      <td align="left"></td>
                    </tr>
                  </tbody>
                </table>
                
              </div>
              
            </div>

           
          
            <div className="col-3 property-pricing-booking">
              <div className="property-booking-assistance">
                Book Online or call American Airlines Booking Assistance
                888-829-7076
              </div>
              <div className="property-booking-block affix-top">
               
                <div className="property-booking-block-container">
               
                  <div className="property-booking-block-price-calculator">
                    <div className="property-booking-block-price-text">
                   
                      <h1 className="pbbptt">
                        ${this.state.flightDetails.price}
                      </h1>
                      <h6 className="pbbptt">per seat</h6>
                    </div>
                    <div>
                          <h5>Do you want to use your Mileage reward points?</h5>
                          <Switch checked={this.checked} onChange={this.handleChange} name="checked" />
                    </div>
                    {console.log(this.state.checked)}
                    { this.state.checked === true ? (<div class="pbbpc-total">
                    <h4>Total using Mileage points : ${this.state.flightDetails.price - this.state.userdetails.mileagePoints/10}</h4>
                    <h6>you're saving ${this.state.userdetails.mileagePoints/10}</h6>
                  </div>) : ( <div class="pbbpc-total">
                  <h4>Total : ${this.state.flightDetails.price}</h4>
                </div>)}
                    
                   
                    <button
                      onClick={this.handleBooking}
                      className="btn pbbpc-button"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div >
      <h3>Select Row and Seat number</h3>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel variant="standard" htmlFor="uncontrolled-native">
        Row
      </InputLabel>
      <NativeSelect
        defaultValue={"B"}
        inputProps={{
          name: 'row',
          id: 'uncontrolled-native',
        }}
        value={this.state.row}
                  onChange={this.confirmRow}
      >
        <option value={"A"}>A</option>
        <option value={"B"}>B</option>
        <option value={"C"}>C</option>
        <option value={"D"}>D</option>
        <option value={"E"}>E</option>
        <option value={"F"}>F</option>
      </NativeSelect>
    </FormControl>
             
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Seat No
                </InputLabel>
                <NativeSelect
                  defaultValue={6}
                  inputProps={{
                    name: 'seatNo',
                    id: 'uncontrolled-native',
                  }}
                  value={this.state.seat}
                  onChange={this.confirmSeat}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={7}>7</option>
                  <option value={8}>8</option>
                  <option value={9}>9</option>
                  <option value={10}>10</option>
                </NativeSelect>
              </FormControl>
            
            </div>
            </div>
    );
  }
}

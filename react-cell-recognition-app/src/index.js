import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from './serviceWorker';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCol} from "mdbreact";
import "./index.css";
import Modal from "./modal.js"

const API_UPLOAD_ENDPOINT_PRODUCTION = "https://cell-recognition-app-backend.herokuapp.com/api/images/upload";
const API_UPLOAD_ENDPOINT_DEBUG = "http://localhost:90/api/images/upload";

const UPLOAD_BUTTON_TEXT_INITIAL_STATE = "UPLOAD CELLS PHOTO";
const UPLOAD_BUTTON_TEXT_AFTER_FIRST_UPLOAD_STATE = "UPLOAD ANOTHER PHOTO";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      events: [],

      photoDisplayedOnMainScreenFile: null,
      photoDisplayedOnMainScreenURL: null,
      photoSelectedFile: null,
      photoSelectedURL: null,
      uploading: false,
      uploadButtonEnabled: true,
      sendButtonEnabled: false,
      uploadButtonText: UPLOAD_BUTTON_TEXT_INITIAL_STATE,
      loadingSpinnerVisible: false
    };

    console.log("Initializing...")

    // This binding makes 'this' available in the callback.
    this.onPhotoHasBeenSelected = this.onPhotoHasBeenSelected.bind(this)
    this.onPictureWithResultsReceivedFromBackendAnalysis = this.onPictureWithResultsReceivedFromBackendAnalysis.bind(this)
    this.onSendPictureToBackendAnalysisTriggered = this.onSendPictureToBackendAnalysisTriggered.bind(this)
    this.onUploadFromLocalMachineToFrontendPreviewTriggered = this.onUploadFromLocalMachineToFrontendPreviewTriggered.bind(this)
    this.toggleModalTriggered = this.toggleModalTriggered.bind(this)
  }

  onPhotoHasBeenSelected(event) {
    this.setState({
        photoSelectedFile: event.target.files[0],
        photoSelectedURL: URL.createObjectURL(event.target.files[0])
    })
  }

  onUploadFromLocalMachineToFrontendPreviewTriggered(event) {
    this.setState({
      photoDisplayedOnMainScreenFile: this.state.photoSelectedFile,
      photoSelectedFile: null,
      photoDisplayedOnMainScreenURL: this.state.photoSelectedURL,
      photoSelectedURL: null,
      sendButtonEnabled: true,
      uploadButtonText: UPLOAD_BUTTON_TEXT_AFTER_FIRST_UPLOAD_STATE,
    });
  }

  toggleModalTriggered() {
    this.setState({
      modal: !this.state.modal
    });
  };

  onPictureWithResultsReceivedFromBackendAnalysis(receivedPicturePath) {
        console.log("Answer received.")

        this.setState({
          photoDisplayedOnMainScreenFile: null,
          photoDisplayedOnMainScreenURL: receivedPicturePath,
          uploadButtonEnabled: true,
          sendButtonEnabled: false,
          loadingSpinnerVisible: false
        })
    }

  onSendPictureToBackendAnalysisTriggered() {
     var xhr = new XMLHttpRequest()
     var formData = new FormData();

     formData.append('file', this.state.photoDisplayedOnMainScreenFile);
     xhr.open(this.method, this.url, true);
     xhr.setRequestHeader('Content-Type', 'multipart/form-data');

     xhr.onreadystatechange = function() {
         if (xhr.readyState == XMLHttpRequest.DONE) {
             console.log("Upload finished!");
             console.log(xhr.responseText);
             this.onPictureWithResultsReceivedFromBackendAnalysis(xhr.responseText);
         }
     }.bind(this);

     xhr.open('POST', API_UPLOAD_ENDPOINT_PRODUCTION)
//     xhr.open('POST', API_UPLOAD_ENDPOINT_DEBUG)

     xhr.send(formData)
     console.log("Request sent.")

     this.setState({
        uploadButtonEnabled: false,
        sendButtonEnabled: false,
        loadingSpinnerVisible: true
     });
  }

  render() {
    return (
      <React.Fragment>
        <MDBContainer>
          <MDBRow>
            <MDBCol md="12" className="mb-r">
              <h2 className="text-uppercase text-center my-5">Cells Recognition App</h2>
              <h4 className="my-3 text-center">Please upload your cells photo, to let the Artificial Intelligence to find, recognize,
              and count them.</h4>
              {/*<div id="schedule-items">
                {this.state.events.map(event => (
                  <Event
                    key={event.id}
                    id={event.id}
                    time={event.time}
                    title={event.title}
                    location={event.location}
                    description={event.description}
                  />
                ))}
              </div>*/}

              <MDBRow className="my-5">
                <MDBCol xl="6" md="6" className="mx-auto text-center">
                    <img class="img-fluid rounded" style={{maxHeight: 400,}} src={this.state.photoDisplayedOnMainScreenURL} />
                </MDBCol>
              </MDBRow>

              {/*<MDBRow className="my-2">
                <MDBCol xl="6" md="6" className="mx-auto text-center">
                    <div class="spinner-border text-primary centered" role="status" style={{visibility: this.state.loadingSpinnerVisible ? 'visible' : 'hidden' }}>
                        <span class="sr-only">Loading...</span>
                    </div>
                </MDBCol>
              </MDBRow>*/}

              <MDBRow center className="my-5">
                <MDBCol size="2"/>
                <MDBCol size="4" className="mx-auto text-center">
                  <MDBBtn color="info" rounded onClick={this.toggleModalTriggered} disabled={!this.state.uploadButtonEnabled}>
                    {this.state.uploadButtonText}
                  </MDBBtn>
                </MDBCol>
                <MDBCol size="4" className="mx-auto text-center">
                  <MDBBtn color="info" rounded onClick={this.onSendPictureToBackendAnalysisTriggered} disabled={!this.state.sendButtonEnabled}>
                    Send photo to analysis
                  </MDBBtn>
                </MDBCol>
                <MDBCol size="2"/>
              </MDBRow>

            </MDBCol>
          </MDBRow>

          <MDBRow className="fixed-bottom">
            <MDBCol md="12" className="mb-r">
                <h6 className="text-center my-5">Cells Recognition App by Rafal Ozog | Dreamcatcher Apps | 2021</h6>
            </MDBCol>
          </MDBRow>
        </MDBContainer>

        <MDBModal isOpen={this.state.modal} toggle={this.toggleModalTriggered}>
          <MDBModalHeader
            className="text-center"
            titleClass="w-100 font-weight-bold"
            toggle={this.toggleModalTriggered}
          >
            Upload cells photo
          </MDBModalHeader>
          <MDBModalBody>
            <form className="mx-3 grey-text">
              <div className="input-group">
                    <div className="custom-file">
                        <input
                            type="file"
                            className="custom-file-input"
                            id="inputGroupFile01"
                            aria-describedby="inputGroupFileAddon01"
                            onChange={this.onPhotoHasBeenSelected}
                        />
                        <label className="custom-file-label" htmlFor="inputGroupFile01">
                            Choose file
                        </label>
                    </div>
              </div>
              <MDBRow className="my-5">
                <MDBCol xl="12"className="mx-auto text-center">
                    <img class="img-fluid rounded" style={{maxHeight: 300,}} src={this.state.photoSelectedURL}/>
                </MDBCol>
              </MDBRow>
              <MDBInput
                name="description"
                label="Description (optional)"
                icon="sticky-note"
                group
                type="textarea"
              />
            </form>
          </MDBModalBody>
          <MDBModalFooter className="justify-content-center">
            <MDBBtn
              color="info"
              onClick={() => {
                this.toggleModalTriggered();
                this.onUploadFromLocalMachineToFrontendPreviewTriggered();
              }}
            >
              Add
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>

      </React.Fragment>
    );
  }
}

class Event extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="media mt-1">
          <h3 className="h3-responsive font-weight-bold mr-3">
            {this.props.time}
          </h3>
          <div className="media-body mb-3 mb-lg-3">
            <h6 className="mt-0 font-weight-bold">{this.props.title} </h6>{" "}
            <hr className="hr-bold my-2" />
            {this.props.location && (
              <React.Fragment>
                <p className="font-smaller mb-0">
                  <MDBIcon icon="location-arrow" /> {this.props.location}
                </p>
              </React.Fragment>
            )}
          </div>
        </div>
        {this.props.description && (
          <p className="p-2 mb-4  blue-grey lighten-5 blue-grey lighten-5">
            {this.props.description}
          </p>
        )}
      </React.Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
serviceWorker.unregister();
import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from './serviceWorker';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCol} from "mdbreact";
import "./index.css";
import Modal from "./modal.js"

class App extends Component {

  apiPath = "https://cell-recognition-app-backend.herokuapp.com/api/";

//  initialUploadButtonText = "UPLOAD CELLS PHOTO"
//  updatedUploadButtonText = "UPLOAD ANOTHER PHOTO"

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      events: [],

      photoDisplayedOnMainScreen: null,
      photoSelected: null,
      uploading: false,
      uploadButtonEnabled: true,
      sendButtonEnabled: false,
      uploadButtonText: "UPLOAD CELLS PHOTO",
      loadingSpinnerVisible: false
    };

    console.log("Initializing...")

    this.onPhotoSelected = this.onPhotoSelected.bind(this)
    this.receiveAnalysisResultPicture = this.receiveAnalysisResultPicture.bind(this)
    this.sendPictureToAnalysis = this.sendPictureToAnalysis.bind(this)

    this.uploadEvent = this.uploadEvent.bind(this)

    this.apiPath = "https://cell-recognition-app-backend.herokuapp.com/api/"
  }

  onPhotoSelected(event) {
    this.setState({
        photoSelected: URL.createObjectURL(event.target.files[0])
    })
    console.log(this.state. photo != null)
  }

//  uploadEvent = () => {
  uploadEvent(event) {
    this.setState({
      photoDisplayedOnMainScreen: this.state.photoSelected,
      sendButtonEnabled: true,
      uploadButtonText: "UPLOAD ANOTHER PHOTO",
      photoSelected: null
    });
  }

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  sendPictureToAnalysis() {
     var xhr = new XMLHttpRequest()
     var formData = new FormData();
     formData.append('file', this.state.photoDisplayedOnMainScreen);
     xhr.open(this.method, this.url, true);
     xhr.setRequestHeader('Content-Type', 'multipart/form-data');
     xhr.addEventListener('load', this.receiveAnalysisResultPicture)
//     var path: apiPath + 'images/upload'
     xhr.open('POST', "https://cell-recognition-app-backend.herokuapp.com/api/")
     xhr.send(formData)
     console.log("Request sent.")

     this.setState({
        uploadButtonEnabled: false,
        sendButtonEnabled: false,
        loadingSpinnerVisible: true
     });
  }

  receiveAnalysisResultPicture() {
      console.log("Answer received.")

      this.setState({
        photoDisplayedOnMainScreen: "https://techcrunch.com/wp-content/uploads/2014/12/matrix.jpg",
        uploadButtonEnabled: true,
        sendButtonEnabled: false,
        loadingSpinnerVisible: false
      })
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
              <div id="schedule-items">
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
              </div>

              <MDBRow className="my-5">
                <MDBCol xl="6" md="6" className="mx-auto text-center">
                    <img class="img-fluid rounded" src={this.state.photoDisplayedOnMainScreen} />
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
                  <MDBBtn color="info" rounded onClick={this.toggleModal} disabled={!this.state.uploadButtonEnabled}>
                    {this.state.uploadButtonText}
                  </MDBBtn>
                </MDBCol>
                <MDBCol size="4" className="mx-auto text-center">
                  <MDBBtn color="info" rounded onClick={this.sendPictureToAnalysis} disabled={!this.state.sendButtonEnabled}>
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

        <MDBModal isOpen={this.state.modal} toggle={this.toggleModal}>
          <MDBModalHeader
            className="text-center" 
            titleClass="w-100 font-weight-bold"
            toggle={this.toggleModal}
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
                            onChange={this.onPhotoSelected}
                        />
                        <label className="custom-file-label" htmlFor="inputGroupFile01">
                            Choose file
                        </label>
                    </div>
              </div>
              <MDBRow className="my-5">
                <MDBCol xl="12"className="mx-auto text-center">
                    <img class="img-fluid rounded" src={this.state.photoSelected}/>
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
                this.toggleModal();
                this.uploadEvent();
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
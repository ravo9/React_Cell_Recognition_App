import React, { Component } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBBadge, MDBContainer, MDBRow, MDBCol} from "mdbreact";
import "./index.css";

// This is a try of moving Modal to separate component. Not finished.

class Modal extends Component {

    constructor(props) {
        super(props);
        this.state = {
          isOpen: false
      }
    }

    toggleModal = () => {
        this.setState({
            isOpen: !this.state.isOpen
    });
    };

    render() {
      return (
        <MDBModal isOpen={this.state.isOpen} toggle={true}>
          <MDBModalHeader
            className="text-center" 
            titleClass="w-100 font-weight-bold"
            toggle={true}
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
                            onChange={null}
                        />
                        <label className="custom-file-label" htmlFor="inputGroupFile01">
                            Choose file
                        </label>
                    </div>
              </div>
              <MDBRow className="my-5">
                <MDBCol xl="12"className="mx-auto text-center">
                    <img class="img-fluid rounded" src={null}/>
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
            >
              Add
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      );
    }
}

export default Modal;
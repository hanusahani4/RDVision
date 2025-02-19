import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserReport from '../components/UserReport';


function toCaptain(props) {
  // Define parameters for each tab
  const params = {
    allTickets: {},
    ongoing: { ticketStatus: 'Sale' },
    newTickets: { ticketStatus: 'New' },
  };

  ///pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Action modal active
  const [activeTab, setActiveTab] = useState('allTickets');

  // Function to handle tab click
  const handleRowClick = (tabName) => {
    setActiveTab(tabName);
    setCurrentPage(0);
    fetchTickets(params[tabName], 0);
  };

  // Post assign
  const [apiResponse, setApiResponse] = useState(null);

  // State for selected tickets
  const [selectedTickets, setSelectedTickets] = useState([]);

  // Function to handle ticket selection
  const handleTicketSelect = (e, id) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedTickets([...selectedTickets, id]);
    } else {
      setSelectedTickets(selectedTickets.filter(ticketId => ticketId !== id));
    }
  };

  //hnadling multiple selection
  const handleMultipleTicketSelection = (e) => {
    const checked = e.target.checked; // Use `checked` instead of `value` to determine if the checkbox is checked
    if (checked) {
      let newSelectedTickets = [...selectedTickets]; // Start with the current state
      for (let i = 0; i < data.length; i++) {
        newSelectedTickets.push(data[i].uniqueQueryId); // Add the new elements
      }
      setSelectedTickets(newSelectedTickets); // Update the state once with the new array
    } else {
      setSelectedTickets([]); // Reset to an empty array
    }
  };
  // Function to send POST request
  const sendPostRequest = async () => {
    try {
      const payload = selectedTickets;
      const config = {
        headers: {
          // 'userId': parseInt(selectedUser)
        }
      };


      // Construct the URL with the ticketId
      const url = `/third_party_api/ticket/assignToUser/${selectedUser}`;
      const response = await axiosInstance.post(url, payload, config);
      setApiResponse(response.data);
      toast.success('Tickets assigned to captain successfully!');
      handleClose();
      fetchTickets()
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to assign tickets.');
    }
  };
  //Short Method
  const [shortValue, setShortValue] = useState("")
  const handleShortDataValue = (e) => {
    setShortValue(e.target.value)
  }
  // State for modal visibility
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (selectedTickets.length > 0) {
      setShow(true)
    } else {
      toast.info("Please select at least One Ticket")
    }
  }


  // Users
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedTeam] = useState('');

  // Fetch users on component 
  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get('/user/dropdown', {
        params: { roleId: 3 }
      });
      setUser(response.data.dtoList);
    };

    fetchData();
  }, []);

  // Handle user selection
  const handleSelectTeam = (e) => {
    setSelectedTeam(e.target.value);
  };

  // State for tickets
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get('/third_party_api/ticket/ticketByStatus');
      setData(response.data.dtoList);
    };
    fetchData();
  }, []);

  // Function to fetch tickets based on parameters
  const fetchTickets = async (params, page) => {
    try {
      const response = await axiosInstance.get('/third_party_api/ticket/ticketByStatus', {
        params: { ...params, page }
      });
      setData(response.data.dtoList);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  // Fetch all tickets on component mount
  useEffect(() => {
    fetchTickets(params.allTickets, 0);
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      fetchTickets(params[activeTab], currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchTickets(params[activeTab], currentPage + 1);
    }
  };

  console.log("Props user Id is ",props.userId)

  return (
    <>
     


      <section className="data-table-bgs_02x24 py-3">
        <div className="container-fluid">
          <div className="table-wrapper tabbed-table">
            <div className="heading-wrapper">
              <h3 className="title">All Tickets</h3>
              <Button onClick={handleShow} className="btn btn-assign" data-bs-toggle="modal" data-bs-target="#assignTicketModal">Assign to Captain</Button>
            </div>
            <ul className="nav recent-transactions-tab-header nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button className={`nav-link ${activeTab === "allTickets" ? "active" : ""}`}
                  onClick={() => handleRowClick("allTickets")} id="all-transactions-tab" data-bs-toggle="tab" data-bs-target="#all-transactions-tab-pane" type="button" role="tab" aria-controls="all-transactions-tab-pane" aria-selected="true">All Tickets</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className={`nav-link ${activeTab === "ongoing" ? "active" : ""}`}
                  onClick={() => handleRowClick("ongoing")} id="pendings-tab" data-bs-toggle="tab" data-bs-target="#pendings-tab-pane" type="button" role="tab" aria-controls="pendings-tab-pane" aria-selected="false" tabindex="-1">Ongoing</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className={`nav-link ${activeTab === "newTickets" ? "active" : ""}`}
                  onClick={() => handleRowClick("newTickets")} id="new-arrivals-tab" data-bs-toggle="tab" data-bs-target="#new-arrivals-tab-pane" type="button" role="tab" aria-controls="new-arrivals-tab-pane" aria-selected="false" tabindex="-1">New Tickets</button>
              </li>
            </ul>
            <div className="tab-content recent-transactions-tab-body" id="myTabContent">
              <div className="tab-pane fade show active" id="all-transactions-tab-pane" role="tabpanel" aria-labelledby="all-transactions-tab" tabindex="0">
                <div className="tickets-table table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="selection-cell-header" data-row-selection="true">
                          <input type="checkbox" className="" onChange={(e) => handleMultipleTicketSelection(e)} />
                        </th>
                        <th tabindex="0">Date/Time</th>
                        <th tabindex="0">Country</th>
                        <th tabIndex="0">Customer Name</th>
                        <th tabIndex="0">Customer Number</th>
                        <th tabIndex="0">Customer Email</th>
                        <th tabIndex="0">Ticket ID</th>
                        <th tabIndex="0">Requirement</th>
                        <th tabIndex="0">Product Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.filter(
                        (item) =>
                          item.senderMobile.toLowerCase().includes(shortValue.toLowerCase()) ||
                          item.senderEmail.toLowerCase().includes(shortValue.toLowerCase()) ||
                          item.senderName.toLowerCase().includes(shortValue.toLowerCase())
                      ).map((item, index) => (
                        <tr key={index}>
                          <td className="selection-cell">
                            <input
                              type="checkbox"
                              checked={selectedTickets.includes(item.uniqueQueryId)}
                              onChange={(e) => handleTicketSelect(e, item.uniqueQueryId)}
                            />
                          </td>
                          <td>{item.queryTime}</td>
                          <td>{item.senderCountryIso}</td>
                          <td>{item.senderName}</td>
                          <td>{item.senderMobile}</td>
                          <td>{item.senderEmail}</td>
                          <td>{item.uniqueQueryId}</td>
                          <td>{item.subject}</td>
                          <td>{item.queryProductName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* <!-- pending tab --> */}
              <div className="tab-pane fade" id="pendings-tab-pane" role="tabpanel" aria-labelledby="pendings-tab" tabindex="0">
                <div className="tickets-table table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="selection-cell-header" data-row-selection="true">
                          <input type="checkbox" className="" onChange={(e) => handleMultipleTicketSelection(e)} />
                        </th>
                        <th tabindex="0">Query ID</th>
                        <th tabindex="0">Client Name</th>
                        <th tabindex="0">Query Type</th>
                        <th tabindex="0">Ticket Status</th>
                        <th tabindex="0">Source</th>
                        <th tabindex="0">Sender Mobile</th>
                        <th tabindex="0">Sender Email</th>
                        <th tabindex="0"> Message/Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>#12548796</td>
                        <td>John Skrew</td>
                        <td>Medical Equipments</td>
                        <td><span className="status">GAds</span></td>
                        <td>+91 XXXXXXXX 90</td>
                        <td>****@gmail.com</td>
                        <td>Connected</td>
                        <td>Lorem ipsum dolor sit amet....</td>
                      </tr>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>#12548796</td>
                        <td>John Skrew</td>
                        <td>IT Softwares</td>
                        <td><span className="status">FB</span></td>
                        <td>+91 XXXXXXXX 90</td>
                        <td>****@gmail.com</td>
                        <td>No Response</td>
                        <td>Lorem ipsum dolor sit amet....</td>
                      </tr>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>#12548796</td>
                        <td>John Skrew</td>
                        <td>Medical Drug</td>
                        <td><span className="status">IG</span></td>
                        <td>+91 XXXXXXXX 90</td>
                        <td>****@gmail.com</td>
                        <td>No Answer</td>
                        <td>Lorem ipsum dolor sit amet....</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* <!-- new tab --> */}
              <div className="tab-pane fade" id="new-arrivals-tab-pane" role="tabpanel" aria-labelledby="new-arrivals-tab" tabindex="0">
                <div className="tickets-table table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="selection-cell-header" data-row-selection="true">
                          <input type="checkbox" className="" onChange={(e) => handleMultipleTicketSelection(e)} />
                        </th>
                        <th tabindex="0">Ticket ID</th>
                        <th tabindex="0">Client Name</th>
                        <th tabindex="0">Category/Department</th>
                        <th tabindex="0">Source</th>
                        <th tabindex="0">Contact</th>
                        <th tabindex="0">Email</th>
                        <th tabindex="0">Description/Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>#12548796</td>
                        <td>John Skrew</td>
                        <td>Medical Equipments</td>
                        <td><span className="status">GAds</span></td>
                        <td>+91 XXXXXXXX 90</td>
                        <td>****@gmail.com</td>
                        <td>Lorem ipsum dolor sit amet....</td>
                      </tr>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>#12548796</td>
                        <td>John Skrew</td>
                        <td>IT Softwares</td>
                        <td><span className="status">FB</span></td>
                        <td>+91 XXXXXXXX 90</td>
                        <td>****@gmail.com</td>
                        <td>Lorem ipsum dolor sit amet....</td>
                      </tr>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>#12548796</td>
                        <td>John Skrew</td>
                        <td>Medical Drug</td>
                        <td><span className="status">IG</span></td>
                        <td>+91 XXXXXXXX 90</td>
                        <td>****@gmail.com</td>
                        <td>Lorem ipsum dolor sit amet....</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="pagination-controls">
            <button onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</button>
            <span>Page {currentPage + 1} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>Next</button>
          </div>
        </div>
      </section>

      {/* <!-- Assign Ticket Modal --> */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tickets Assign to Captain</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="teamSelect">Select Captain</label>
              <select
                id="inputTeam"
                name="userId"
                value={selectedUser}
                onChange={handleSelectTeam}
                className="form-select"
              >
                <option value="">Choose Captain</option>
                {user.map(user => (
                  <option key={user.userId} value={user.userId}>{user.firstName} {user.lastName}</option>
                ))}
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={sendPostRequest}>
            Assign Tickets
          </Button>
        </Modal.Footer>
      </Modal>

      {/* <!-- Modal --> */}
      <div className="modal ticket-modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="row">
                <div className="col-4">
                  <div className="heading-area">
                    <div className="vertical-write">
                      <h2 className="title">Jenell D. Matney</h2>
                      <p className="ticket-id"><i className="fa-solid fa-ticket"></i> TKTID:MEDEQ089N</p>
                    </div>
                  </div>
                </div>
                <div className="col-8">
                  <div className="main-content-area">
                    <div className="contact-info-row">
                      <a href="" className="contact-info phone"><i className="fa-solid fa-phone"></i> +91 9918293747</a>
                      <a className="contact-info email" href="#"><i className="fa-solid fa-envelope-open-text"></i> example@email.com</a>
                    </div>
                    <div className="button-grp">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default toCaptain;
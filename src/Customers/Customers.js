import React, { useState } from "react";
import "./Customer.css";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdDownload } from "react-icons/md";
const Customers = () => {
  const [expandedRow, setExpandedRow] = useState(null);

  const handleInfoClick = (rowIndex) => {
    setExpandedRow((prevRow) => (prevRow === rowIndex ? null : rowIndex));
  };

  const renderExpandedRow = () => {
    return (
      <tr>
        <td colSpan="7">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ITEM NAME</th>
                <th>QUANTITY</th>
                <th>PRICE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>The Influential Structure Bangle</td>
                <td>1</td>
                <td> 1,25,283.00</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </td>
      </tr>
    );
  };

  return (
    <div className="Customer-Container">
      <div className="Customer-header">
        <h1 className="Customer-header-text">Customer</h1>
      </div>
      <div className="Customer-Details">
        <table className="table table-striped">
          <thead>
            <tr className="table-header">
              <th>CUSTOMER ID</th>
              <th>CUSTOMER NAME</th>
              <th>EMAIL</th>
              <th>PHONE NUMBER</th>
              <th>DETAILS</th>
              <th>INVOICE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-body">
              <th scope="row">1</th>
              <td className="table-body">Jhansi Devi</td>
              <td className="table-body">jhansi@gmail.com</td>
              <td className="table-body">7997148737</td>
              <td className="table-body">
                <button style={{border:"none", fontSize:"18px"}} onClick={() => handleInfoClick(1)}>
                  info <IoMdInformationCircleOutline style={{color:'#000075' , fontSize:"25px"}} />
                </button>
              </td>
              <td className="table-body">
                <button className="customer-invoice"><MdDownload/></button>
              </td>
              <td className="table-body" style={{fontSize:"20px"}}> <span className="badge " style={{backgroundColor:"#4f3267"}}>Done</span></td>
            </tr>
            {expandedRow === 1 && renderExpandedRow()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;

import React, { useState } from "react";
import "./Orders.css";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdDownload } from "react-icons/md";
const Orders = () => {
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
                <th>ORDERED DATE</th>
                <th>DELIVERED DATE</th>
                <th>PRICE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>The Influential Structure Bangle</td>
                <td>1</td>
                <td>21-JAN-2024</td>
                <td>29-JAN-2024</td>
                <td> 1,25,283.00/-</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </td>
      </tr>
    );
  };

  return (
    <div className="Orders-Container">
      <div className="Orders-header">
        <h1 className="Orders-header-text">Orders</h1>
      </div>
      <div className="Orders-Details">
        <table className="table table-striped">
          <thead>
            <tr className="table-header">
              <th>ORDER ID</th>
              <th>ITEM NAME</th>
              <th>USER NAME</th>
              <th>USER EMAIL</th>
              <th>TOTAL AMOUNT</th>
              <th>DETAILS</th>
              <th>DELIVERY STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-body">
              <th scope="row">1</th>
              <td className="table-body">The Influential Structure Bangle</td>
              <td className="table-body">Jhansi Devi</td>
              <td className="table-body">jhansi@gmail.com</td>
              
              <td className="table-body"> 1,25,283.00/-</td>
              <td className="table-body">

                <button style={{border:"none", fontSize:"18px"}} onClick={() => handleInfoClick(1)}>
                  info <IoMdInformationCircleOutline style={{color:'#000075' , fontSize:"25px"}} />
                </button>
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

export default Orders;

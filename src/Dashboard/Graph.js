import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Graph extends Component {
  render() {
    const pieOptions = {
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: "Categories",
        fontFamily: "'Domine', serif"
      },
      data: [{
        type: "pie",
        startAngle: 75,
        toolTipContent: "<b>{label}</b>: {y}%",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 16,
        indexLabel: "{label} - {y}%",
        dataPoints: [
          { y: 18, label: "Rings" },
          { y: 35, label: "Earrings" },
          { y: 14, label: "Pendants" },
          { y: 14, label: "Chains" },
          { y: 19, label: "Bangles" }
        ]
      }]
    };

    const stockOptions = {
      animationEnabled: true,
      colorSet: "colorSet2",
      title: {
        text: "Monthly Income",
        fontFamily: "'Domine', serif"
      },
      axisX: {
        valueFormatString: "MMMM"
      },
      axisY: {
        prefix: "",
        labelFormatter: this.addSymbols
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        itemclick: this.toggleDataSeries,
        verticalAlign: "top"
      },
      data: [{
        type: "column",
        name: "Actual Sales",
        showInLegend: true,
        xValueFormatString: "MMMM YYYY",
        yValueFormatString: "",
        dataPoints: [
          { x: new Date(2023, 0), y: 27500 },
          { x: new Date(2023, 1), y: 29000 },
          { x: new Date(2023, 2), y: 22000 },
          { x: new Date(2023, 3), y: 26500 },
          { x: new Date(2023, 4), y: 33000 },
          { x: new Date(2023, 5), y: 37000 },
          { x: new Date(2023, 6), y: 32000 },
          { x: new Date(2023, 7), y: 27500 },
          { x: new Date(2023, 8), y: 29500 },
          { x: new Date(2023, 9), y: 43000 },
          { x: new Date(2023, 10), y: 55000, indexLabel: "High Renewals" },
          { x: new Date(2023, 11), y: 39500 }
        ]
      }, {
        type: "line",
        name: "Expected Sales",
        showInLegend: true,
        yValueFormatString: "",
        dataPoints: [
          { x: new Date(2023, 0), y: 38000 },
          { x: new Date(2023, 1), y: 39000 },
          { x: new Date(2023, 2), y: 35000 },
          { x: new Date(2023, 3), y: 37000 },
          { x: new Date(2023, 4), y: 42000 },
          { x: new Date(2023, 5), y: 48000 },
          { x: new Date(2023, 6), y: 41000 },
          { x: new Date(2023, 7), y: 38000 },
          { x: new Date(2023, 8), y: 42000 },
          { x: new Date(2023, 9), y: 45000 },
          { x: new Date(2023, 10), y: 48000 },
          { x: new Date(2023, 11), y: 47000 }
        ]
      }, {
        type: "area",
        name: "Profit",
        markerBorderColor: "white",
        markerBorderThickness: 2,
        showInLegend: true,
        yValueFormatString: "",
        dataPoints: [
          { x: new Date(2023, 0), y: 11500 },
          { x: new Date(2023, 1), y: 10500 },
          { x: new Date(2023, 2), y: 9000 },
          { x: new Date(2023, 3), y: 13500 },
          { x: new Date(2023, 4), y: 13890 },
          { x: new Date(2023, 5), y: 18500 },
          { x: new Date(2023, 6), y: 16000 },
          { x: new Date(2023, 7), y: 14500 },
          { x: new Date(2023, 8), y: 15880 },
          { x: new Date(2023, 9), y: 24000 },
          { x: new Date(2023, 10), y: 31000 },
          { x: new Date(2023, 11), y: 19000 }
        ]
      }]
    };

    return (
      <div style={{ display: "flex" ,justifyContent:"space-between", marginTop:"70px"}}>
        {/* Pie Chart */}
        <div style={{ width: "49%"}}>
          <CanvasJSChart options={pieOptions} />
        </div>

        {/* Stock Chart */}
        <div style={{ width: "49%" , color:"black"}}>
          <CanvasJSChart options={stockOptions} onRef={ref => this.chart = ref} />
        </div>
      </div>
    );
  }
}

export default Graph;
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Form, Row, Col } from "react-bootstrap";

const DashboardContent = () => {
  const [monthlyOrders, setMonthlyOrders] = useState({});
  const [monthlyKoi, setMonthlyKoi] = useState({});
  const [monthlyKoiFishy, setMonthlyKoiFishy] = useState({});
  const [monthlyConsignments, setMonthlyConsignments] = useState({});
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalKoi, setTotalKoi] = useState(0);
  const [totalKoiFishy, setTotalKoiFishy] = useState(0);
  const [totalConsignments, setTotalConsignments] = useState(0);

  const [selectedData, setSelectedData] = useState("orders");
  const [selectedMonth, setSelectedMonth] = useState("November");
  const [selectedTotalData, setSelectedTotalData] = useState("orders");

  const [quantityOrders, setQuantityOrders] = useState(0);
  const [quantityKoi, setQuantityKoi] = useState(0);
  const [quantityKoiFishy, setQuantityKoiFishy] = useState(0);
  const [quantityConsignments, setQuantityConsignments] = useState(0);

  // Hàm gọi API lấy dữ liệu
  const fetchData = async () => {
    try {
      const ordersResponse = await axios.get(
        "https://localhost:7229/api/DashBoard/GetMonthlyOrders"
      );
      const koiResponse = await axios.get(
        "https://localhost:7229/api/DashBoard/GetMonthlyKoiFish"
      );
      const koiFishyResponse = await axios.get(
        "https://localhost:7229/api/DashBoard/GetMonthlyKoiFishy"
      );
      const consignmentsResponse = await axios.get(
        "https://localhost:7229/api/DashBoard/GetMonthlyConsignments"
      );

      setMonthlyOrders(ordersResponse.data["2024"]);
      setMonthlyKoi(koiResponse.data["2024"]);
      setMonthlyKoiFishy(koiFishyResponse.data["2024"]);
      setMonthlyConsignments(consignmentsResponse.data["2024"]);

      const totalOrdersResponse = await axios.get(
        "https://localhost:7229/api/DashBoard/GetTotalPriceOrders"
      );
      const totalKoiResponse = await axios.get(
        "https://localhost:7229/api/DashBoard/GetTotalPriceKoiFish"
      );
      const totalKoiFishyResponse = await axios.get(
        "https://localhost:7229/api/DashBoard/GetTotalPriceKoiFishy"
      );
      const totalConsignmentsResponse = await axios.get(
        "https://localhost:7229/api/DashBoard/GetTotalPriceConsignments"
      );

      setTotalOrders(totalOrdersResponse.data);
      setTotalKoi(totalKoiResponse.data);
      setTotalKoiFishy(totalKoiFishyResponse.data);
      setTotalConsignments(totalConsignmentsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchQuantities = async (month) => {
    try {
      const ordersQuantity = await axios.get(
        `https://localhost:7229/api/DashBoard/TotalOrders/${month}`
      );
      const koiQuantity = await axios.get(
        `https://localhost:7229/api/DashBoard/TotalKoiFish/${month}`
      );
      const koiFishyQuantity = await axios.get(
        `https://localhost:7229/api/DashBoard/TotalKoiFishy/${month}`
      );
      const consignmentsQuantity = await axios.get(
        `https://localhost:7229/api/DashBoard/TotalConsignments/${month}`
      );

      setQuantityOrders(ordersQuantity.data);
      setQuantityKoi(koiQuantity.data);
      setQuantityKoiFishy(koiFishyQuantity.data);
      setQuantityConsignments(consignmentsQuantity.data);
    } catch (error) {
      console.error("Error fetching quantities:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchQuantities(11); // Mặc định là tháng 11
  }, []);

  // Thay đổi số lượng khi chọn tháng mới
  useEffect(() => {
    const monthMapping = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };
    fetchQuantities(monthMapping[selectedMonth]);
  }, [selectedMonth]);

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDataArray = (data) => labels.map((month) => data[month] || 0);

  const createChartData = (data, label, color) => ({
    labels,
    datasets: [
      {
        label: `${label} Revenue`,
        data: getDataArray(data),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      },
    ],
  });

  const handleDataChange = (event) => setSelectedData(event.target.value);
  const handleMonthChange = (event) => setSelectedMonth(event.target.value);
  const handleTotalDataChange = (event) =>
    setSelectedTotalData(event.target.value);

  const getTotalValue = () => {
    switch (selectedTotalData) {
      case "orders":
        return totalOrders;
      case "koi":
        return totalKoi;
      case "koifishy":
        return totalKoiFishy;
      case "consignments":
        return totalConsignments;
      default:
        return 0;
    }
  };

  let chartData;
  switch (selectedData) {
    case "orders":
      chartData = createChartData(
        monthlyOrders,
        "Orders",
        "rgba(255, 99, 132, 0.6)"
      );
      break;
    case "koi":
      chartData = createChartData(monthlyKoi, "Koi", "rgba(54, 162, 235, 0.6)");
      break;
    case "koifishy":
      chartData = createChartData(
        monthlyKoiFishy,
        "KoiFishy",
        "rgba(75, 192, 192, 0.6)"
      );
      break;
    case "consignments":
      chartData = createChartData(
        monthlyConsignments,
        "Consignments",
        "rgba(255, 159, 64, 0.6)"
      );
      break;
    default:
      chartData = createChartData(
        monthlyOrders,
        "Orders",
        "rgba(255, 99, 132, 0.6)"
      );
  }

  return (
    <div>
      <h2>Biểu đồ Doanh số Theo Tháng</h2>
      <Form.Group controlId="dataSelector" className="mb-3">
        <Form.Label>Chọn Loại Dữ Liệu</Form.Label>
        <Form.Select onChange={handleDataChange}>
          <option value="orders">Orders</option>
          <option value="koi">Koi</option>
          <option value="koifishy">KoiFishy</option>
          <option value="consignments">Consignments</option>
        </Form.Select>
      </Form.Group>

      <div style={{ width: "80%", margin: "0 auto" }}>
        <Bar
          data={chartData}
          options={{ scales: { y: { beginAtZero: true } } }}
        />
      </div>

      <Form.Group controlId="monthSelector" className="mt-4">
        <Form.Label>Chọn Tháng</Form.Label>
        <Form.Select onChange={handleMonthChange}>
          {labels.map((month, index) => (
            <option value={month} key={index}>
              {month}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Row className="mt-3">
        <Col>Orders: {quantityOrders} </Col>
        <Col>Koi: {quantityKoi} </Col>
        <Col>KoiFishy: {quantityKoiFishy} </Col>
        <Col>Consignments: {quantityConsignments} </Col>
      </Row>

      <Form.Group controlId="totalDataSelector" className="mt-4">
        <Form.Label>Chọn Loại Dữ Liệu để Xem Tổng Số Tiền</Form.Label>
        <Form.Select onChange={handleTotalDataChange}>
          <option value="orders">Orders</option>
          <option value="koi">Koi</option>
          <option value="koifishy">KoiFishy</option>
          <option value="consignments">Consignments</option>
        </Form.Select>
        <h5 className="mt-3">
          Tổng Số Tiền: {getTotalValue().toLocaleString()} VND
        </h5>
      </Form.Group>
    </div>
  );
};

export default DashboardContent;

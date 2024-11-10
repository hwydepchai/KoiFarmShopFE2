/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const DashboardContent = () => {
  const [koiSales, setKoiSales] = useState({});
  const [koiFishySales, setKoiFishySales] = useState({});
  const [consignments, setConsignments] = useState({});
  const [totalPriceOrders, setTotalPriceOrders] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  // Hàm gọi API lấy dữ liệu
  const fetchData = async () => {
    try {
      const salesResponse = await axios.get(
        "https://localhost:7229/api/DashBoard/GetMonthlyKoiSales"
      );
      const fishySalesResponse = await axios.get(
        "https://localhost:7229/api/DashBoard/GetMonthlyKoiFishySales"
      );
      const consignmentsResponse = await axios.get(
        "https://localhost:7229/api/DashBoard/GetMonthlyConsignments"
      );
      const totalPriceOrdersResponse = await axios.get(
        "https://localhost:7229/api/DashBoard/GetTotalPriceOrders"
      );
      const totalOrdersResponse = await axios.get(
        "https://localhost:7229/api/DashBoard/TotalOrders/11"
      );

      // Lưu trữ dữ liệu cho tất cả các tháng
      setKoiSales(salesResponse.data["2024"]);
      setKoiFishySales(fishySalesResponse.data["2024"]);
      setConsignments(consignmentsResponse.data["2024"]);
      setTotalPriceOrders(totalPriceOrdersResponse.data);
      setTotalOrders(totalOrdersResponse.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  // Hàm format dữ liệu cho biểu đồ (cả năm)
  const formatSalesData = (salesData) => {
    const labels = Object.keys(salesData); // Các tháng trong năm
    const data = labels.map((month) => {
      // Duyệt qua các tháng và lấy tổng doanh thu cho từng tháng
      return Object.values(salesData[month]).reduce((acc, day) => acc + day, 0);
    });

    return {
      labels,
      datasets: [
        {
          label: "Doanh số Koi (VNĐ)",
          data,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
        },
      ],
    };
  };

  // Hàm format dữ liệu consignments cho biểu đồ (cả năm)
  const formatConsignmentsData = (consignmentsData) => {
    const labels = Object.keys(consignmentsData); // Các tháng trong năm
    const data = labels.map((month) => {
      // Duyệt qua các tháng và lấy tổng doanh thu cho từng tháng
      return Object.values(consignmentsData[month]).reduce((acc, day) => acc + day, 0);
    });

    return {
      labels,
      datasets: [
        {
          label: "Doanh số Consignments (VNĐ)",
          data,
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          borderWidth: 2,
        },
      ],
    };
  };

  // Hàm format dữ liệu cho Koi Fishy biểu đồ (cả năm)
  const formatFishySalesData = (fishySalesData) => {
    const labels = Object.keys(fishySalesData); // Các tháng trong năm
    const data = labels.map((month) => {
      // Duyệt qua các tháng và lấy tổng doanh thu cho từng tháng
      return Object.values(fishySalesData[month]).reduce((acc, day) => acc + day, 0);
    });

    return {
      labels,
      datasets: [
        {
          label: "Doanh số Koi Fishy (VNĐ)",
          data,
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderWidth: 2,
        },
      ],
    };
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      <div className="row">
        {/* Tổng số tiền đơn hàng */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Tổng số tiền đơn hàng</h5>
              <p className="card-text text-primary">
                <strong>{totalPriceOrders.toLocaleString()} VND</strong>
              </p>
            </div>
          </div>
        </div>
        {/* Tổng số đơn hàng */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Tổng số đơn hàng</h5>
              <p className="card-text text-success">
                <strong>{totalOrders}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh số Koi */}
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Doanh số Koi (2024)</h5>
              <Line data={formatSalesData(koiSales)} />
            </div>
          </div>
        </div>

        {/* Biểu đồ doanh số Koi Fishy */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Doanh số Koi Fishy (2024)</h5>
              <Line data={formatFishySalesData(koiFishySales)} />
            </div>
          </div>
        </div>

        {/* Biểu đồ doanh số Consignments */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Doanh số Consignments (2024)</h5>
              <Line data={formatConsignmentsData(consignments)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;

import React from "react";
import "./blog.css";
import RelatedBlogs from "../../../components/RelatedBlogs/RelatedBlogs";

const KoiBlog = () => {
  return (
    <div className="blog-container">
      <header className="blog-header">
        <h1>Giới thiệu tổng quan về cá Koi</h1>
        <p className="subtitle">
          Giới thiệu về cá Koi, cá chép Koi Nhật Bản, Xuất xứ và các tên gọi
        </p>
      </header>

      <div className="blog-content">
        {/* Hero Section */}
        <section className="hero-section">
          <img src="/koiim.gif" alt="Cá Koi Nhật Bản" className="hero-image" />
        </section>

        {/* Introduction Section */}
        <section className="content-section">
          <h2>Nguồn gốc và lịch sử</h2>
          <p>
            Cá Koi hay còn gọi là cá Chép Nhật theo cách gọi của người Việt Nam.
            Trong tiếng Nhật, Koi (鯉 / こい) có nghĩa là "Cá chép", và
            Nishikigoi (錦鯉 / にしきごい) nghĩa là "Cá chép thổ cẩm". Cá Koi là
            một loài cá cảnh không chỉ nổi tiếng với vẻ đẹp đầy màu sắc mà còn
            mang trong mình những ý nghĩa văn hóa sâu sắc. Khi nhắc đến cá Koi,
            người ta không chỉ thấy hình ảnh một loài cá đẹp mà còn cảm nhận
            được sự kiên trì, may mắn và trường thọ. Hãy cùng khám phá lịch sử
            và nguồn gốc của cá Koi - loài cá biểu tượng của Nhật Bản.
          </p>
        </section>

        {/* Classification Section */}
        <section className="content-section">
          <h2>Phân loại khoa học</h2>
          <div className="classification-table">
            <div className="table-row">
              <span className="label">Giới (regnum)</span>
              <span className="value">Animalia</span>
            </div>
            <div className="table-row">
              <span className="label">Ngành (phylum)</span>
              <span className="value">Chordata</span>
            </div>
            <div className="table-row">
              <span className="label">Lớp (class)</span>
              <span className="value">Actinopterygii</span>
            </div>
            {/* ... other classifications */}
          </div>
        </section>

        {/* Types Section */}
        <section className="content-section">
          <h2>Các loại cá Koi chính</h2>
          <div className="koi-types">
            <div className="type-card">
              <h3>Kohaku</h3>
              <p>Trắng pha Đỏ</p>
            </div>
            <div className="type-card">
              <h3>Showa Sanke</h3>
              <p>Trắng pha Đỏ + Đen</p>
            </div>
            {/* ... other types */}
          </div>
        </section>

        {/* Care Section */}
        <section className="content-section">
          <h2>Chăm sóc và nuôi dưỡng</h2>
          <div className="care-info">
            <div className="care-point">
              <h3>Môi trường sống</h3>
              <p>
                Khi nuôi cá Koi, một trong những quyết định đầu tiên là chọn
                loại hồ. Bạn có thể lựa chọn giữa hồ kính hoặc hồ xi măng. Hồ
                Kính: Thường được đặt trong nhà hoặc khu vực có diện tích nhỏ,
                hồ kính giúp bạn dễ dàng ngắm nhìn từng chi tiết của cá Koi. Hồ
                kính có chi phí đầu tư và bảo trì thấp hơn, nhưng lại hạn chế về
                diện tích và không lý tưởng cho các dòng cá Koi lớn. Hồ Xi Măng:
                Đây là lựa chọn phổ biến cho các hồ ngoài trời và sân vườn. Hồ
                xi măng có thể thiết kế theo quy mô lớn, giúp cá Koi có không
                gian bơi lội thoải mái. Hồ xi măng cũng dễ dàng thiết kế các hệ
                thống lọc nước chuyên nghiệp, tạo môi trường sống tự nhiên và ổn
                định hơn cho cá Koi.
              </p>
            </div>
            <div className="care-point">
              <h3>Kích thước hồ</h3>
              <p>
                Hồ nuôi cá Koi nên có dung tích tối thiểu là 3m³ để đảm bảo cá
                có đủ không gian sống và phát triển. Một hồ cá rộng rãi không
                chỉ giúp cá Koi thoải mái bơi lội mà còn giảm căng thẳng, hạn
                chế bệnh tật. Ngoài ra, nếu có điều kiện, bạn nên trang trí hồ
                với hòn non bộ và cây cảnh xung quanh để tạo bóng mát và tạo cảm
                giác gần gũi với thiên nhiên. Hệ thống phun hoặc thác nước cũng
                là một ý tưởng hay để tăng cường oxy trong nước, giúp cá luôn
                khỏe mạnh.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="gallery-section">
          <h2>Hình ảnh các loại cá Koi</h2>
          <div className="gallery-grid">
            <img src="/koi.jpg" alt="Koi fish 1" className="gallery-image" />
            <img src="/koiim.gif" alt="Koi fish 2" className="gallery-image" />
            <img src="/koi01.webp" alt="Koi fish 3" className="gallery-image" />
          </div>
        </section>
      </div>
      <RelatedBlogs />
    </div>
  );
};

export default KoiBlog;

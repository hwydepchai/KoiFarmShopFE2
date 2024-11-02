import React from "react";
import { useNavigate } from "react-router-dom";

const RelatedBlogs = () => {
  const navigate = useNavigate();

  const relatedPosts = [
    {
      id: 1,
      title: "Các trại cá koi nhật bản(Koi Farm...)",
      description:
        "Xuất phát từ tình yêu với cá Koi Nhật Bản. KoiFarmShop là trại nuôi cá tuyển chọn 100% từ các Koi farm...",
      image: "/cakoi1.jpg",
      link: "/blog/koi-farm",
    },
    {
      id: 2,
      title: "Ý nghĩa của việc nuôi cá koi theo...",
      description:
        "Từ lâu, trong văn hóa phương Đông. Cá koi đã được xem là biểu tượng của sự ngoan cường, dũng cảm giống như người quân...",
      image: "/cakoi2.jpg",
      link: "/blog/koi-meaning",
    },
    {
      id: 3,
      title: "Giá cá koi chuẩn nhật f0 + f1 70 cm",
      description:
        "Giá cá koi chuẩn nhật f0 + f1 70 cm trở lên – cam kết 100% nhập khẩu từ nhật bản Onkoi là koi farm...",
      image: "/cakoi3.jpg",
      link: "/blog/koi-price",
    },
  ];

  return (
    <section className="related-blogs-section">
      <h2>Bài viết liên quan</h2>
      <div className="related-blogs-grid">
        {relatedPosts.map((post) => (
          <div key={post.id} className="related-blog-card">
            <div className="blog-card-image">
              <img src={post.image} alt={post.title} />
            </div>
            <div className="blog-card-content">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <button
                onClick={() => navigate(post.link)}
                className="read-more-btn"
              >
                Xem thêm ▲
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedBlogs;

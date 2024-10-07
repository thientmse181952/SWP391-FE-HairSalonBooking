import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./index.scss";
import { Image, Spin, Pagination } from "antd";
import api from "../../config/axios";
import ScrollToTop from "../../components/scroll-to-top";

interface ImageData {
  id: number;
  category: string;
  collectionImage: string;
  date: string; // Thêm thuộc tính date
}

const categories = [
  {
    title: "Tóc Nhuộm",
    items: [
      { name: "Màu Balayage, Ombre" },
      { name: "Màu nhuộm công sở" },
      { name: "Màu nhuộm thời trang" },
    ],
  },
  {
    title: "Cắt & Tạo Kiểu",
    items: [
      { name: "Tóc bob" },
      { name: "Tóc dài" },
      { name: "Tóc ngắn" },
      { name: "Kiểu tóc xu hướng" },
      { name: "Tóc lỡ" },
    ],
  },
  {
    title: "Tóc Uốn - Duỗi",
    items: [
      { name: "Tóc duỗi" },
      { name: "Tóc uốn xoăn" },
      { name: "Tóc uốn xoăn ngọn, dợn sóng lơi" },
    ],
  },
  { title: "Tóc Nam", items: [{ name: "Tóc Nam" }] },
  { title: "BST & Hairshow", items: [{ name: "BST & Hairshow" }] },
];

const Collection: React.FC = () => {
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
  const itemsPerPage = 18; // Số ảnh tối đa mỗi trang
  const navigate = useNavigate();
  const { categoryName } = useParams(); // Lấy category từ URL

  const titleRef = useRef<HTMLHeadingElement>(null); // Tạo ref cho collection-title

  // Gọi API để lấy dữ liệu từ database
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const response = await api.get("/collection"); // Gọi đúng endpoint API
        setImageData(response.data); // Lưu dữ liệu vào state
        setLoading(false); // Kết thúc loading
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false); // Kết thúc loading khi gặp lỗi
      }
    };
    fetchData(); // Thực hiện lấy dữ liệu
  }, []); // Chạy chỉ một lần khi component được mount

  useEffect(() => {
    if (titleRef.current) {
      // Thêm 100px khi cuộn tới tiêu đề
      window.scrollTo({
        top: titleRef.current.offsetTop - 100, // Trừ đi 100px để tạo khoảng cách
        behavior: "smooth",
      });
    }
  }, [categoryName]); // Theo dõi sự thay đổi của categoryName để cuộn

  // Chuyển hướng đến trang category tương ứng và cuộn lên collection-title
  // Cập nhật hàm handleCategoryClick để dùng setTimeout trước khi scroll để đảm bảo cập nhật URL xong mới cuộn tới tiêu đề
  const handleCategoryClick = (category: string) => {
    setCurrentPage(1); // Reset trang về 1 khi chọn category mới
    navigate(`/collection/${category}`); // Thay đổi URL mà không cần xử lý cuộn ngay tại đây
  };

  // Xử lý phân trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  // Lọc dữ liệu theo category trước khi phân trang
  const filteredImages = imageData.filter(
    (image) => !categoryName || image.category === categoryName
  );

  // Tính toán dữ liệu hiển thị dựa trên trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = filteredImages.slice(startIndex, endIndex);
  // Chỉ phân trang sau khi lọc

  if (loading) {
    return (
      <div className="collection-wrapper">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="collection-wrapper">
      <div className="collection-header">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/swp391-7123d.appspot.com/o/Collection%2Fbanner.png?alt=media&token=813fa013-8d1c-4b41-9257-aff291196736"
          alt="New Collection"
        />
      </div>

      <div className="collection-content">
        <div className="collection-sidebar">
          <h3>Bộ Sưu Tập</h3>

          {/* Lặp qua các category */}
          {categories.map((categoryGroup) => (
            <div className="sidebar-section" key={categoryGroup.title}>
              <h4>{categoryGroup.title}</h4>
              <ul>
                {categoryGroup.items.map((category) => (
                  <li
                    key={category.name}
                    className={categoryName === category.name ? "active" : ""}
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="collection-gallery">
          <h2 ref={titleRef} className="collection-title">
            {categoryName || "Tất cả danh mục"}
          </h2>

          <div className="gallery-grid">
            {currentImages.map((image) => (
              <div className="grid-item" key={image.id}>
                <Image src={image.collectionImage} alt={image.category} />
              </div>
            ))}
          </div>

          {/* Phân trang */}
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={filteredImages.length} // Tổng số lượng ảnh sau khi lọc theo category
            onChange={handlePageChange} // Xử lý khi chuyển trang
            showSizeChanger={false} // Không cho phép thay đổi số lượng ảnh mỗi trang
          />
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
};

export default Collection;

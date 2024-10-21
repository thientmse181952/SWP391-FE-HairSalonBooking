import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./index.scss";
import { Image, Spin, Pagination } from "antd";
import api from "../../config/axios";
import ScrollToTop from "../../components/scroll-to-top";

interface ImageData {
  id: number;
  categoryCollection: {
    id: number;
    nameCategory: string;
  };
  collectionImage: string;
  date: string;
}

interface CategoryData {
  id: number;
  nameCategory: string;
}

const Collection: React.FC = () => {
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]); // State cho danh sách category
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 18;
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Gọi API để lấy danh sách category từ server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category-collection/getCollection");
        setCategories(response.data); // Cập nhật danh sách category từ API
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };
    fetchCategories(); // Lấy danh sách category khi component được mount
  }, []);

  // Gọi API để lấy dữ liệu từ database
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/collection/getCollection");
        setImageData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      window.scrollTo({
        top: titleRef.current.offsetTop - 100,
        behavior: "smooth",
      });
    }
  }, [categoryName]);

  const handleCategoryClick = (category: string) => {
    setCurrentPage(1);
    navigate(`/collection/${category}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (titleRef.current) {
      window.scrollTo({
        top: titleRef.current.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  // Tìm ID của category dựa trên nameCategory
  const selectedCategory = categories.find(
    (category) => category.nameCategory === categoryName
  );

  // Lọc dữ liệu theo category ID
  const filteredImages = imageData.filter(
    (image) =>
      !categoryName || image.categoryCollection.nameCategory === categoryName
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = filteredImages.slice(startIndex, endIndex);

  const useIntersectionObserver = () => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<any>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      };
    }, []);

    return { isVisible, elementRef };
  };

  const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
    const { isVisible, elementRef } = useIntersectionObserver();

    return (
      <div ref={elementRef} className="grid-item">
        {isVisible ? (
          <Image src={src} alt={alt} />
        ) : (
          <div style={{ height: "200px", backgroundColor: "#f0f0f0" }} />
        )}
      </div>
    );
  };

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

          {/* Hiển thị danh sách category từ API */}
          <div className="sidebar-section">
            <ul>
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={
                    categoryName === category.nameCategory ? "active" : ""
                  }
                  onClick={() => handleCategoryClick(category.nameCategory)}
                >
                  {category.nameCategory}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="collection-gallery">
          <h2 ref={titleRef} className="collection-title">
            {categoryName || "Tất cả danh mục"}
          </h2>

          <div className="gallery-grid">
            {currentImages.map((image) => (
              <LazyImage
                key={image.id}
                src={image.collectionImage}
                alt={image.categoryCollection.nameCategory}
              />
            ))}
          </div>

          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={filteredImages.length}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
};

export default Collection;

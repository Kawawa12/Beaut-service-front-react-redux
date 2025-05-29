// pages/BeautyHomePage.js
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../features/category-slice";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import HeroSection from "../../components/common/HeroSection";
import AboutOurServices from "../../components/common/AboutOurService";
import ServicesSection from "../../components/common/ServiceSection";

const BeautyHomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  
  const { loading, categories, error } = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const categoryServices = categories.map((category) => ({
    name: category.name,
    image: category.image?.startsWith("/9j/")
      ? `data:image/jpeg;base64,${category.image}`
      : category.image || "/assets/default-service.jpg",
    description: category.description || "Premium beauty service",
  }));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest('button[aria-label="Menu"]')
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        mobileMenuRef={mobileMenuRef}
        profileDropdownRef={profileDropdownRef}
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
      />

      <HeroSection />
      <AboutOurServices />
      <ServicesSection
        loading={loading}
        error={error}
        categoryServices={categoryServices}
      />

      <Footer/>
    </div>
  );
};

export default BeautyHomePage;
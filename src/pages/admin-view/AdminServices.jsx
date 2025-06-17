import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaSearch,
  FaSync,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  toggleCategoryActiveStatus,
} from "../../../features/category-slice";
import CategoryFormModel from "../../components/common/CategoryFormModel";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function Category() {
  const dispatch = useDispatch();
  const { loading, categories, error } = useSelector(
    (state) => state.categories
  );

  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const refreshCategories = () => {
    setIsRefreshing(true);
    dispatch(fetchCategories())
      .unwrap()
      .finally(() => setIsRefreshing(false));
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (categoryId) => {
    dispatch(toggleCategoryActiveStatus(categoryId))
      .unwrap()
      .then(() => refreshCategories())
      .catch((err) => console.error("Failed to toggle status:", err));
  };

  const handleModalSuccess = () => {
    refreshCategories(); // Refresh after successful create/update
    setIsModalOpen(false); // Close the modal
  };

  const filteredCategories = categories.filter((category) => {
    const matchesName = category.name
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const matchesStatus =
      !statusFilter ||
      (statusFilter === "Active" && category.active) ||
      (statusFilter === "Inactive" && !category.active);
    const matchesDate =
      !dateFilter || category.createDate?.slice(0, 10) === dateFilter;

    return matchesName && matchesStatus && matchesDate;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Category Management
        </h2>
        <div className="flex gap-2">
          <button
            onClick={refreshCategories}
            className={`flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading || isRefreshing}
            aria-label="Refresh categories"
          >
            <FaSync className={`${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={() => {
              setIsEditMode(false);
              setSelectedCategory(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            aria-label="Add new category"
          >
            <FaPlus /> Add New
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Filter by name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Create Date
            </label>
            <input
              type="date"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading && !isRefreshing && <LoadingSpinner />}
      {isRefreshing && <LoadingSpinner />}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading categories: {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Create Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {category.image ? (
                          <img
                            src={`data:image/jpeg;base64,${category.image}`}
                            alt={category.name}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              No Image
                            </span>
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(category.createDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          category.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        title="Edit category"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(category.id)}
                        className={`inline-flex items-center ${
                          category.active
                            ? "text-red-600 hover:text-red-900"
                            : "text-green-600 hover:text-green-900"
                        }`}
                        title={category.active ? "Deactivate" : "Activate"}
                      >
                        {category.active ? (
                          <FaToggleOff className="mr-1" size={18} />
                        ) : (
                          <FaToggleOn className="mr-1" size={18} />
                        )}
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No categories found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <CategoryFormModel
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
          setIsEditMode(false);
        }}
        category={selectedCategory}
        isEditMode={isEditMode}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTimesCircle,
  FaCheckCircle,
  FaSearch,
  FaSync,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../features/category-slice";
import CategoryFormModal from "../../components/common/CategoryForm";

export default function Category() {
  const dispatch = useDispatch();

  // Redux state
  const { loading, categories, error } = useSelector(
    (state) => state.categories
  );

  // Filters
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const refreshCategories = () => {
    setIsRefreshing(true);
    dispatch(fetchCategories())
      .unwrap()
      .finally(() => setIsRefreshing(false));
  };

  // Filters
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

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Placeholder for toggling status
  const toggleStatus = (categoryId) => {
    alert(`Toggle status for category ID: ${categoryId}`);
    // You would dispatch an updateCategoryStatus() thunk here in a real app
  };

  const editCategory = (categoryId) => {
    alert(`Edit functionality would open for category ID: ${categoryId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">My Categories</h2>
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
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            aria-label="Add new category"
          >
            <FaPlus /> Add New
          </button>
        </div>
      </div>

      {/* Filters */}
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

      {/* Loading/Error */}
      {loading && !isRefreshing && (
        <p className="py-4 text-center">Loading categories...</p>
      )}
      {isRefreshing && (
        <p className="py-4 text-center">Refreshing categories...</p>
      )}
      {error && <p className="text-red-500 py-4 text-center">Error: {error}</p>}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Create Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={`data:image/jpeg;base64,${category.image}`}
                        alt={category.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(category.createDate)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                        category.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {category.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button
                      onClick={() => editCategory(category.id)}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(category.id)}
                      className={`inline-flex items-center ${
                        category.active
                          ? "text-red-600 hover:text-red-900"
                          : "text-green-600 hover:text-green-900"
                      }`}
                    >
                      {category.active ? (
                        <>
                          <FaTimesCircle className="mr-1" /> Deactivate
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="mr-1" /> Activate
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

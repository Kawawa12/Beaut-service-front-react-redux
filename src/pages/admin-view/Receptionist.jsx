import { useEffect, useState } from "react";
import { FiPlus, FiRefreshCw, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import { 
  activateAccount,  
  deactivateAccount, 
  fetchReceptionists 
} from "../../../features/admin-slice";
import ReceptionistForm from "../../components/common/ReceptionistForm";

const Receptionist = () => {
  const dispatch = useDispatch();
  const { receptionists, loading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load receptionists function
  const loadReceptionists = async () => {
    try {
      await dispatch(fetchReceptionists()).unwrap();
    } catch (err) {
      toast.error(err.message || "Failed to load receptionists");
    }
  };

  useEffect(() => {
    loadReceptionists();
  }, [dispatch]);

  const handleRefresh = () => {
    loadReceptionists();
    toast.info("Receptionists list refreshed");
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      if (isActive) {
        await dispatch(deactivateAccount(id)).unwrap();
        toast.success("Account deactivated");
      } else {
        await dispatch(activateAccount(id)).unwrap();
        toast.success("Account activated");
      }
      // Refresh the list after status change
      loadReceptionists();
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };


  
  // const handleAddReceptionist = (formData) => {
  //   // Show loading alert
  //   Swal.fire({
  //     title: 'Creating Receptionist',
  //     html: 'Please wait...',
  //     allowOutsideClick: false,
  //     didOpen: () => Swal.showLoading()
  //   });

  //   dispatch(createReceptionist(formData))
  //     .unwrap()
  //     .then((result) => {
  //       Swal.close();

  //       if (result?.success) {
  //         Swal.fire({
  //           icon: 'success',
  //           title: 'Success!',
  //           text: result.message || 'Receptionist added successfully',
  //           timer: 2000,
  //           showConfirmButton: false
  //         }).then(() => {
  //           setIsFormOpen(false);
  //           loadReceptionists();
  //         });
  //       } else {
  //         throw new Error(result?.message || 'Unknown error occurred');
  //       }
  //     })
  //     .catch((error) => {
  //       Swal.close();

  //       // Safely access message & details
  //       const errorMessage =
  //         error?.message ||
  //         error?.message ||
  //         "Failed to create receptionist";

  //       const errorDetails =
  //         error?.payload?.details ||
  //         error?.response?.message || // fallback if direct response
  //         "Please try again later";

  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error',
  //         html: `
  //     <div>
  //       <p class="font-medium">${errorMessage}</p>
  //       <p class="text-sm text-gray-500 mt-2">${errorDetails}</p>
  //     </div>
  //   `,
  //         confirmButtonColor: '#3085d6',
  //       });
  //     });
  // }

  

  const filteredReceptionists = receptionists.filter((rec) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      rec.fullName?.toLowerCase().includes(searchLower) ||
      rec.email?.toLowerCase().includes(searchLower) ||
      rec.address?.toLowerCase().includes(searchLower)
    );
  });

  const AvatarWithName = ({ name, email }) => {
    const initials = name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return (
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-3">
          {initials}
        </div>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-500">{email}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Receptionists</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or address"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            <FiRefreshCw
              className={`text-gray-600 ${loading ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            disabled={loading}
          >
            <FiPlus />
            <span className="hidden md:inline">Add New</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredReceptionists.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm
                      ? "No matching receptionists found"
                      : "No receptionists available"}
                  </td>
                </tr>
              ) : (
                filteredReceptionists.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <AvatarWithName name={rec.fullName} email={rec.email} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {rec.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {rec.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          rec.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {rec.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleToggleStatus(rec.id, rec.active)}
                        disabled={loading}
                        className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
                          rec.active
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        } transition-colors flex items-center gap-1`}
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            {rec.active ? "Deactivating..." : "Activating..."}
                          </>
                        ) : rec.active ? (
                          "Deactivate"
                        ) : (
                          "Activate"
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <ReceptionistForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        //onSave={handleAddReceptionist}
      />
    </div>
  );
};

export default Receptionist;
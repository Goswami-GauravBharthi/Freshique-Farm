import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";
import {
  MapPin,
  Phone,
  Mail,
  Loader2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";


const Farmers = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFarmerId, setSelectedFarmerId] = useState(null);

 


  // 1. Fetch Farmers
  const { data, isLoading } = useQuery({
    queryKey: ["farmers"],
    queryFn: async () => (await api.get("/api/admin/farmers")).data,
  });

  // 2. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/api/admin/farmers/${id}`);
    },
    onSuccess: () => {
      // Refresh the list after successful deletion
      queryClient.invalidateQueries(["farmers"]);
      toast.success("Farmer deleted successfully");
      closeModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete farmer");
      closeModal();
    },
  });

  // 3. Handlers
  const handleOpenModal = (id) => {
    setSelectedFarmerId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFarmerId(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedFarmerId) {
      deleteMutation.mutate(selectedFarmerId);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-green-600" />
      </div>
    );

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Registered Farmers ({data?.count})
      </h1>

      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="p-4">Farmer Profile</th>
              <th className="p-4">Contact Info</th>
              <th className="p-4">Location</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.farmers?.map((farmer) => (
              <tr key={farmer._id} className="hover:bg-gray-50">
                <td
                  onClick={() =>
                    window.open(
                      `https://freshiquefarm.vercel.app/farmerPage/${farmer._id}`,
                      "_blank"
                    )
                  }
                  className="p-4 flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={
                      farmer.profilePicture || "https://via.placeholder.com/40"
                    }
                    alt={farmer.fullName}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <span className="font-semibold text-gray-800">
                    {farmer.fullName}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail size={14} /> {farmer.email}
                    </div>
                    {farmer.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} /> {farmer.phoneNumber}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    {farmer.location?.city || "N/A"},{" "}
                    {farmer.location?.state || ""}
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(farmer.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleOpenModal(farmer._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Farmer"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="text-red-600" size={24} />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Farmer?
              </h3>

              <p className="text-gray-500 mb-6">
                Are you sure you want to delete this farmer? This action cannot
                be undone and will remove their data permanently.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Farmers;

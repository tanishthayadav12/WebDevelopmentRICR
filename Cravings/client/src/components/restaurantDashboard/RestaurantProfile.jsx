import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import EditRestaurantProfileModal from "./modals/EditRestaurantProfileModal";
import UserImage from "../../assets/userImage.jpg";
import {
  FaCamera,
  FaMapLocationDot,
  FaWallet,
} from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import { BiSolidBank } from "react-icons/bi";
import api from "../../config/Api";
import toast from "react-hot-toast";
import ResetPasswordModal from "../userDashboard/modals/ResetPasswordModal";

const RestaurantProfile = () => {
  const { user, setUser } = useAuth();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [preview, setPreview] = useState("");

  const changePhoto = async (photo) => {
    const form_Data = new FormData();
    form_Data.append("image", photo);

    try {
      const res = await api.patch("/restaurant/changePhoto", form_Data);
      toast.success(res.data.message);
      setUser(res.data.data);
      sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
      setPreview("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unknown Error");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newPhotoURL = URL.createObjectURL(file);
      setPreview(newPhotoURL);
      setTimeout(() => {
        changePhoto(file);
      }, 1000);
    }
  };

  const renderField = (label, value) => (
    <div className="flex justify-between py-2 px-3 border-b border-(--) last:border-b-0">
      <span className="text-(--)/80 font-medium">{label}:</span>
      <span className="text-(--) font-semibold">
        {value && value !== "N/A" ? (
          value
        ) : (
          <span className="text-(--)/60">Not provided</span>
        )}
      </span>
    </div>
  );

  return (
    <>
      <div className="bg-(--) rounded-lg p-6 h-full overflow-y-auto space-y-6">
        {/* Header Section with Photo and Basic Info */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-(--)">
          <div className="flex gap-6">
            {/* Photo Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="border-4 border-(--) rounded-full w-40 h-40 overflow-hidden bg-(--)">
                  <img
                    src={preview || user?.photo?.url || UserImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="imageUpload"
                  className="absolute bottom-2 right-2 bg-(--) text-white p-3 rounded-full hover:bg-(--) cursor-pointer transition transform hover:scale-110"
                >
                  <FaCamera size={18} />
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
              <p className="text-(--)/70 text-sm mt-2">
                Click camera to change photo
              </p>
            </div>

            {/* Basic Info Section */}
            <div className="flex justify-between w-full">
              <div>
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-(--) mb-2">
                    {user?.fullName || "Manager Name"}
                  </h1>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-(--) text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                      {user?.role || "manager"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user?.isActive === "active"
                          ? "bg-(--) text-(--)"
                          : "bg-(--) text-(--)"
                      }`}
                    >
                      {user?.isActive || "active"}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-(--)/80 font-medium">Email:</span>
                    <span className="text-(--)">
                      {user?.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-(--)/80 font-medium">Phone:</span>
                    <span className="text-(--)">
                      {user?.mobileNumber || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditProfileModalOpen(true)}
                    className="px-6 py-2 bg-(--) text-white rounded-lg hover:bg-(--) transition font-semibold"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setIsResetPasswordModalOpen(true)}
                    className="px-6 py-2 bg-(--) text-white rounded-lg hover:bg-(--) transition font-semibold"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-(--)">
          <h2 className="text-xl font-bold text-(--) mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-(--) rounded"></span>
            Personal Information
          </h2>
          <div className="space-y-1">
            {renderField("Date of Birth", user?.dob)}
            {renderField("Gender", user?.gender)}
            {renderField("Address", user?.address)}
            {renderField("City", user?.city)}
            {renderField("PIN Code", user?.pin)}
          </div>
        </div>

        {/* Location Section */}
        {(user?.geoLocation?.lat !== "N/A" ||
          user?.geoLocation?.lon !== "N/A") && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-(--)">
            <h2 className="text-xl font-bold text-(--) mb-4 flex items-center gap-2">
              <FaMapLocationDot className="text-(--)" />
              Geo Location
            </h2>
            <div className="space-y-1">
              {renderField("Latitude", user?.geoLocation?.lat)}
              {renderField("Longitude", user?.geoLocation?.lon)}
            </div>
          </div>
        )}

        {/* Payment Details - UPI Section */}
        {user?.paymentDetails?.upi !== "N/A" && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-(--)">
            <h2 className="text-xl font-bold text-(--) mb-4 flex items-center gap-2">
              <FaWallet className="text-(--)" />
              Payment Details
            </h2>
            <div className="space-y-1">
              {renderField("UPI ID", user?.paymentDetails?.upi)}
            </div>
          </div>
        )}

        {/* Bank Account Details Section */}
        {(user?.paymentDetails?.account_number !== "N/A" ||
          user?.paymentDetails?.ifs_Code !== "N/A") && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-(--)">
            <h2 className="text-xl font-bold text-(--) mb-4 flex items-center gap-2">
              <BiSolidBank className="text-(--)" />
              Bank Account Details
            </h2>
            <div className="space-y-1">
              {renderField(
                "Account Number",
                user?.paymentDetails?.account_number,
              )}
              {renderField("IFSC Code", user?.paymentDetails?.ifs_Code)}
            </div>
          </div>
        )}

        {/* Restaurant Information Section */}
        {(user?.restaurantName !== "N/A" || user?.cuisine !== "N/A") && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-(--)">
            <h2 className="text-xl font-bold text-(--) mb-4">
              Restaurant Information
            </h2>
            <div className="space-y-1">
              {renderField("Restaurant Name", user?.restaurantName)}
              {renderField("Cuisine Type", user?.cuisine)}
            </div>
          </div>
        )}

        {/* Business Documents Section */}
        {Object.values(user?.documents || {}).some((doc) => doc !== "N/A") && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-(--)">
            <h2 className="text-xl font-bold text-(--) mb-4 flex items-center gap-2">
              <FaFileAlt className="text-(--)" />
              Business Documents
            </h2>
            <div className="space-y-1">
              {renderField("GST Certificate", user?.documents?.gst)}
              {renderField("FSSAI License", user?.documents?.fssai)}
              {renderField("RC (Registration)", user?.documents?.rc)}
              {renderField("Driving License", user?.documents?.dl)}
              {renderField("UIDAI", user?.documents?.uidai)}
              {renderField("PAN", user?.documents?.pan)}
            </div>
          </div>
        )}

        {/* Account Metadata */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-(--) text-sm">
          <h2 className="text-lg font-bold text-(--) mb-3">
            Account Details
          </h2>
          <div className="grid grid-cols-2 gap-4 text-(--)/80">
            <div>
              <span className="font-medium">Account ID:</span>
              <p className="text-(--)/70 font-mono text-xs break-all">
                {user?._id}
              </p>
            </div>
            <div>
              <span className="font-medium">Member Since:</span>
              <p className="text-(--)">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-IN")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isEditProfileModalOpen && (
        <EditRestaurantProfileModal
          onClose={() => setIsEditProfileModalOpen(false)}
        />
      )}

      {isResetPasswordModalOpen && (
        <ResetPasswordModal
          onClose={() => setIsResetPasswordModalOpen(false)}
        />
      )}
    </>
  );
};

export default RestaurantProfile;



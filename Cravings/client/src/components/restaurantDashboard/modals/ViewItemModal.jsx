import React from "react";

const ViewItemModal = ({ onClose, selectedItem }) => {
  if (!selectedItem) return null;

  const images = selectedItem.images || [].slice(0, 5);

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-100">
        <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex justify-between px-6 py-4 border-b border-(--) items-center sticky top-0 bg-white">
            <h2 className="text-2xl font-semibold text-(--)">
              {selectedItem.itemName}
            </h2>
            <button
              onClick={onClose}
              className="text-(--)/80 hover:text-(--) text-2xl transition"
            >
              âŠ—
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-(--)/80">
                  Images
                </label>
                <div className="flex gap-4 flex-wrap">
                  {images.slice(0, 5).map((image, index) => (
                    <div
                      key={index}
                      className="w-30 h-30 rounded-lg overflow-hidden bg-(--) border border-(--) flex items-center justify-center"
                    >
                      <img
                        src={image.url}
                        alt={`${selectedItem.itemName} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Item Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Item Name */}
              <div>
                <label className="block text-sm font-semibold text-(--)/80 mb-1">
                  Item Name
                </label>
                <p className="text-(--) font-medium">
                  {selectedItem.itemName}
                </p>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-(--)/80 mb-1">
                  Price
                </label>
                <p className="text-lg font-bold text-(--)">
                  â‚¹{parseFloat(selectedItem.price).toFixed(2)}
                </p>
              </div>

              {/* Cuisine */}
              <div>
                <label className="block text-sm font-semibold text-(--)/80 mb-1">
                  Cuisine
                </label>
                <p className="text-(--) capitalize">
                  {selectedItem.cuisine}
                </p>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-(--)/80 mb-1">
                  Type
                </label>
                <p
                  className={`font-medium capitalize ${
                    selectedItem.type === "veg"
                      ? "text-(--)"
                      : "text-(--)"
                  }`}
                >
                  {selectedItem.type}
                </p>
              </div>

              {/* Serving Size */}
              <div>
                <label className="block text-sm font-semibold text-(--)/80 mb-1">
                  Serving Size
                </label>
                <p className="text-(--)">
                  {selectedItem.servingSize} Persons
                </p>
              </div>

              {/* Preparation Time */}
              <div>
                <label className="block text-sm font-semibold text-(--)/80 mb-1">
                  Preparation Time
                </label>
                <p className="text-(--)">
                  {selectedItem.preparationTime} mins
                </p>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-semibold text-(--)/80 mb-1">
                  Availability
                </label>
                <p
                  className={`font-medium capitalize ${
                    selectedItem.availability === "available"
                      ? "text-(--)"
                      : "text-(--)"
                  }`}
                >
                  {selectedItem.availability}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-(--)/80 mb-2">
                Description
              </label>
              <p className="text-(--) leading-relaxed bg-(--) p-3 rounded">
                {selectedItem.description}
              </p>
            </div>

            {/* Metadata */}
            <div className="text-xs text-(--)/70 space-y-1 pt-4 border-t border-(--)">
              {/* <p>Item ID: {selectedItem._id}</p> */}
              <p>
                Created: {new Date(selectedItem.createdAt).toLocaleDateString()}
              </p>
              <p>
                Last Updated:{" "}
                {new Date(selectedItem.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewItemModal;



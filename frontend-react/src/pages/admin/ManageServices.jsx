import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  UploadCloud,
  Briefcase,
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import Modal from "../../components/admin/Modal";

// Inline mock data or import from a file if you created one
const initialServices = [
  {
    id: 1,
    name: "Wedding Photography",
    description: "Full coverage for your special day, capturing every moment.",
    image: "https://placehold.co/600x400/cbd5e1/1e293b?text=Wedding",
    packages: [
      {
        id: "w1",
        name: "Silver Package",
        price: "₱15,000",
        features: ["6 Hours Coverage", "1 Photographer", "Digital Album"],
      },
      {
        id: "w2",
        name: "Gold Package",
        price: "₱25,000",
        features: [
          "Unlimited Coverage",
          "2 Photographers",
          "Printed Album",
          "Drone Shots",
        ],
      },
    ],
    album: [],
  },
  {
    id: 2,
    name: "Birthday Events",
    description: "Fun and vibrant photography for birthdays and debuts.",
    image: "https://placehold.co/600x400/94a3b8/1e293b?text=Birthday",
    packages: [
      {
        id: "b1",
        name: "Kiddie Party",
        price: "₱5,000",
        features: ["3 Hours Coverage", "Soft Copy Only"],
      },
    ],
    album: [],
  },
];

const ManageServices = () => {
  const [viewMode, setViewMode] = useState("list");
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState(initialServices);
  const [isServiceModalOpen, setServiceModalOpen] = useState(false);
  const [isPackageModalOpen, setPackageModalOpen] = useState(false);
  const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [isEditingService, setIsEditingService] = useState(false);
  const [tempServiceData, setTempServiceData] = useState({});
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [newPackage, setNewPackage] = useState({
    name: "",
    price: "",
    features: "",
  });
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  const handleViewService = (service) => {
    setSelectedService(service);
    setTempServiceData({ ...service });
    setIsEditingService(false);
    setViewMode("detail");
  };
  const handleBack = () => {
    setSelectedService(null);
    setIsEditingService(false);
    setViewMode("list");
  };
  const handleFileUpload = (event, setter, field = null) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      if (field) {
        setter((prev) => ({ ...prev, [field]: objectUrl }));
      } else {
        setter(objectUrl);
      }
    }
  };
  const handleAddService = () => {
    const id = services.length + 1;
    const serviceToAdd = {
      ...newService,
      id,
      image: newService.image || "https://placehold.co/600x400?text=No+Image",
      packages: [],
      album: [],
    };
    setServices([...services, serviceToAdd]);
    setServiceModalOpen(false);
    setNewService({ name: "", description: "", image: "" });
  };
  const handleDeleteService = (id) => {
    if (window.confirm("Delete this service?")) {
      setServices(services.filter((s) => s.id !== id));
    }
  };
  const handleSaveServiceDetails = () => {
    const updatedService = { ...selectedService, ...tempServiceData };
    setSelectedService(updatedService);
    setServices(
      services.map((s) => (s.id === updatedService.id ? updatedService : s))
    );
    setIsEditingService(false);
  };
  const openAddPackageModal = () => {
    setEditingPackageId(null);
    setNewPackage({ name: "", price: "", features: "" });
    setPackageModalOpen(true);
  };
  const handleEditPackage = (pkg) => {
    setEditingPackageId(pkg.id);
    setNewPackage({
      name: pkg.name,
      price: pkg.price,
      features: pkg.features.join(", "),
    });
    setPackageModalOpen(true);
  };
  const handleSavePackage = () => {
    const featuresList = newPackage.features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f !== "");
    let updatedPackages;
    if (editingPackageId) {
      updatedPackages = selectedService.packages.map((p) =>
        p.id === editingPackageId
          ? {
              ...p,
              name: newPackage.name,
              price: newPackage.price,
              features: featuresList,
            }
          : p
      );
    } else {
      updatedPackages = [
        ...selectedService.packages,
        {
          id: Date.now(),
          name: newPackage.name,
          price: newPackage.price,
          features: featuresList,
        },
      ];
    }
    const updatedService = { ...selectedService, packages: updatedPackages };
    setSelectedService(updatedService);
    setServices(
      services.map((s) => (s.id === updatedService.id ? updatedService : s))
    );
    setPackageModalOpen(false);
    setNewPackage({ name: "", price: "", features: "" });
    setEditingPackageId(null);
  };
  const handleDeletePackage = (pkgId) => {
    if (!window.confirm("Delete this package?")) return;
    const updatedService = {
      ...selectedService,
      packages: selectedService.packages.filter((p) => p.id !== pkgId),
    };
    setSelectedService(updatedService);
    setServices(
      services.map((s) => (s.id === updatedService.id ? updatedService : s))
    );
  };
  const handleAddPhoto = () => {
    if (!newPhotoUrl) return;
    const updatedService = {
      ...selectedService,
      album: [...selectedService.album, newPhotoUrl],
    };
    setSelectedService(updatedService);
    setServices(
      services.map((s) => (s.id === updatedService.id ? updatedService : s))
    );
    setPhotoModalOpen(false);
    setNewPhotoUrl("");
  };
  const handleRemovePhoto = (index) => {
    const updatedService = {
      ...selectedService,
      album: selectedService.album.filter((_, i) => i !== index),
    };
    setSelectedService(updatedService);
    setServices(
      services.map((s) => (s.id === updatedService.id ? updatedService : s))
    );
  };

  if (viewMode === "list") {
    return (
      <div className="space-y-8 h-full overflow-y-auto p-4 lg:p-8">
        <div className="flex justify-between items-center px-2">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-800">
              Manage Services
            </h2>
            <p className="text-gray-600 mt-2">Customize your offerings.</p>
          </div>
          <button
            onClick={() => setServiceModalOpen(true)}
            className="flex items-center bg-indigo-700 text-white px-6 py-3 rounded-xl hover:bg-indigo-800 transition shadow-lg transform hover:scale-[1.02] font-bold"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Service
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-[1.02] duration-300"
            >
              <div className="h-56 w-full overflow-hidden relative group">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteService(service.id);
                    }}
                    className="bg-white/90 text-red-600 p-2 rounded-full hover:bg-white shadow-sm transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6 flex flex-col grow">
                <h3 className="text-2xl font-bold mb-2 text-slate-900">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-6 grow line-clamp-3">
                  {service.description}
                </p>
                <div className="flex justify-center mt-auto">
                  <button
                    onClick={() => handleViewService(service)}
                    className="w-full block py-3 bg-slate-800 hover:bg-slate-900 text-white text-center font-bold rounded-lg transition-all shadow-md"
                  >
                    Edit Details & Packages
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Modal
          isOpen={isServiceModalOpen}
          onClose={() => setServiceModalOpen(false)}
          title="Add New Service"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-md font-semibold text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
                placeholder="e.g. Wedding Photography"
              />
            </div>
            <div>
              <label className="block text-md font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
                rows="4"
                value={newService.description}
                onChange={(e) =>
                  setNewService({ ...newService, description: e.target.value })
                }
                placeholder="Describe the service..."
              />
            </div>
            <div>
              <label className="block text-md font-semibold text-gray-700 mb-2">
                Upload Cover Image
              </label>
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer w-full py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl shadow hover:bg-gray-200 transition-all flex justify-center items-center border border-dashed border-gray-300">
                  <UploadCloud className="w-5 h-5 mr-2" /> Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload(e, setNewService, "image")
                    }
                  />
                </label>
              </div>
            </div>
            <button
              onClick={handleAddService}
              className="w-full py-4 bg-linear-to-r from-indigo-600 to-indigo-800 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
            >
              Save Service
            </button>
          </div>
        </Modal>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12 h-full overflow-y-auto p-4 lg:p-8">
      <div className="space-y-6">
        <button
          onClick={handleBack}
          className="text-slate-600 hover:text-slate-800 transition flex items-center text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Services
        </button>
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 relative">
          <div className="absolute top-6 right-6 z-10">
            {!isEditingService ? (
              <button
                onClick={() => setIsEditingService(true)}
                className="flex items-center text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg font-bold transition"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Info
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditingService(false);
                    setTempServiceData({ ...selectedService });
                  }}
                  className="text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-bold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveServiceDetails}
                  className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-bold transition flex items-center shadow-md"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </button>
              </div>
            )}
          </div>
          <div className="relative w-full h-64 md:h-80 mb-8 rounded-xl overflow-hidden shadow-inner group bg-slate-100">
            <img
              src={
                isEditingService ? tempServiceData.image : selectedService.image
              }
              className="w-full h-full object-cover"
              alt=""
            />
            {isEditingService && (
              <label className="absolute inset-0 bg-black/50 cursor-pointer flex flex-col items-center justify-center text-white transition hover:bg-black/60">
                <UploadCloud className="w-10 h-10 mb-2" />
                <span className="font-bold text-lg">
                  Click to Change Cover Image
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileUpload(e, setTempServiceData, "image")
                  }
                />
              </label>
            )}
          </div>
          <div className="text-center">
            {isEditingService ? (
              <div className="space-y-4 max-w-3xl mx-auto">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1 text-left">
                    Service Name
                  </label>
                  <input
                    type="text"
                    className="w-full text-center text-3xl font-extrabold text-slate-900 border-b-2 border-indigo-200 focus:border-indigo-600 bg-transparent outline-none py-2 transition"
                    value={tempServiceData.name}
                    onChange={(e) =>
                      setTempServiceData({
                        ...tempServiceData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1 text-left">
                    Description
                  </label>
                  <textarea
                    className="w-full text-center text-lg text-gray-600 border rounded-xl p-4 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                    rows="3"
                    value={tempServiceData.description}
                    onChange={(e) =>
                      setTempServiceData({
                        ...tempServiceData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                  {selectedService.name}
                </h1>
                <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                  {selectedService.description}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Packages & Pricing
            </h2>
            <p className="text-gray-500 mt-1">Manage specific offers.</p>
          </div>
          <button
            onClick={openAddPackageModal}
            className="flex items-center bg-slate-800 text-white px-5 py-2.5 rounded-lg hover:bg-slate-900 transition shadow-md font-bold"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Package
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedService.packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl shadow-lg border-t-4 border-slate-800 p-8 flex flex-col justify-between h-full transition-all hover:shadow-2xl relative group"
            >
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditPackage(pkg)}
                  className="bg-slate-100 text-slate-600 p-2 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePackage(pkg.id)}
                  className="bg-slate-100 text-slate-600 p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {pkg.name}
                </h2>
                <p className="text-4xl font-extrabold text-slate-800 mb-6">
                  {pkg.price}
                </p>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <CheckCircle className="w-5 h-5 mr-3 text-indigo-600 shrink-0 mt-0.5" />{" "}
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={isPackageModalOpen}
        onClose={() => setPackageModalOpen(false)}
        title={editingPackageId ? "Edit Package" : "Add Package"}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-md font-semibold text-gray-700 mb-2">
              Package Name
            </label>
            <input
              type="text"
              className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
              value={newPackage.name}
              onChange={(e) =>
                setNewPackage({ ...newPackage, name: e.target.value })
              }
              placeholder="e.g. Silver Package"
            />
          </div>
          <div>
            <label className="block text-md font-semibold text-gray-700 mb-2">
              Price
            </label>
            <input
              type="text"
              className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
              value={newPackage.price}
              onChange={(e) =>
                setNewPackage({ ...newPackage, price: e.target.value })
              }
              placeholder="e.g. ₱15,000"
            />
          </div>
          <div>
            <label className="block text-md font-semibold text-gray-700 mb-2">
              Features (comma separated)
            </label>
            <textarea
              className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-sm transition"
              value={newPackage.features}
              onChange={(e) =>
                setNewPackage({ ...newPackage, features: e.target.value })
              }
              rows="4"
              placeholder="6 Hours Coverage, 1 Photographer, Digital Album..."
            />
          </div>
          <button
            onClick={handleSavePackage}
            className="w-full py-4 bg-linear-to-r from-indigo-600 to-indigo-800 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
          >
            {editingPackageId ? "Update Package" : "Add Package"}
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={isPhotoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        title="Upload Sample Photo"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-10 bg-gray-50 hover:bg-gray-100 transition">
            <UploadCloud className="w-16 h-16 text-indigo-300 mb-4" />
            <label className="cursor-pointer bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-900 transition shadow-md">
              Browse Files
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, setNewPhotoUrl)}
              />
            </label>
            <p className="text-sm text-gray-500 mt-4">Supports: JPG, PNG</p>
          </div>
          {newPhotoUrl && (
            <div className="border border-gray-200 rounded-xl p-2 bg-white shadow-sm">
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                Preview:
              </p>
              <img
                src={newPhotoUrl}
                alt="Preview"
                className="w-full h-56 object-cover rounded-lg"
              />
            </div>
          )}
          <button
            onClick={handleAddPhoto}
            className="w-full py-4 bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-indigo-800 transition transform hover:scale-[1.01]"
          >
            Confirm Upload
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageServices;

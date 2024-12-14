import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { addDoc, collection, doc, Timestamp, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

function CreateProject() {
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.users);
  const companyDetails = userDetails.companies[userDetails.selectedCompanyIndex];

  const [projectForm, setProjectForm] = useState({
    status: "On-Going",
    location: "",
    description: "",
    name: "",
    dueDate: null,
    startDate: null,
  });

  const [isMoreChecked, setIsMoreChecked] = useState(false);
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState("");

  const handleBookSelect = (e) => setSelectedBookId(e.target.value);

  const handleInputChange = (field, value) => {
    setProjectForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field, dateValue) => {
    setProjectForm((prev) => ({
      ...prev,
      [field]: Timestamp.fromDate(new Date(dateValue)),
    }));
  };

  const handleSubmit = async () => {
    if (!projectForm.name) {
      alert("Project name is required");
      return;
    }

    try {
      const companyRef = doc(db, "companies", companyDetails.companyId);
      const payload = {
        ...projectForm,
        companyRef,
        createdAt: Timestamp.fromDate(new Date()),
      };

      await addDoc(collection(db, "projects"), payload);
      alert("Successfully Created the Project");
      navigate("/projects");
    } catch (err) {
      console.error(err);
      alert("Failed to create the project. Please try again.");
    }
  };

  async function fetchBooks() {
    try {
      const bookRef = collection(
        db,
        "companies",
        companyDetails.companyId,
        "books"
      );
      const getBookData = await getDocs(bookRef);
      const fetchBooks = getBookData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(fetchBooks);
    } catch (error) {
      console.log("🚀 ~ fetchBooks ~ error:", error);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, [companyDetails.companyId]);

  return (
    <div className="p-5 pt-3 bg-gray-100" style={{ width: "100%", height: "92vh" }}>
      <header className="items-center my-2">
        <div className="flex space-x-3">
          <Link
            to="/projects"
            className="flex items-center bg-gray-300 text-gray-700 py-1 px-4 rounded-full hover:bg-gray-400 hover:text-white transition"
          >
            <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
          </Link>
          <h1 className="text-2xl font-bold">Create Project</h1>
        </div>
      </header>

      <div className="p-6">
        <div className="bg-white p-4 rounded-lg">
          <label className="block text-lg text-gray-600 mb-2">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Project Name"
            className="border p-2 rounded w-full"
            value={projectForm.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <label className="block text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                onChange={(e) => handleDateChange("startDate", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Due Date</label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                onChange={(e) => handleDateChange("dueDate", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center my-4">
          <span>More Details</span>
          <label className="relative inline-block w-14 h-8">
            <input
              type="checkbox"
              className="sr-only"
              checked={isMoreChecked}
              onChange={(e) => setIsMoreChecked(e.target.checked)}
            />
            <span className="absolute inset-0 bg-blue-300 rounded-full peer-checked:bg-blue-500 transition"></span>
            <span className="absolute top-0 left-0 w-8 h-8 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition"></span>
          </label>
        </div>

        {isMoreChecked && (
          <div className="bg-white p-4 rounded-lg">
            <label className="block text-lg text-gray-600 mb-2">Bank/Book Details</label>
            <select
              value={selectedBookId}
              onChange={handleBookSelect}
              className="border p-2 rounded w-full mb-4"
            >
              <option value="" disabled>
                Select Bank/Book
              </option>
              {books.map((book, index) => (
                <option key={index} value={book.id}>
                  {`${book.name} - ${book.bankName} - ${book.branch}`}
                </option>
              ))}
            </select>

            <label className="block text-lg text-gray-600 mb-2">Location</label>
            <input
              type="text"
              placeholder="Enter Location"
              className="border p-2 rounded w-full mb-4"
              value={projectForm.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />

            <label className="block text-lg text-gray-600 mb-2">Description</label>
            <input
              type="text"
              placeholder="Enter Description"
              className="border p-2 rounded w-full"
              value={projectForm.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            + Create Project
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;

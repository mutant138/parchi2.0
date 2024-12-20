import React, { useState, useEffect } from 'react';

const StaffHome = () => {
  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const data = [
        { id: 1, name: 'Company A' },
        { id: 2, name: 'Company B' },
        { id: 3, name: 'Company C' },
      ];
      setCompanies(data);
      setShowModal(true); 
    };
    fetchCompanies();
  }, []);

  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Select a Company</h2>
            <ul className="space-y-2">
              {companies.map((company) => (
                <li
                  key={company.id}
                  className="border p-2 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => alert(`Selected ${company.name}`)}
                >
                  {company.name}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold text-center mt-10">Welcome to Staff Home</h1>
    </div>
  );
};

export default StaffHome;

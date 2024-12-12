import React, { useState } from 'react';

const WeekOff = () => {
  const [weekPreference, setWeekPreference] = useState(null); // To store selected week preference
  const [selectedOption, setSelectedOption] = useState(null); // To store Calendar Month or Exclude Week Off
  const [selectedLevel, setSelectedLevel] = useState('Staff Level'); // To store selected level

  const staffList = ['Pavan', 'Ravi', 'Kiran', 'John', 'Alex']; // Example staff names

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h2 className="text-xl font-bold mb-4">Week Off Preferences</h2>

      {/* Step 1: Select Week Preferences */}
      {!weekPreference ? (
        <div>
          <h3 className="text-lg font-bold mb-4">Select Week Preference</h3>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600"
            onClick={() => setWeekPreference(true)}
          >
            Select Week Preferences
          </button>
        </div>
      ) : (
        <>
          {/* Step 2: Dropdown to select Calendar Month or Exclude Week Off */}
          {!selectedOption ? (
            <div>
              <h3 className="text-lg font-bold mb-4">Choose Week Off Calculation</h3>
              <select
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="">Select an option</option>
                <option value="Calendar Month">Calendar Month</option>
                <option value="Exclude Week Offs">Exclude Week Offs</option>
              </select>
            </div>
          ) : (
            <>
              {/* Display Selected Option */}
              <div className="mb-4">
                <h4 className="font-medium text-blue-600">
                  Selected: {selectedOption}
                </h4>
                <button
                  className="text-sm text-red-500 underline"
                  onClick={() => setSelectedOption(null)}
                >
                  Change Week Off Calculation
                </button>
              </div>

              {/* Step 3: Tabs for Staff Level and Business Level */}
              <div className="flex gap-4 mb-6">
                <button
                  className={`px-4 py-2 rounded-lg font-medium ${
                    selectedLevel === 'Staff Level' ? 'bg-green-500 text-white' : 'bg-gray-200'
                  }`}
                  onClick={() => handleLevelChange('Staff Level')}
                >
                  Staff Level
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-medium ${
                    selectedLevel === 'Business Level' ? 'bg-green-500 text-white' : 'bg-gray-200'
                  }`}
                  onClick={() => handleLevelChange('Business Level')}
                >
                  Business Level
                </button>
              </div>

              {/* Staff Level: Show List of Staff */}
              {selectedLevel === 'Staff Level' && (
                <div>
                  <h3 className="text-lg font-bold mb-4">Staff Members</h3>
                  <ul className="space-y-2">
                    {staffList.map((staff, index) => (
                      <li
                        key={index}
                        className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100"
                      >
                        {staff}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Business Level */}
              {selectedLevel === 'Business Level' && (
                <div>
                  <h3 className="text-lg font-bold mb-4">Business Level Details</h3>
                  <p className="text-gray-600">Content related to Business Level goes here...</p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default WeekOff;

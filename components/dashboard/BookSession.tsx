import React from "react";

function BookSession() {
  return (
    <div className="mx-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">John Doe</h3>
          <p className="text-sm text-gray-600">john.doe@example.com</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Jane Smith</h3>
          <p className="text-sm text-gray-600">jane.smith@example.com</p>
        </div>
      </div>
    </div>
  );
}

export default BookSession;

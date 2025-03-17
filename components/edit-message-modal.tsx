import React, { useState } from "react";

interface EditMessageModalProps {
  onSave: (updatedMessage: string) => void;
  isOpen: boolean;
  onClose: () => void;
  initialMessage: string;
}

const EditMessageModal = ({
  isOpen,
  onSave,
  onClose,
  initialMessage,
}: EditMessageModalProps) => {
  const [editedMessage, setEditedMessage] = useState(initialMessage);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Message</h2>

        <textarea
          value={editedMessage}
          onChange={(e) => setEditedMessage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4 min-h-[100px]"
          autoComplete="off"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(editedMessage);
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMessageModal;

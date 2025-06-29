import { useState } from "react";
import type { User } from "../../../../types/applicant";

const useApplicantModal = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return {
    selectedUser,
    isModalOpen,
    handleUserClick,
    handleCloseModal,
  };
};

export default useApplicantModal; 
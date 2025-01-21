import { useState, useEffect } from "react";

import {
  assignTaskForSpecificKid,
  createTasks,
} from "../../../../api/service/employee/EmployeeService";
import EnquiryRelatedTaskComponentUI from "./EnquiryRelatedTaskComponentUI";

const EnquiryRelatedTaskComponent = ({ id }) => {
  console.log("enq Related task", id);
  const empId = localStorage.getItem("empId");
  const department = localStorage.getItem("department");

  const [kidsInfo, setKidsInfo] = useState(null);
  const [employeesData, setEmployeesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
 
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    task: "",
    taskDateTime: "",
    assignedBy: empId || "",
  });

  const [submissionStatus, setSubmissionStatus] = useState({
    submitted: false,
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dropDownData = await assignTaskForSpecificKid(id);
        if (!dropDownData.status === 200) {
          throw new Error("Failed to fetch data");
        }
        setKidsInfo(dropDownData.data.kidsData);
        setEmployeesData(dropDownData.data.employeeData);

        const uniqueDepartments = [
          ...new Set(
            dropDownData.data.employeeData.map((emp) => emp.department)
          ),
        ];
        setDepartments(uniqueDepartments);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSubmissionStatus({
          submitted: true,
          message: "Error loading data. Please refresh the page.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Automatically select users when departments are selected
    const usersInSelectedDepartments = employeesData
      .filter((emp) => selectedDepartments.includes(emp.department))
      .map((emp) => emp.email);

    setSelectedUsers((prev) => {
      const nonDepartmentUsers = prev.filter(
        (email) =>
          !employeesData.find((emp) => emp.email === email)?.department ||
          !selectedDepartments.includes(
            employeesData.find((emp) => emp.email === email)?.department
          )
      );
      return [
        ...new Set([...nonDepartmentUsers, ...usersInSelectedDepartments]),
      ];
    });
  }, [selectedDepartments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.task ||
      !formData.taskDateTime ||
      selectedUsers.length === 0
    ) {
      setSubmissionStatus({
        submitted: true,
        message:
          "Please fill in all required fields and select at least one user.",
      });
      return;
    }

    try {
      await Promise.all(
        selectedUsers.map(async (userEmail) => {
          const taskData = {
            ...formData,
            assignedTo: userEmail,
            kidsRelatedTo: kidsInfo._id,
          };
          await createTasks(taskData);
        })
      );

      setSubmissionStatus({
        submitted: true,
        message: `Tasks Successfully Assigned to ${selectedUsers.length} users`,
      });

      setFormData({
        task: "",
        taskDateTime: "",
        assignedBy: empId || "",
      });
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error creating tasks:", error);
      setSubmissionStatus({
        submitted: true,
        message: "Error creating tasks, please try again.",
      });
    }
  };

  const filteredEmployees = employeesData.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDepartmentSelection = (dept) => {
    setSelectedDepartments((prev) => {
      if (prev.includes(dept)) {
        return prev.filter((d) => d !== dept);
      }
      return [...prev, dept];
    });
  };

  const handleUserSelection = (email) => {
    const user = employeesData.find((emp) => emp.email === email);
    setSelectedUsers((prev) => {
      if (prev.includes(email)) {
        return prev.filter((e) => e !== email);
      }
      return [...prev, email];
    });
  };

  const removeUser = (email) => {
    setSelectedUsers((prev) => prev.filter((e) => e !== email));
    // If user belongs to a selected department, deselect the department
    const user = employeesData.find((emp) => emp.email === email);
    if (user && selectedDepartments.includes(user.department)) {
      setSelectedDepartments((prev) =>
        prev.filter((d) => d !== user.department)
      );
    }
  };

  const removeDepartment = (dept) => {
    setSelectedDepartments((prev) => prev.filter((d) => d !== dept));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return <EnquiryRelatedTaskComponentUI department={department} submissionStatus={submissionStatus} kidsInfo={kidsInfo} departments={departments} formData={formData} setSearchTerm={setSearchTerm} handleInputChange={handleInputChange} selectedUsers={selectedUsers}  filteredEmployees={filteredEmployees} handleDepartmentSelection={handleDepartmentSelection} handleUserSelection={handleUserSelection} removeUser={removeUser} handleSubmit={handleSubmit} removeDepartment={removeDepartment} selectedDepartments={selectedDepartments} employeesData={employeesData} setFormData={setFormData} setSelectedUsers={setSelectedUsers} setSelectedDepartments={setSelectedDepartments} setSubmissionStatus={setSubmissionStatus} searchTerm={searchTerm} />;
};

export default EnquiryRelatedTaskComponent;

const express = require("express");
const {
  createOrganization,
  loginOrganization,
  editOrganizationPassword,
  editOrganization,
  terminateOrganization,
} = require("./controllers/organization.controller");
const {
  createStaff,
  loginStaff,
  getStaff,
  editStaffPassword,
  editStaff,
} = require("./controllers/staff.controller");
const {
  createTeacher,
  getTeacher,
} = require("./controllers/teacher.controller");
const {
  createStudent,
  getStudent,
  editStudent,
  getStudentByQuery,
} = require("./controllers/student.controller");
const {
  createPayment,
  getPayment,
} = require("./controllers/payment.controller");
const {
  getSalary,
  createSalary,
  deleteSalary,
} = require("./controllers/salary.controller");
const {
  createSubscription,
  getSubscription,
  editSubscription,
} = require("./controllers/subcription.controller");
const {
  createSubject,
  getSubject,
} = require("./controllers/subject.controller");
const {
  createGroup,
  getGroup,
  editGroup,
  getGroupByQuery,
} = require("./controllers/group.controller");
const {
  createExpenseCategory,
  getExpenseCategory,
  deleteExpenseCategory,
  createExpense,
  getExpense,
  deleteExpense,
} = require("./controllers/expense.controller");
const rt = express.Router();

rt.post("/organization/create", createOrganization);
rt.post("/organization/login", loginOrganization);
rt.put("/organization/edit/password", editOrganizationPassword);
rt.put("/organization/edit", editOrganization);
rt.delete("/organization/terminate", terminateOrganization);

rt.post("/staff/create", createStaff);
rt.post("/staff/login", loginStaff);
rt.get("/staff/get", getStaff);
rt.put("/staff/edit/password", editStaffPassword);
rt.put("/staff/edit", editStaff);

rt.post("/teacher/create", createTeacher);
rt.get("/teacher/get", getTeacher);

rt.post("/student/create", createStudent);
rt.get("/student/get", getStudent);
rt.put("/student/edit", editStudent);
rt.get("/student/query", getStudentByQuery)

rt.post("/payment/create", createPayment);
rt.get("/payment/get", getPayment);

rt.post("/salary/create", createSalary);
rt.get("/salary/get", getSalary);
rt.delete("/salary/delete", deleteSalary);

rt.post("/subscription/create", createSubscription);
rt.get("/subscription/get", getSubscription);
rt.put("/subscription/edit", editSubscription);

rt.post("/subject/create", createSubject);
rt.get("/subject/get", getSubject);

rt.post("/teacher/create", createTeacher);
rt.get("/teacher/get", getTeacher);

rt.post("/group/create", createGroup);
rt.get("/group/get", getGroup);
rt.get("/group/query", getGroupByQuery);
rt.put("/group/edit", editGroup);

rt.post("/expense/category/create", createExpenseCategory);
rt.get("/expense/category", getExpenseCategory);
rt.delete("/expense/category/delete", deleteExpenseCategory);
rt.post("/expense/create", createExpense);
rt.get("/expense", getExpense);
rt.delete("/expense/delete", deleteExpense);

module.exports = rt;

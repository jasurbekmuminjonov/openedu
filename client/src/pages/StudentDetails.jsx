import { useNavigate, useParams } from "react-router-dom";
import { useGetStudentByQueryQuery } from "../context/services/student.service";
import { useEffect } from "react";
import defaultStudent from "../assets/defaultStudent.png";
import { Button, Popover, Table, Tag, Tooltip } from "antd";
import { useGetGroupByQueryQuery } from "../context/services/group.service";
import { FaList } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useGetPaymentQuery } from "../context/services/payment.service";

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: payment = [], isLoading: paymentLoading } = useGetPaymentQuery({
    student_id: id,
  });
  const { data: studentData, isLoading: studentLoading } =
    useGetStudentByQueryQuery({ id });
  const { data: groupData, isLoading: groupLoading } = useGetGroupByQueryQuery({
    student_id: id,
  });
  useEffect(() => {
    if (!studentLoading && !studentData) {
      navigate("/student");
    }
  }, [studentData, studentLoading, navigate]);
  const groupColumns = [
    {
      title: "№",
      render: (_, __, index) => `${index + 1}.`,
    },
    {
      title: "O'qituvchi",
      render: (record) => (
        <p
          title={`${record.teacher_id.extra_fields.map((f) => f.field_value)}`}
        >
          {`${record.teacher_id.first_name} ${record.teacher_id.last_name}`}
        </p>
      ),
    },
    {
      title: "Fan",
      render: (record) => (
        <p
          title={`${record.subject_id.extra_fields.map((f) => f.field_value)}`}
        >
          {record.subject_id.subject_name}
        </p>
      ),
    },
    {
      title: "Oylik to'lov",
      render: (record) => (
        <p
          title={`${record.subscription_id.extra_fields.map(
            (f) => f.field_value
          )}`}
        >
          {record.subscription_id.subscription_name}
        </p>
      ),
    },
    {
      title: "Qo'shilgan sana",
      render: (_, record) =>
        new Date(
          record.students.find((s) => s.student_id === id).joined_date
        ).toLocaleString("ru-RU"),
    },
    {
      title: "Operatsiyalar",
      render: (_, record) => (
        <div className="table-actions">
          <Tooltip title="Qo'shimcha maydonlar" placement="bottom">
            <Popover
              title="Qo'shimcha maydonlar"
              trigger="click"
              content={
                <Table
                  size="small"
                  pagination={false}
                  dataSource={record.extra_fields}
                  columns={[
                    { title: "Maydon nomi", dataIndex: "field_name" },
                    { title: "Maydon qiymati", dataIndex: "field_value" },
                  ]}
                />
              }
            >
              <Button icon={<FaList />} />
            </Popover>
          </Tooltip>
          <Tooltip title="Batafsil" placement="bottom">
            <Button
              onClick={() => navigate(`/group/${record._id}`)}
              icon={<FaExternalLinkAlt />}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="group-details">
        <img width="100" src={defaultStudent} alt="defaultStudent" />
        <div className="group-detail">
          <p>To'liq ism:</p>
          <p>
            {studentData?.first_name} {studentData?.last_name}{" "}
            {studentData?.middle_name}
          </p>
        </div>
        <div className="group-detail">
          <p>Telefon raqam:</p>
          <p>{studentData?.phone}</p>
        </div>
        <div className="group-detail">
          <p>Balans:</p>
          <Tag color={studentData?.balance >= 0 ? "green" : "red"}>
            {studentData?.balance.toLocaleString("ru-RU")}
          </Tag>
        </div>
        {studentData?.extra_fields.map((e) => (
          <div className="group-detail">
            <p>{e.field_name}:</p>
            <p>{e.field_value}</p>
          </div>
        ))}
      </div>
      <p>O'quvchining guruhlari</p>
      <Table
        dataSource={groupData}
        columns={groupColumns}
        loading={groupLoading}
        size="small"
      />
      <p>O'quvchining to'lovlari</p>
      <Table
        dataSource={[...(payment || [])].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )}
        columns={[
          {
            title: "To'lov summasi",
            dataIndex: "payment_amount",
            render: (text) => text?.toLocaleString("ru-RU"),
          },
          {
            title: "To'lov sanasi",
            dataIndex: "createdAt",
            render: (text) => new Date(text)?.toLocaleString("ru-RU"),
          },
          {
            title: "Xodim",
            dataIndex: "staff_id",
            render: (text) => `${text.first_name} ${text.last_name}`,
          },
        ]}
        loading={paymentLoading}
        size="small"
      />
      <p>O'quvchining balansidan pul yechishlar</p>
      <Table
        dataSource={studentData?.deductions.sort(
          (a, b) => new Date(b.deduction_date) - new Date(a.deduction_date)
        )}
        columns={[
          {
            title: "Abonement",
            render: (_, record) =>
              record.group_id.subscription_id.subscription_name,
          },
          {
            title: "Fan",
            render: (_, record) => record.group_id.subject_id.subject_name,
          },
          {
            title: "O'qituvchi",
            render: (_, record) =>
              `${record.group_id.teacher_id.first_name} ${record.group_id.teacher_id.last_name}`,
          },
          {
            title: "Yechish summasi",
            dataIndex: "deduction_amount",
            render: (text) => text?.toLocaleString("ru-RU"),
          },
          {
            title: "Yechish sanasi",
            dataIndex: "deduction_date",
            render: (text) => new Date(text)?.toLocaleString("ru-RU"),
          },
        ]}
        loading={studentLoading}
        size="small"
      />
    </div>
  );
};

export default StudentDetails;

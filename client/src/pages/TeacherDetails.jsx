import { useNavigate, useParams } from "react-router-dom";
import { useGetGroupByQueryQuery } from "../context/services/group.service";
import { useGetSalaryQuery } from "../context/services/salary.service";
import { useGetTeacherQuery } from "../context/services/teacher.service";
import defaultStudent from "../assets/defaultStudent.png";
import { Button, Table, Tooltip } from "antd";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useMemo, useState } from "react";

const TeacherDetails = () => {
  const { id } = useParams();
  const { data: groups = [], isLoading: groupLoading } =
    useGetGroupByQueryQuery({ teacher_id: id });
  const { data: salary = [], isLoading: salaryLoading } = useGetSalaryQuery({
    teacher_id: id,
  });
  const { data: teacher = {}, isLoading: teacherLoading } = useGetTeacherQuery({
    id,
  });
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([null, null]);

  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const filteredSalary = useMemo(() => {
    return salary.filter((s) => {
      if (!dateRange[0] || !dateRange[1]) return true;
      const start = normalizeDate(dateRange[0]);
      const end = normalizeDate(dateRange[1]);
      const current = normalizeDate(s.createdAt);
      return current >= start && current <= end;
    });
  }, [salary, dateRange]);
  const totalSalary = useMemo(() => {
    return filteredSalary.reduce((acc, s) => acc + s.salary_amount, 0);
  }, [filteredSalary]);
  const groupColumns = [
    {
      title: "№",
      render: (_, __, index) => `${index + 1}.`,
    },
    {
      title: "Fan",
      render: (record) => (
        <p
          title={`${record?.subject_id?.extra_fields?.map(
            (f) => f.field_value
          )}`}
        >
          {record.subject_id.subject_name}
        </p>
      ),
    },
    {
      title: "Oylik to'lov",
      render: (record) => (
        <p
          title={`${record?.subscription_id?.extra_fields?.map(
            (f) => f.field_value
          )}`}
        >
          {record.subscription_id.subscription_name}
        </p>
      ),
    },
    {
      title: "Oylik to'lov summasi",
      render: (record) =>
        record.subscription_id.subscription_amount.toLocaleString("ru-RU"),
    },
    {
      title: "O'quvchi soni",
      render: (_, record) => record.students.length + " ta",
    },
    {
      title: "Operatsiyalar",
      render: (_, record) => (
        <div className="table-actions">
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

  const salaryColumns = [
    {
      title: "№",
      render: (_, __, index) => `${index + 1}.`,
    },
    {
      title: "Summa",
      dataIndex: "salary_amount",
      render: (text) => text.toLocaleString("ru-RU"),
    },
    {
      title: (
        <div
          style={{
            width: "150px",
            display: "flex",
            gap: "4px",
            flexDirection: "column",
          }}
        >
          <input
            type="date"
            value={dateRange[0] || ""}
            onChange={(e) => setDateRange([e.target.value, dateRange[1]])}
          />
          <input
            type="date"
            value={dateRange[1] || ""}
            onChange={(e) => setDateRange([dateRange[0], e.target.value])}
          />
        </div>
      ),
      dataIndex: "createdAt",
      render: (text) => new Date(text).toLocaleString("ru-RU"),
    },
  ];
  return (
    <div className="page">
      <div className="group-details">
        <img width="100" src={defaultStudent} alt="defaultStudent" />
        <div className="group-detail">
          <p>To'liq ism:</p>
          <p>
            {teacher?.first_name} {teacher?.last_name}
          </p>
        </div>
        <div className="group-detail">
          <p>Telefon raqam:</p>
          <p>{teacher?.phone}</p>
        </div>
        {teacher?.extra_fields?.map((e) => (
          <div className="group-detail">
            <p>{e.field_name}:</p>
            <p>{e.field_value}</p>
          </div>
        ))}
      </div>
      <p>Guruhlar</p>
      <Table
        dataSource={groups}
        loading={groupLoading}
        size="small"
        columns={groupColumns}
      />
      <p>Berilgan maoshlar</p>
      <Table
        loading={salaryLoading}
        size="small"
        columns={salaryColumns}
        dataSource={filteredSalary.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )}
        footer={() => (
          <div style={{ fontWeight: "500", textAlign: "right" }}>
            Jami: {totalSalary.toLocaleString("ru-RU")} UZS
          </div>
        )}
      />
    </div>
  );
};

export default TeacherDetails;

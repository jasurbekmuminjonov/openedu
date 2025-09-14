import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaExternalLinkAlt, FaSignOutAlt } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";

import {
  useGetStudentByQueryQuery,
  useLazyGetStudentByQueryQuery,
} from "../context/services/student.service";
import {
  useEditGroupMutation,
  useGetGroupByQueryQuery,
} from "../context/services/group.service";
import { Button, Table, Tag } from "antd";
const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editGroup, { isLoading: editLoading }] = useEditGroupMutation();
  const { data: groupStudents = [], isLoading: studentsLoading } =
    useGetStudentByQueryQuery({
      group_id: id,
    });
  const [
    searchStudent,
    { data: searchStudentData = [], isLoading: searchStudentLoading },
  ] = useLazyGetStudentByQueryQuery();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const { data: groupData, isLoading: groupLoading } = useGetGroupByQueryQuery({
    id,
  });

  const filteredGroupStudents = groupStudents.filter((s) => {
    if (!localSearchQuery) return true;
    const queryLower = localSearchQuery.toLowerCase();
    const combined =
      `${s.first_name}${s.last_name}${s.middle_name}${s.phone}`.toLowerCase();
    return combined.includes(queryLower);
  });

  useEffect(() => {
    if (groupStudents?.length) {
      setStudents(
        groupStudents.map((g) => {
          return { student_id: g._id };
        })
      );
    }
  }, [groupStudents]);

  const handleToggleStudent = async (s) => {
    let newStudents;
    if (students.find((st) => st.student_id === s._id)) {
      newStudents = students.filter((g) => g.student_id !== s._id);
    } else {
      newStudents = [
        ...students,
        { student_id: s._id, joined_date: new Date() },
      ];
    }
    setStudents(newStudents);
    setSearchQuery("");

    try {
      await editGroup({ group_id: id, students: newStudents });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    searchStudent({ q: searchQuery });
  }, [searchQuery, searchStudent]);
  const allDays = [
    {
      day: "monday",
      label: "Dushanba",
    },
    {
      day: "tuesday",
      label: "Seshanba",
    },
    {
      day: "wednesday",
      label: "Chorshanba",
    },
    {
      day: "thursday",
      label: "Payshanba",
    },
    {
      day: "friday",
      label: "Juma",
    },
    {
      day: "saturday",
      label: "Shanba",
    },
    {
      day: "sunday",
      label: "Yakshanba",
    },
  ];

  useEffect(() => {
    if (!groupLoading && !groupData) {
      navigate("/group");
    }
  }, [groupData, groupLoading, navigate]);

  const columns = [
    {
      title: "№",
      render: (_, __, index) => `${index + 1}.`,
    },
    {
      title: "Ism",
      dataIndex: "first_name",
    },
    {
      title: "Familiya",
      dataIndex: "last_name",
    },
    {
      title: "Otasining ismi",
      dataIndex: "middle_name",
    },

    {
      title: "Telefon",
      dataIndex: "phone",
    },
    {
      title: "Balans",
      dataIndex: "balance",
      render: (text) => (
        <Tag color={text >= 0 ? "green" : "red"}>
          {text?.toLocaleString("ru-RU")}
        </Tag>
      ),
    },
    {
      title: "Qo'shilgan sana",
      render: (_, record) =>
        new Date(
          groupData.students.find(
            (s) => s.student_id === record._id
          ).joined_date
        ).toLocaleString("ru-RU"),
    },
    {
      title: "Operatsiyalar",
      render: (_, record) => (
        <div className="table-actions">
          <Button
            onClick={() => handleToggleStudent(record)}
            icon={<FaSignOutAlt />}
            danger
          />
          <Button
            onClick={() => navigate(`/student/${record._id}`)}
            icon={<FaExternalLinkAlt />}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-actions">
          <input
            style={{ width: "400px" }}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="O'quvchining to'liq ismi yoki raqami orqali qidirish"
          />
          {searchStudentData.length > 0 && (
            <div className="search-result-container">
              {searchStudentData.map((s) => (
                <div className="search-result">
                  <p>
                    {s.first_name} {s.last_name} {s.middle_name}
                  </p>
                  <button onClick={() => handleToggleStudent(s)}>
                    {students.find((st) => st.student_id === s._id) ? (
                      <FaSignOutAlt color="red" size={20} />
                    ) : (
                      <IoMdPersonAdd color="green" size={20} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="group-details">
        <div className="group-detail">
          <p>O'qituvchi:</p>
          <p>
            {groupData?.teacher_id
              ? `${groupData?.teacher_id.first_name} ${groupData?.teacher_id.last_name}`
              : "−"}{" "}
            <br />
            {groupData?.teacher_id.extra_fields.map((f) => (
              <>
                {f.field_name}: {f.field_value} <br />
              </>
            ))}
          </p>
        </div>
        <div className="group-detail">
          <p>Fan:</p>
          <p>
            {groupData?.subject_id.subject_name} <br />
            {groupData?.subject_id.extra_fields.map((f) => (
              <>
                {f.field_name}: {f.field_value} <br />
              </>
            ))}
          </p>
        </div>
        <div className="group-detail">
          <p>Oylik to'lov:</p>
          <p>
            {groupData?.subscription_id.subscription_name} <br />
            Oylik to'lov:{" "}
            {groupData?.subscription_id.subscription_amount?.toLocaleString(
              "ru-RU"
            )}
            <br />
            Yechilish sanasi: Oyning{" "}
            {groupData?.subscription_id.subscription_date}-kuni
            <br />
            {groupData?.subscription_id.extra_fields.map((f) => (
              <>
                {f.field_name}: {f.field_value} <br />
              </>
            ))}
          </p>
        </div>
        <div className="group-detail">
          <p>Dars kunlari:</p>
          <p>
            {groupData?.lesson_days.map(
              (l) => " • " + allDays.find((a) => a.day === l).label
            )}
          </p>
        </div>
        <div className="group-detail">
          <p>O'quvchilar soni:</p>
          <p>{groupData?.students.length} nafar</p>
        </div>
        <div className="group-detail">
          <p>Guruhni yaratish sanasi:</p>
          <p>{new Date(groupData?.createdAt).toLocaleString("ru-RU")}</p>
        </div>
        {groupData?.extra_fields.map((e) => (
          <div className="group-detail">
            <p>{e.field_name}:</p>
            <p>{e.field_value}</p>
          </div>
        ))}
      </div>
      <div className="page-header">
        <div className="page-actions">
          <input
            style={{ width: "400px" }}
            type="search"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            placeholder="O'quvchining to'liq ismi yoki raqami orqali qidirish"
          />
        </div>
      </div>
      <Table
        dataSource={filteredGroupStudents}
        columns={columns}
        loading={studentsLoading || groupLoading}
        size="small"
      />
    </div>
  );
};

export default GroupDetails;

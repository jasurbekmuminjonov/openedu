import {
  Button,
  Table,
  Popover,
  Tooltip,
  Form,
  InputNumber,
  notification,
} from "antd";
import { useGetGroupQuery } from "../context/services/group.service";
import { useGetTeacherQuery } from "../context/services/teacher.service";
import { FaList } from "react-icons/fa6";
import { useCreateSalaryMutation } from "../context/services/salary.service";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Salary = () => {
  const { data: teachers = [], isLoading: teachersLoading } =
    useGetTeacherQuery();
  const { data: groups, isLoading: groupLoading } = useGetGroupQuery();
  const navigate = useNavigate();
  const [createSalary, { isLoading: createSalaryLoading }] =
    useCreateSalaryMutation();
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
      title: "Telefon",
      dataIndex: "phone",
    },
    {
      title: "Guruhlari soni",
      render: (_, record) =>
        groups?.filter((g) => g.teacher_id._id === record._id).length + " ta",
    },
    {
      title: "O'quvchilari soni",
      render: (_, record) =>
        groups
          ?.filter((g) => g.teacher_id._id === record._id)
          .reduce((acc, g) => acc + g.students.length, 0) + " ta",
    },
    {
      title: "Guruhning jami to'lovi",
      render: (_, record) => {
        const teacherGroups = groups?.filter(
          (g) => g.teacher_id._id === record._id
        );
        return teacherGroups
          ?.reduce(
            (acc, g) =>
              acc + g.students.length * g.subscription_id.subscription_amount,
            0
          )
          .toLocaleString("ru-RU");
      },
    },
    {
      title: "Operatsiyalar",
      render: (_, record) => (
        <div className="table-actions">
          <Tooltip title="Barcha guruhlari ro'yhati" placement="bottom">
            <Popover
              title="Barcha guruhlari ro'yhati"
              placement="bottom"
              trigger="click"
              content={
                <Table
                  size="small"
                  pagination={false}
                  columns={[
                    {
                      title: "Fan",
                      dataIndex: "subject_id",
                      render: (text) => text.subject_name,
                    },
                    {
                      title: "O'quvchi soni",
                      dataIndex: "students",
                      render: (text) => text.length + " ta",
                    },
                    {
                      title: "Abonement nomi",
                      dataIndex: "subscription_id",
                      render: (text) => text.subscription_name,
                    },
                    {
                      title: "Abonement summasi",
                      dataIndex: "subscription_id",
                      render: (text) =>
                        text.subscription_amount.toLocaleString("ru-RU"),
                    },
                    {
                      title: "Jami to'lov",
                      render: (_, record) =>
                        (
                          record.students.length *
                          record.subscription_id.subscription_amount
                        ).toLocaleString("ru-RU"),
                    },
                  ]}
                  dataSource={groups?.filter(
                    (g) => g.teacher_id._id === record._id
                  )}
                />
              }
            >
              <Button icon={<FaList />} />
            </Popover>
          </Tooltip>
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
          <Tooltip title="Maosh berish">
            <Popover
              trigger="click"
              title={`${record.first_name} ${record.last_name}ga maosh berish`}
              placement="bottom"
              content={
                <Form
                  layout="vertical"
                  onFinish={async (data) => {
                    try {
                      await createSalary({
                        teacher_id: record._id,
                        salary_amount: data.salary_amount,
                      });
                      notification.success({ message: "success" });
                    } catch (err) {
                      console.log(err);
                    }
                  }}
                >
                  <Form.Item
                    name="salary_amount"
                    label="Summa"
                    rules={[{ required: true, message: "Kiritish majburiy" }]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      addonAfter="UZS"
                      formatter={(val) => {
                        if (!val) return "";
                        return Number(val).toLocaleString("ru-RU");
                      }}
                      parser={(val) => {
                        if (!val) return "";
                        return Number(val.replace(/\s/g, "").replace(/,/g, ""));
                      }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      type="primary"
                      style={{ width: "100%" }}
                      loading={createSalaryLoading}
                    >
                      Kiritish
                    </Button>
                  </Form.Item>
                </Form>
              }
            >
              <Button icon={<LiaMoneyBillWaveSolid size={20} />} />
            </Popover>
          </Tooltip>
          <Tooltip title="Batafsil" placement="bottom">
            <Button
              onClick={() => navigate(`/teacher/${record._id}`)}
              icon={<FaExternalLinkAlt />}
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  return (
    <div className="page">
      <p>Oylik maosh</p>
      <Table
        loading={teachersLoading || groupLoading}
        columns={columns}
        dataSource={teachers}
        size="small"
      />
    </div>
  );
};

export default Salary;

import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  Popover,
  Table,
  Tooltip,
} from "antd";
import { useMemo, useState } from "react";
import { FaList, FaXmark } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { FaExternalLinkAlt } from "react-icons/fa";

import {
  useCreateTeacherMutation,
  useGetTeacherQuery,
} from "../context/services/teacher.service";
import { useNavigate } from "react-router-dom";

const Teacher = () => {
  const { data: staff = [], isLoading: getStaffLoading } = useGetTeacherQuery();
  const [formModal, setFormModal] = useState(false);
  const [createStaff, { isLoading: createLoading }] =
    useCreateTeacherMutation();
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const filteredStaff = useMemo(() => {
    return staff.filter(
      (s) =>
        s.first_name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        s.last_name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        s.phone?.toLowerCase().includes(searchQuery?.toLowerCase())
    );
  }, [staff, searchQuery]);

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
              onClick={() => navigate(`/teacher/${record._id}`)}
              icon={<FaExternalLinkAlt />}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  async function handleSubmit(values) {
    try {
      const res = await createStaff(values).unwrap();
      notification.success({ message: res.message, placement: "top" });
      form.resetFields();
      setFormModal(false);
    } catch (err) {
      console.log(err);
      notification.error({
        message: "request_error",
        description: err.data.message,
        placement: "top",
      });
    }
  }

  return (
    <div className="page">
      <Modal
        footer={[]}
        open={formModal}
        onCancel={() => {
          form.resetFields();
          setFormModal(false);
        }}
        title={"Yangi o'qituvchi kiritish"}
      >
        <Form
          onFinish={handleSubmit}
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="first_name"
            label="O'qituvchi ismi"
            rules={[{ required: true, message: "Kiritish majburiy" }]}
          >
            <Input placeholder="Ali" />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="O'qituvchi familiyasi"
            rules={[{ required: true, message: "Kiritish majburiy" }]}
          >
            <Input placeholder="Valiyev" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="O'qituvchi tel raqami"
            rules={[{ required: true, message: "Kiritish majburiy" }]}
          >
            <Input placeholder="+998901234567" />
          </Form.Item>
          <Form.List label="Qo'shimcha maydonlar" name="extra_fields">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      gap: "8px",
                      height: "40px",
                    }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "field_name"]}
                      rules={[{ required: true, message: "Kiritish majburiy" }]}
                    >
                      <Input placeholder="Maydon nomi" />
                    </Form.Item>
                    <Form.Item
                      style={{ height: "32px" }}
                      {...restField}
                      name={[name, "field_value"]}
                      rules={[{ required: true, message: "Kiritish majburiy" }]}
                    >
                      <Input placeholder="Maydon qiymati" />
                    </Form.Item>
                    <Button
                      type="text"
                      onClick={() => remove(name)}
                      style={{ height: "32px" }}
                    >
                      <FaXmark color="red" size={20} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="default"
                  onClick={() => add()}
                  style={{ marginBottom: "10px" }}
                >
                  <IoMdAdd /> Qo'shish
                </Button>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button
              loading={createLoading}
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
            >
              {"Kiritish"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div className="page-header">
        <p>O'qituvchilar</p>
        <div className="page-actions">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ism, familiya va tel raqam bo'yicha izlash"
          />
          <button onClick={() => setFormModal(true)}>Yangi o'qituvchi</button>
        </div>
      </div>
      <div className="page-content">
        <Table
          size="small"
          loading={getStaffLoading}
          dataSource={filteredStaff}
          columns={columns}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Teacher;

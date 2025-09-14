import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  Popover,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { useMemo, useState } from "react";
import { FaList, FaXmark } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import {
  useCreateStudentMutation,
  useEditStudentMutation,
  useGetStudentQuery,
} from "../context/services/student.service";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Student = () => {
  const { data: staff = [], isLoading: getStaffLoading } = useGetStudentQuery();
  const [editingStaff, setEditingStaff] = useState({});
  const [formModal, setFormModal] = useState(false);
  const [createStaff, { isLoading: createLoading }] =
    useCreateStudentMutation();
  const [editStaff, { isLoading: editLoading }] = useEditStudentMutation();
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const filteredStaff = useMemo(() => {
    return staff.filter(
      (s) =>
        s.first_name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        s.last_name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        s.middle_name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
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
          <Tooltip title="Barcha pul yechishlar" placement="bottom">
            <Popover
              title="Barcha pul yechishlar"
              trigger="click"
              content={
                <Table
                  size="small"
                  pagination={false}
                  dataSource={record.deductions}
                  summary={(pageData) => (
                    <Table.Summary.Row>
                      <Table.Summary.Cell>
                        {pageData
                          .reduce((a, b) => a + b.deduction_amount, 0)
                          ?.toLocaleString("ru-RU")}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>Jami summa</Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                  columns={[
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
                />
              }
            >
              <Button icon={<FaList />} />
            </Popover>
          </Tooltip>
          <Tooltip title="Tahrirlash" placement="bottom">
            <Button
              onClick={() => {
                form.setFieldsValue({
                  first_name: record.first_name,
                  last_name: record.last_name,
                  middle_name: record.middle_name,
                  phone: record.phone,
                  extra_fields: record.extra_fields,
                });
                setEditingStaff(record);
                setFormModal(true);
              }}
              icon={<MdEdit />}
            />
          </Tooltip>
          <Tooltip title="Batafsil" placement="bottom">
            <Button
              onClick={() => navigate(`/student/${record._id}`)}
              icon={<FaExternalLinkAlt />}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  async function handleSubmit(values) {
    try {
      let res;
      if (editingStaff?.first_name) {
        res = await editStaff({
          ...values,
          student_id: editingStaff?._id,
        }).unwrap();
      } else {
        res = await createStaff(values).unwrap();
      }
      notification.success({ message: res.message, placement: "top" });
      form.resetFields();
      setEditingStaff({});
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
          setEditingStaff({});
          setFormModal(false);
        }}
        title={
          editingStaff?.first_name
            ? `${editingStaff?.last_name} ${editingStaff?.first_name}ni tahrirlash`
            : "Yangi o'quvchi kiritish"
        }
      >
        <Form
          onFinish={handleSubmit}
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="first_name"
            label="O'quvchi ismi"
            rules={[{ required: true, message: "Kiritish majburiy" }]}
          >
            <Input placeholder="Jasur" />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="O'quvchi familiyasi"
            rules={[{ required: true, message: "Kiritish majburiy" }]}
          >
            <Input placeholder="Mo'minjonov" />
          </Form.Item>
          <Form.Item
            name="middle_name"
            label="Otasining ismi"
            rules={[{ required: true, message: "Kiritish majburiy" }]}
          >
            <Input placeholder="Zokirjon o'g'li" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="O'quvchi tel raqami"
            rules={[{ required: true, message: "Kiritish majburiy" }]}
          >
            <Input placeholder="+998901234567" />
          </Form.Item>
          {/* {!editingStaff?.first_name && (
            <Form.Item
              name="password"
              label="O'quvchi paroli"
              rules={[{ required: true, message: "Kiritish majburiy" }]}
            >
              <Input.Password placeholder="* * * * * *" />
            </Form.Item>
          )} */}
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
              loading={editLoading || createLoading}
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
            >
              {editingStaff?.first_name ? "Tahrirlash" : "Kiritish"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div className="page-header">
        <p>O'quvchilar</p>
        <div className="page-actions">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="To'liq ism va tel raqam bo'yicha izlash"
          />
          <button onClick={() => setFormModal(true)}>Yangi o'quvchi</button>
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

export default Student;

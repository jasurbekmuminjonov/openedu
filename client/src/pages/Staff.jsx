import {
  useCreateStaffMutation,
  useEditStaffMutation,
  useEditStaffPasswordMutation,
  useGetStaffQuery,
} from "../context/services/staff.service";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  notification,
  Popover,
  Table,
  Tooltip,
} from "antd";
import { useMemo, useState } from "react";
import { FaKey, FaList, FaXmark } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const Staff = () => {
  const { data: staff = [], isLoading: getStaffLoading } = useGetStaffQuery();
  const [editingStaff, setEditingStaff] = useState({});
  const [formModal, setFormModal] = useState(false);
  const [createStaff, { isLoading: createLoading }] = useCreateStaffMutation();
  const [editStaff, { isLoading: editLoading }] = useEditStaffMutation();
  const [editStaffPassword, { isLoading: editPasswordLoading }] =
    useEditStaffPasswordMutation();
  const [sections, setSections] = useState([]);
  const [form] = Form.useForm();
  const [passwordEditModal, setPasswordEditModal] = useState(false);
  const [passwordEditStaff, setPasswordEditStaff] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const filteredStaff = useMemo(() => {
    return staff.filter(
      (s) =>
        s.first_name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        s.last_name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        s.phone?.toLowerCase().includes(searchQuery?.toLowerCase())
    );
  }, [staff, searchQuery]);

  const allSections = [
    {
      section: "student",
      label: "O'quvchilar",
    },
    {
      section: "teacher",
      label: "O'qituvchilar",
    },
    {
      section: "payment",
      label: "To'lov",
    },
    {
      section: "group",
      label: "Guruh",
    },
    {
      section: "subscription",
      label: "Abonement",
    },
    {
      section: "subject",
      label: "Fanlar",
    },
    {
      section: "expense",
      label: "Xarajat",
    },
    {
      section: "salary",
      label: "Maosh",
    },
  ];
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
          <Tooltip title="Bo'limlarga ruxsati" placement="bottom">
            <Popover
              title="Bo'limlarga ruxsati"
              trigger="click"
              content={
                <Table
                  size="small"
                  pagination={false}
                  dataSource={allSections}
                  columns={[
                    { title: "Bo'lim", dataIndex: "label" },
                    {
                      title: "Ruxsat",
                      dataIndex: "section",
                      render: (r) =>
                        record.sections.includes(r) ? "✅" : "❌",
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
                  phone: record.phone,
                  extra_fields: record.extra_fields,
                });
                setSections(record.sections);
                setEditingStaff(record);
                setFormModal(true);
              }}
              icon={<MdEdit />}
            />
          </Tooltip>
          <Tooltip title="Parolni o'zgartirish" placement="bottom">
            <Button
              onClick={() => {
                setPasswordEditStaff(record);
                setPasswordEditModal(true);
              }}
              icon={<FaKey />}
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
          staff_id: editingStaff?._id,
          sections,
        }).unwrap();
      } else {
        res = await createStaff({
          ...values,
          sections,
        }).unwrap();
      }
      notification.success({ message: res.message, placement: "top" });
      form.resetFields();
      setSections([]);
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
          setSections([]);
          setFormModal(false);
        }}
        title={
          editingStaff?.first_name
            ? `${editingStaff?.last_name} ${editingStaff?.first_name}ni tahrirlash`
            : "Yangi xodim kiritish"
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
            label="Xodim ismi"
            rules={[{ required: true, message: "Kiritish majburiy" }]}
          >
            <Input placeholder="Jasur" />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Xodim familiyasi"
            rules={[{ required: true, message: "Kiritish majburiy" }]}
          >
            <Input placeholder="Mo'minjonov" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Xodim tel raqami"
            rules={[{ required: true, message: "Kiritish majburiy" }]}
          >
            <Input placeholder="+998901234567" />
          </Form.Item>
          {!editingStaff?.first_name && (
            <Form.Item
              name="password"
              label="Xodim paroli"
              rules={[{ required: true, message: "Kiritish majburiy" }]}
            >
              <Input.Password placeholder="* * * * * *" />
            </Form.Item>
          )}
          <Form.Item label="Ruxsat berilgan bo'limlar">
            {allSections.map((s) => (
              <Checkbox
                onChange={() => {
                  sections.includes(s.section)
                    ? setSections(sections.filter((sc) => sc !== s.section))
                    : setSections([...sections, s.section]);
                }}
                checked={sections.includes(s.section)}
              >
                {s.label}
              </Checkbox>
            ))}
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
      <Modal
        footer={[]}
        open={passwordEditModal}
        onCancel={() => {
          setPasswordEditStaff({});
          setPasswordEditModal(false);
        }}
        title={`${passwordEditStaff?.last_name} ${passwordEditStaff?.first_name}ni parolini o'zgartirish`}
      >
        <Form
          onFinish={async (values) => {
            try {
              const res = await editStaffPassword({
                ...values,
                staff_id: passwordEditStaff?._id,
              }).unwrap();
              setPasswordEditStaff({});
              setPasswordEditModal(false);
              notification.success({ message: res.message, placement: "top" });
            } catch (err) {
              console.log(err);
              notification.error({
                message: "request_error",
                description: err.data.message,
                placement: "top",
              });
            }
          }}
          layout="vertical"
        >
          <Form.Item name="password" label="Yangi parol">
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              loading={editPasswordLoading}
              type="primary"
            >
              O'zgartirish
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div className="page-header">
        <p>Xodimlar</p>
        <div className="page-actions">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ism, familiya va tel raqam bo'yicha izlash"
          />
          <button onClick={() => setFormModal(true)}>Yangi xodim</button>
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

export default Staff;

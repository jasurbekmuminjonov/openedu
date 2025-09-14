import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  notification,
  Popover,
  Select,
  Table,
  Tooltip,
} from "antd";
import { useMemo, useState } from "react";
import { FaList, FaXmark } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import {
  useCreateGroupMutation,
  useEditGroupMutation,
  useGetGroupQuery,
} from "../context/services/group.service";
import { useGetSubjectQuery } from "../context/services/subject.service";
import { useGetSubscriptionQuery } from "../context/services/subscription.service";
import { useGetTeacherQuery } from "../context/services/teacher.service";
import { useNavigate } from "react-router-dom";
const Student = () => {
  const { data: staff = [], isLoading: getStaffLoading } = useGetGroupQuery();
  const { data: subjects = [], isLoading: getSubjectLoading } =
    useGetSubjectQuery();
  const { data: teachers = [], isLoading: getTeacherLoading } =
    useGetTeacherQuery();
  const { data: subscriptions = [], isLoading: getSubscriptionLoading } =
    useGetSubscriptionQuery();
  const [editingStaff, setEditingStaff] = useState({});
  const [formModal, setFormModal] = useState(false);
  const [createStaff, { isLoading: createLoading }] = useCreateGroupMutation();
  const [editStaff, { isLoading: editLoading }] = useEditGroupMutation();
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const [days, setDays] = useState([]);
  const navigate = useNavigate();
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      if (!searchQuery) {
        return true;
      }
      s.extra_fields?.some((field) =>
        field.field_value?.toLowerCase().includes(searchQuery?.toLowerCase())
      );
    });
  }, [staff, searchQuery]);

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

  const columns = [
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
          <Tooltip title="Tahrirlash" placement="bottom">
            <Button
              onClick={() => {
                form.setFieldsValue({
                  subscription_id: record.subscription_id._id,
                  subject_id: record.subject_id._id,
                  teacher_id: record.teacher_id._id,
                  extra_fields: record.extra_fields,
                });
                setEditingStaff(record);
                setDays(record.lesson_days);
                setFormModal(true);
              }}
              icon={<MdEdit />}
            />
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

  async function handleSubmit(values) {
    try {
      let res;
      if (editingStaff?.first_name) {
        res = await editStaff({
          ...values,
          group_id: editingStaff?._id,
          lesson_days: days,
        }).unwrap();
      } else {
        res = await createStaff({ ...values, lesson_days: days }).unwrap();
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
          setDays([]);
          setFormModal(false);
        }}
        title={
          editingStaff?.first_name
            ? "Guruhni tahrirlash"
            : "Yangi guruh kiritish"
        }
      >
        <Form
          onFinish={handleSubmit}
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item name="teacher_id" label="O'qituvchi">
            <Select
              placeholder="O'qituvchini tanlang"
              showSearch
              optionFilterProp="label"
            >
              {teachers.map((t) => (
                <Select.Option
                  key={t._id}
                  label={`${t.first_name} ${t.last_name}`}
                  value={t._id}
                  title={`${t.extra_fields.map((f) => f.field_value)}`}
                >
                  {t.first_name} {t.last_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="subject_id" label="Fan">
            <Select
              placeholder="Fanni tanlang"
              showSearch
              optionFilterProp="label"
            >
              {subjects.map((t) => (
                <Select.Option
                  title={`${t.extra_fields.map((f) => f.field_value)}`}
                  key={t._id}
                  label={t.subject_name}
                  value={t._id}
                >
                  {t.subject_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="subscription_id" label="Oylik to'lov">
            <Select
              placeholder="Oylik to'lovni tanlang"
              showSearch
              optionFilterProp="label"
            >
              {subscriptions.map((t) => (
                <Select.Option
                  key={t._id}
                  label={t.subscription_name}
                  value={t._id}
                  title={`${t.extra_fields.map((f) => f.field_value)}`}
                >
                  {t.subscription_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Dars kunlari">
            {allDays.map((s) => (
              <Checkbox
                onChange={() => {
                  days.includes(s.day)
                    ? setDays(days.filter((sc) => sc !== s.day))
                    : setDays([...days, s.day]);
                }}
                checked={days.includes(s.day)}
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
      <div className="page-header">
        <p>Guruhlar</p>
        <div className="page-actions">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="To'liq ism va tel raqam bo'yicha izlash"
          />
          <button onClick={() => setFormModal(true)}>Yangi guruh</button>
        </div>
      </div>
      <div className="page-content">
        <Table
          size="small"
          loading={
            getStaffLoading ||
            getSubjectLoading ||
            getTeacherLoading ||
            getSubscriptionLoading
          }
          dataSource={filteredStaff}
          columns={columns}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Student;

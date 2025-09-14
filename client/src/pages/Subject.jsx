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
import {
  useCreateSubjectMutation,
  useGetSubjectQuery,
} from "../context/services/subject.service";

const Subject = () => {
  const { data: staff = [], isLoading: getStaffLoading } = useGetSubjectQuery();
  const [formModal, setFormModal] = useState(false);
  const [createSubject, { isLoading: createLoading }] =
    useCreateSubjectMutation();
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredStaff = useMemo(() => {
    return staff.filter((s) =>
      s.subject_name?.toLowerCase().includes(searchQuery?.toLowerCase())
    );
  }, [staff, searchQuery]);

  const columns = [
    {
      title: "№",
      render: (_, __, index) => `${index + 1}.`,
    },
    {
      title: "Fan nomi",
      dataIndex: "subject_name",
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
        </div>
      ),
    },
  ];

  async function handleSubmit(values) {
    try {
      const res = await createSubject(values).unwrap();
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
        title={"Yangi fan kiritish"}
      >
        <Form
          onFinish={handleSubmit}
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="subject_name"
            label="Fan nomi"
            rules={[{ required: true, message: "Kiritish majburiy" }]}
          >
            <Input placeholder="Biologiya" />
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
        <p>Fanlar</p>
        <div className="page-actions">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Fan nomi bo'yicha izlash"
          />
          <button onClick={() => setFormModal(true)}>Yangi fan</button>
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

export default Subject;

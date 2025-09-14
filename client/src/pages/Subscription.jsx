import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Popover,
  Table,
  Tooltip,
} from "antd";
import { useMemo, useState } from "react";
import { FaList, FaXmark } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import {
  useCreateSubscriptionMutation,
  useEditSubscriptionMutation,
  useGetSubscriptionQuery,
} from "../context/services/subscription.service";

const Subscription = () => {
  const { data: staff = [], isLoading: getStaffLoading } =
    useGetSubscriptionQuery();
  const [editingStaff, setEditingStaff] = useState({});
  const [formModal, setFormModal] = useState(false);
  const [createStaff, { isLoading: createLoading }] =
    useCreateSubscriptionMutation();
  const [editStaff, { isLoading: editLoading }] = useEditSubscriptionMutation();
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");

  const month = {
    0: "yanvar",
    1: "fevral",
    2: "mart",
    3: "aprel",
    4: "may",
    5: "iyun",
    6: "iyul",
    7: "avgust",
    8: "sentabr",
    9: "oktabr",
    10: "noyabr",
    11: "dekabr",
  };
  const filteredStaff = useMemo(() => {
    return staff.filter(
      (s) =>
        s.subscription_name
          ?.toLowerCase()
          .includes(searchQuery?.toLowerCase()) ||
        s.subscription_amount?.toString().includes(searchQuery) ||
        s.subscription_date?.toString().includes(searchQuery)
    );
  }, [staff, searchQuery]);

  const columns = [
    {
      title: "№",
      render: (_, __, index) => `${index + 1}.`,
    },
    {
      title: "Abonement nomi",
      dataIndex: "subscription_name",
    },
    {
      title: "Abonement summasi",
      dataIndex: "subscription_amount",
      render: (text) => text?.toLocaleString("ru-RU") + " UZS",
    },
    {
      title: "Abonement yechilish oy kuni",
      dataIndex: "subscription_date",
    },
    {
      title: "Oxirgi yechilgan sana",
      render: (_, record) =>
        record.last_charged_year
          ? `${record.last_charged_year}-yil ${record.subscription_date}-${
              month[record.last_charged_month]
            }`
          : "-",
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
                  subscription_name: record.subscription_name,
                  subscription_amount: record.subscription_amount,
                  subscription_date: record.subscription_date,
                  extra_fields: record.extra_fields,
                });
                setEditingStaff(record);
                setFormModal(true);
              }}
              icon={<MdEdit />}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  async function handleSubmit(values) {
    try {
      let res;
      if (editingStaff?.subscription_name) {
        res = await editStaff({
          ...values,
          subscription_id: editingStaff?._id,
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
          editingStaff?.subscription_name
            ? `${editingStaff?.subscription_name} abonementini tahrirlash`
            : "Yangi abonement kiritish"
        }
      >
        <Form
          onFinish={handleSubmit}
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="subscription_name"
            label="Abonement nomi"
            rules={[{ required: true, message: "Kiritish majburiy" }]}
          >
            <Input placeholder="DTM oylik to'lov" />
          </Form.Item>
          <Form.Item
            name="subscription_amount"
            label="Abonement miqdori"
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
              placeholder="500 000"
            />
          </Form.Item>
          <Form.Item
            name="subscription_date"
            label="Abonement yechilish oy kuni"
            rules={[
              { required: true, message: "Kiritish majburiy" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || (value >= 1 && value <= 31)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("1-31 gacha oy kuni tanlang")
                  );
                },
              }),
            ]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="1-31" />
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
        <p>Abonement</p>
        <div className="page-actions">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nomi, summasi va kuni bo'yicha izlash"
          />
          <button onClick={() => setFormModal(true)}>Yangi abonement</button>
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

export default Subscription;

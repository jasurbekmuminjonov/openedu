import { useEffect, useMemo, useState } from "react";
import { useLazyGetStudentByQueryQuery } from "../context/services/student.service";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import {
  Button,
  Checkbox,
  Form,
  InputNumber,
  notification,
  Select,
  Table,
} from "antd";
import { FaMinus } from "react-icons/fa";
import {
  useCreatePaymentMutation,
  useGetPaymentQuery,
} from "../context/services/payment.service";
import { useGetStaffQuery } from "../context/services/staff.service";

const Payment = () => {
  const [
    searchStudent,
    { data: searchStudentData = [], isLoading: searchStudentLoading },
  ] = useLazyGetStudentByQueryQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState([]);
  const { data: payments = [], isLoading: paymentQueryLoading } =
    useGetPaymentQuery();

  const { data: staffData = [] } = useGetStaffQuery();
  const [isExpense, setIsExpense] = useState(false);
  const [createPayment, { isLoading: paymentLoading }] =
    useCreatePaymentMutation();
  useEffect(() => {
    searchStudent({ q: searchQuery });
  }, [searchQuery, searchStudent]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedStaff, setSelectedStaff] = useState(null);

  async function handlePayment(values) {
    try {
      for (const s of selectedStudent) {
        const res = await createPayment({
          student_id: s._id,
          payment_amount: values.payment_amount,
          is_expense: isExpense,
        }).unwrap();
        notification.success({ message: res.message });
      }
      setSearchQuery("");
      setSelectedStudent([]);
    } catch (err) {
      console.log(err);
      notification.error({ message: err.data.message });
    }
  }
  const paymentColumns = [
    {
      title: "№",
      render: (_, __, index) => `${index + 1}.`,
    },
    {
      title: "O'quvchi",
      dataIndex: "student_id",
      render: (text) =>
        `${text.first_name} ${text.last_name} ${text.middle_name}`,
    },
    {
      title: "To'lov summasi",
      dataIndex: "payment_amount",
      render: (text) => text.toLocaleString("ru-RU"),
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
  ];

  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      let pass = true;

      if (dateRange[0] && dateRange[1]) {
        const start = normalizeDate(dateRange[0]);
        const end = normalizeDate(dateRange[1]);
        const current = normalizeDate(p.createdAt);
        pass = pass && current >= start && current <= end;
      }

      if (selectedStaff) {
        pass = pass && p.staff_id?._id === selectedStaff;
      }

      return pass;
    });
  }, [payments, dateRange, selectedStaff]);

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
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      if (selectedStudent.find((f) => f._id === s._id)) {
                        notification.error({
                          message: "student_already_selected",
                        });
                        return;
                      }
                      setSelectedStudent([...selectedStudent, s]);
                    }}
                  >
                    <LiaMoneyBillWaveSolid color="green" size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="container">
        {selectedStudent.map((s) => (
          <div className="box">
            <p>
              {s.first_name} {s.last_name} {s.middle_name}
            </p>
            <button
              onClick={() => {
                setSelectedStudent(
                  selectedStudent.filter((f) => f._id !== s._id)
                );
              }}
              style={{
                background: "transparent",
              }}
            >
              <FaMinus color="red" />
            </button>
          </div>
        ))}
      </div>
      {selectedStudent.length > 0 && (
        <Form
          onFinish={handlePayment}
          layout="vertical"
          style={{
            background: "#fff",
            paddingInline: "10px",
            paddingBlock: "10px",
            borderRadius: "10px",
          }}
        >
          <Form.Item
            name="payment_amount"
            label="To'lov summasi"
            rules={[{ required: true, message: "Kiritish majburiy" }]}
          >
            <InputNumber
              style={{ width: "400px" }}
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
          <Form.Item>
            <Checkbox
              value={isExpense}
              onChange={() => setIsExpense(!isExpense)}
              style={{ maxWidth: "400px" }}
            >
              Ma'lum sabab tufayli balansga pul qaytarilmoqda
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              style={{ marginTop: "10px", width: "400px" }}
              htmlType="submit"
              type="primary"
              loading={paymentLoading}
            >
              Kiritish
            </Button>
          </Form.Item>
        </Form>
      )}
      <p>To'lovlar</p>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          style={{
            height: "40px",
            paddingInline: "10px",
            border: "1px solid #ccc",
          }}
          onChange={(e) => setDateRange([e.target.value || null, dateRange[1]])}
          type="date"
        />
        <p>dan</p>
        <input
          style={{
            height: "40px",
            paddingInline: "10px",
            border: "1px solid #ccc",
          }}
          onChange={(e) => setDateRange([dateRange[0], e.target.value || null])}
          type="date"
        />
        <p>gacha </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Select
          placeholder="Xodim bo'yicha filter"
          value={selectedStaff}
          onChange={setSelectedStaff}
          style={{ width: "300px" }}
          allowClear
        >
          {staffData.map((s) => (
            <Select.Option value={s._id}>
              {s.first_name} {s.last_name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Table
        size="small"
        dataSource={filteredPayments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )}
        summary={(data) => {
          let totalPayment = 0;

          data.forEach(({ payment_amount }) => {
            totalPayment += payment_amount;
          });
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Umumiy</Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                {totalPayment.toLocaleString("ru-RU")}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
        columns={paymentColumns}
        loading={paymentQueryLoading}
      />
    </div>
  );
};

export default Payment;

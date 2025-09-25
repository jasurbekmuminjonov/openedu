import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  notification,
  Tabs,
  Table,
  Checkbox,
} from "antd";
import {
  useCreateExpenseCategoryMutation,
  useCreateExpenseMutation,
  useGetExpenseCategoryQuery,
  useGetExpenseQuery,
} from "../context/services/expense.service";
import ExpensePieChart from "../components/ExpenseChart";

const Expense = () => {
  const { data: expenseCategory = [] } = useGetExpenseCategoryQuery();
  const { data: expense = [] } = useGetExpenseQuery();
  const [activeTab, setActiveTab] = useState("1");
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [createExpenseCategory] = useCreateExpenseCategoryMutation();
  const [createExpense] = useCreateExpenseMutation();

  const [categoryForm] = Form.useForm();
  const [expenseForm] = Form.useForm();
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (expenseCategory.length > 0) {
      setSelectedCategories(expenseCategory.map((ec) => ec._id));
    }
  }, [expenseCategory]);

  const [dateRange, setDateRange] = useState([null, null]);

  const handleCreateCategory = async (values) => {
    try {
      await createExpenseCategory(values).unwrap();
      notification.success({ message: "success" });
      setIsCategoryModalOpen(false);
      categoryForm.resetFields();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateExpense = async (values) => {
    try {
      await createExpense(values).unwrap();
      notification.success({ message: "success" });
      setIsExpenseModalOpen(false);
      expenseForm.resetFields();
    } catch (err) {
      console.log(err);
    }
  };
  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  const filteredExpense = useMemo(() => {
    return expense.filter((p) => {
      let pass = true;

      if (dateRange[0] && dateRange[1]) {
        const start = normalizeDate(dateRange[0]);
        const end = normalizeDate(dateRange[1]);
        const current = normalizeDate(p.createdAt);
        pass = pass && current >= start && current <= end;
      }

      pass = pass && selectedCategories.includes(p.expense_category_id?._id);

      return pass;
    });
  }, [selectedCategories, dateRange, expense]);
  console.log(filteredExpense);

  return (
    <div className="page">
      <Tabs size="small" activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane key="1" tab="Chiqim qo'shish">
          <div className="page-header">
            <p>Chiqimlar</p>
            <div className="page-actions">
              <Button onClick={() => setIsCategoryModalOpen(true)}>
                Kategoriya qo'shish
              </Button>
            </div>
          </div>
          <div className="expense-container">
            {expenseCategory.map((ec) => (
              <div
                style={{ background: ec.color }}
                className="expense"
                key={ec._id}
              >
                <b>{ec.expense_category_name}</b>
                <p>
                  Xarajat summasi:{" "}
                  {(ec.total_expense || 0).toLocaleString("ru-RU")}
                </p>
                <button
                  style={{ color: ec.color }}
                  onClick={() => {
                    setSelectedExpenseCategory(ec._id);
                    setIsExpenseModalOpen(true);
                  }}
                >
                  Chiqim qo'shish
                </button>
              </div>
            ))}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="Chiqimlar">
          <div className="page-header">
            <div className="page-actions">
              <input
                type="date"
                value={dateRange[0] || ""}
                onChange={(e) =>
                  setDateRange([e.target.value || null, dateRange[1]])
                }
              />
              <input
                type="date"
                value={dateRange[1] || ""}
                onChange={(e) =>
                  setDateRange([dateRange[0], e.target.value || null])
                }
              />
            </div>
          </div>
          <div className="checkbox-container">
            <Checkbox
              style={{ background: "#fff" }}
              indeterminate={
                selectedCategories.length > 0 &&
                selectedCategories.length < expenseCategory.length
              }
              checked={selectedCategories.length === expenseCategory.length}
              onChange={(e) =>
                e.target.checked
                  ? setSelectedCategories(expenseCategory.map((ec) => ec._id))
                  : setSelectedCategories([])
              }
            >
              Barchasi
            </Checkbox>

            {expenseCategory.map((c) => (
              <Checkbox
                style={{ background: "#fff" }}
                key={c._id}
                checked={selectedCategories.includes(c._id)}
                onChange={() =>
                  selectedCategories.includes(c._id)
                    ? setSelectedCategories(
                        selectedCategories.filter((s) => s !== c._id)
                      )
                    : setSelectedCategories([...selectedCategories, c._id])
                }
              >
                {c.expense_category_name}
              </Checkbox>
            ))}
          </div>
          <ExpensePieChart expenses={filteredExpense} />
          <Table
            size="small"
            dataSource={filteredExpense.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )}
            columns={[
              {
                title: "№",
                render: (_, __, index) => `${index + 1}.`,
              },
              {
                title: "Kategoriya",
                render: (_, record) =>
                  record.expense_category_id.expense_category_name,
              },
              {
                title: "Chiqim tavsifi",
                dataIndex: "expense_subname",
              },
              {
                title: "Summa",
                dataIndex: "expense_amount",
                render: (text) => text.toLocaleString("ru-RU"),
              },
              {
                title: "Sana",
                dataIndex: "createdAt",
                render: (text) => new Date(text).toLocaleString("ru-RU"),
              },
            ]}
          />
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title="Yangi Kategoriya yaratish"
        open={isCategoryModalOpen}
        onCancel={() => setIsCategoryModalOpen(false)}
        footer={null}
      >
        <Form
          form={categoryForm}
          layout="vertical"
          onFinish={handleCreateCategory}
        >
          <Form.Item
            label="Kategoriya nomi"
            name="expense_category_name"
            rules={[{ required: true, message: "Kiritish majburiy" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Kategoriya rangi"
            name="color"
            rules={[{ required: true, message: "Kiritish majburiy" }]}
          >
            <Input type="color" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Yangi chiqim kiritish"
        open={isExpenseModalOpen}
        onCancel={() => setIsExpenseModalOpen(false)}
        footer={null}
      >
        <Form
          form={expenseForm}
          layout="vertical"
          onFinish={(values) =>
            handleCreateExpense({
              ...values,
              expense_category_id: selectedExpenseCategory,
            })
          }
        >
          <Form.Item label="Chiqim tavsifi (ixtiyoriy)" name="expense_subname">
            <Input />
          </Form.Item>
          <Form.Item
            label="Xarajat summasi"
            name="expense_amount"
            rules={[{ required: true, message: "Summani kiriting" }]}
          >
            <InputNumber
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
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Expense;

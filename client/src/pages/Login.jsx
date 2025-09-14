import { Button, Form, Input, notification, Switch, Typography } from "antd";
import { useState } from "react";
const { Item } = Form;
const { Title } = Typography;
import { FaDoorOpen } from "react-icons/fa";
import { useLoginOrganizationMutation } from "../context/services/organization.service";
import { useLoginStaffMutation } from "../context/services/staff.service";

const Login = () => {
  const [asStaff, setAsStaff] = useState(false);
  const [loginOrg, { isLoading: orgLoading }] = useLoginOrganizationMutation();
  const [loginStaff, { isLoading: staffLoading }] = useLoginStaffMutation();
  return (
    <div className="login">
      <Form
        onFinish={async (values) => {
          try {
            let res;
            if (asStaff) {
              res = await loginStaff(values).unwrap();
              localStorage.setItem("user", JSON.stringify(res.data.staff));
            } else {
              res = await loginOrg(values).unwrap();
              localStorage.setItem("user", JSON.stringify(res.data.org));
            }
            localStorage.setItem("token", res.data.token);
            window.location.href = "/";
          } catch (err) {
            console.log(err);
            notification.error({
              message: "authorization_error",
              description: err.data.message,
              placement: "top",
            });
          }
        }}
        autoComplete="off"
        layout="vertical"
      >
        <Title level={4}>Hisobga kirish</Title>
        <Item
          name="phone"
          label="Telefon"
          rules={[{ required: true, message: "Kiritish majburiy" }]}
        >
          <Input placeholder="+998901234567" />
        </Item>
        <Item
          name="password"
          label="Parol"
          rules={[{ required: true, message: "Kiritish majburiy" }]}
        >
          <Input.Password />
        </Item>
        <Item label="Xodim sifatida kirish">
          <Switch value={asStaff} onChange={setAsStaff} />
        </Item>
        <Item>
          <Button
            style={{ width: "100%" }}
            htmlType="submit"
            icon={<FaDoorOpen />}
            type="primary"
            loading={staffLoading || orgLoading}
          >
            Kirish
          </Button>
        </Item>
      </Form>
    </div>
  );
};

export default Login;

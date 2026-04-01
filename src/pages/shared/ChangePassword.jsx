import React from "react";
import { Button, Divider, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../api/auth";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  async function onFinish(values) {
    try {
      const response = await changePassword(values);

      message.success(response?.data?.message || "Mot de passe modifié avec succès");
      form.resetFields();
      navigate("/profile");
    } catch (error) {
      message.error(error.message || "Erreur lors du changement du mot de passe");
    }
  }

  return (
    <div>
      <h4>Change Password</h4>
      <Divider />

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        style={{ maxWidth: 400 }}
      >
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[
            { required: true, message: "Please enter your current password" },
            { min: 8, message: "Password must be 8 chars minimum" },
            { max: 32, message: "Password must be 32 chars max" },
          ]}
        >
          <Input.Password placeholder="Current password" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: "Please enter your new password" },
            { min: 8, message: "Password must be 8 chars minimum" },
            { max: 32, message: "Password must be 32 chars max" },
          ]}
        >
          <Input.Password placeholder="New password" />
        </Form.Item>

        <Form.Item
          name="confirmNewPassword"
          label="Confirm New Password"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
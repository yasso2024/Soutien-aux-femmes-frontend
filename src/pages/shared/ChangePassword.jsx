import React from "react";
import { App, Button, Divider, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../api/auth";

const ChangePassword = () => {
  const { message } = App.useApp();
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
      <h4>Changer le mot de passe</h4>
      <Divider />

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        style={{ maxWidth: 400 }}
      >
        <Form.Item
          name="currentPassword"
          label="Mot de passe actuel"
          rules={[
            { required: true, message: "Veuillez saisir votre mot de passe actuel" },
            { min: 8, message: "Le mot de passe doit contenir au moins 8 caractères" },
            { max: 32, message: "Le mot de passe doit contenir au maximum 32 caractères" },
          ]}
        >
          <Input.Password placeholder="Mot de passe actuel" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Nouveau mot de passe"
          rules={[
            { required: true, message: "Veuillez saisir votre nouveau mot de passe" },
            { min: 8, message: "Le mot de passe doit contenir au moins 8 caractères" },
            { max: 32, message: "Le mot de passe doit contenir au maximum 32 caractères" },
          ]}
        >
          <Input.Password placeholder="Nouveau mot de passe" />
        </Form.Item>

        <Form.Item
          name="confirmNewPassword"
          label="Confirmer le nouveau mot de passe"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Veuillez confirmer votre nouveau mot de passe" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Les mots de passe ne correspondent pas"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirmer le nouveau mot de passe" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Changer le mot de passe
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
import React, { useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import { createDon } from "../../api/dons";

const { Title, Paragraph } = Typography;

const AddDon = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await createDon(values);
      message.success(response.data?.message || "Don ajouté avec succès.");
      form.resetFields();
      navigate("/donateur/dons");
    } catch (error) {
      message.error(error.message || "Erreur lors de l'ajout du don.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 700, margin: "0 auto", borderRadius: 16 }}>
      <Title level={3}>Ajouter un don</Title>
      <Paragraph type="secondary" style={{ marginTop: -6 }}>
        Faites un don financier ou matériel pour soutenir une demande et aider
        indirectement les bénéficiaires.
      </Paragraph>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Montant"
          name="montant"
          rules={[{ required: true, message: "Le montant est obligatoire." }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Montant du don"
          />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Le type est obligatoire." }]}
        >
          <Select
            placeholder="Choisir un type"
            options={[
              { value: "FINANCIER", label: "Financier" },
              { value: "MATERIEL", label: "Matériel" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} placeholder="Description du don" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Enregistrer
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddDon;
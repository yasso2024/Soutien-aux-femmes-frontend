import React, { useEffect, useState } from "react";
import {
  App as AntApp,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import { createDon } from "../../api/dons";
import { listDemandes } from "../../api/demandes";

const { Title, Paragraph } = Typography;

const AddDon = () => {
  const { message } = AntApp.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [demandes, setDemandes] = useState([]);
  const [demandesLoading, setDemandesLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDemandes() {
      try {
        setDemandesLoading(true);
        const res = await listDemandes();
        const data = Array.isArray(res?.data?.demandes) ? res.data.demandes : [];
        setDemandes(data);
      } catch {
        setDemandes([]);
      } finally {
        setDemandesLoading(false);
      }
    }
    fetchDemandes();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Remove demande if empty string/undefined
      const payload = { ...values };
      if (!payload.demande) delete payload.demande;
      const response = await createDon(payload);
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

        <Form.Item
          label="Demande à financer (optionnel)"
          name="demande"
          tooltip="Sélectionnez une demande validée pour lier votre don à une bénéficiaire spécifique."
        >
          <Select
            placeholder="Choisir une demande (optionnel)"
            allowClear
            showSearch
            optionFilterProp="label"
            notFoundContent={demandesLoading ? <Spin size="small" /> : "Aucune demande validée disponible"}
            options={demandes.map((d) => ({
              value: d._id,
              label: `${d.titre} — ${d.femme?.firstName || ""} ${d.femme?.lastName || ""}`.trim(),
            }))}
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

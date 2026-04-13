import { App, Button, Divider, Form, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { createPropositionAide } from "../../api/propositionsAide";
import { listDemandes } from "../../api/demandes";
import { useEffect, useState } from "react";

function AddPropositionAide() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    async function loadDemandes() {
      try {
        const response = await listDemandes();
        setDemandes(response?.data?.demandes || []);
      } catch {
        setDemandes([]);
      }
    }
    loadDemandes();
  }, []);

  async function onFinish(values) {
    try {
      const response = await createPropositionAide(values);
      message.success(response?.data?.message || "Proposition créée avec succès");
      navigate("/association/propositions-aide");
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la création"
      );
    }
  }

  return (
    <div>
      <h3>Nouvelle proposition d'aide</h3>
      <Divider />

      <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 700 }}>
        <Form.Item
          label="Demande"
          name="demande"
          rules={[{ required: true, message: "Demande obligatoire" }]}
        >
          <Select
            showSearch
            allowClear
            placeholder="Écrire ou choisir une demande"
            optionFilterProp="children"
            filterOption={(input, option) =>
              String(option?.children || "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {demandes.map((d) => (
              <Select.Option key={d._id} value={d._id}>
                {d.titre || d._id}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Description obligatoire" }]}
        >
          <Input.TextArea rows={5} placeholder="Décrivez votre proposition d'aide" />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Créer la proposition
        </Button>
      </Form>
    </div>
  );
}

export default AddPropositionAide;
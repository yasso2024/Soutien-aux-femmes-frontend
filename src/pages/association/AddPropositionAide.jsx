import { App, Button, Divider, Form, Input, Select, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import { createPropositionAide } from "../../api/propositionsAide";
import { listDemandes } from "../../api/demandes";
import { useEffect, useState } from "react";

function AddPropositionAide() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [demandes, setDemandes] = useState([]);
  const [typeProposition, setTypeProposition] = useState("demande_existante");

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
      // Si c'est une proposition pour une demande existante, on garde la demande
      // Si c'est une nouvelle proposition, on ne met pas de demande
      const dataToSend = { ...values };
      if (typeProposition === "nouvelle_proposition") {
        delete dataToSend.demande;
      }

      const response = await createPropositionAide(dataToSend);
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
        <Form.Item label="Type de proposition">
          <Radio.Group
            value={typeProposition}
            onChange={(e) => setTypeProposition(e.target.value)}
          >
            <Radio value="demande_existante">Répondre à une demande existante</Radio>
            <Radio value="nouvelle_proposition">Créer une nouvelle proposition d'aide</Radio>
          </Radio.Group>
        </Form.Item>

        {typeProposition === "demande_existante" && (
          <Form.Item
            label="Demande"
            name="demande"
            rules={[{ required: true, message: "Demande obligatoire" }]}
          >
            <Select
              showSearch
              allowClear
              placeholder="Choisir une demande existante"
              optionFilterProp="children"
              filterOption={(input, option) =>
                String(option?.children || "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {demandes.map((d) => (
                <Select.Option key={d._id} value={d._id}>
                  {d.titre || d.description || d._id}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          label="Description de votre proposition d'aide"
          name="description"
          rules={[{ required: true, message: "Description obligatoire" }]}
        >
          <Input.TextArea
            rows={5}
            placeholder={
              typeProposition === "demande_existante"
                ? "Décrivez comment vous pouvez aider cette personne..."
                : "Décrivez votre proposition d'aide (services, soutien, ressources...)"
            }
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Créer la proposition
        </Button>
      </Form>
    </div>
  );
}

export default AddPropositionAide;
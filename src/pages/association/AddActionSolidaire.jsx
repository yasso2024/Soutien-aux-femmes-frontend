import { App, Button, DatePicker, Divider, Form, Input } from "antd";
import { createActionSolidaire } from "../../api/actionSolidaires";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const AddActionSolidaire = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        dateAction: values.dateAction
          ? values.dateAction.format("YYYY-MM-DD")
          : undefined,
      };

      const response = await createActionSolidaire(payload);
      message.success(response.data?.message || "Action créée avec succès");
      navigate("/association/actions-solidaires");
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la création"
      );
    }
  };

  return (
    <div>
      <h3>Nouvelle action solidaire</h3>
      <Divider />

      <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 600 }}>
        <Form.Item
          label="Titre"
          name="titre"
          rules={[{ required: true, message: "Titre obligatoire" }]}
        >
          <Input placeholder="Titre de l'action" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Description obligatoire" }]}
        >
          <Input.TextArea rows={4} placeholder="Décrivez l'action solidaire" />
        </Form.Item>

        <Form.Item
          label="Date de l'action"
          name="dateAction"
          rules={[{ required: true, message: "Date obligatoire" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            disabledDate={(current) =>
              current && current.startOf("day").isBefore(dayjs().startOf("day"))
            }
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Créer l'action
        </Button>
      </Form>
    </div>
  );
};

export default AddActionSolidaire;
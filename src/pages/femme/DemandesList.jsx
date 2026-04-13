import React, { useContext, useEffect, useState } from "react";
import { Card, Table, Tag, Typography, message, Empty, Spin } from "antd";
import { listDemandes } from "../../api/demandes";
import { AuthContext } from "../../contexts/AuthContext";

const { Title, Paragraph } = Typography;

const STATUS_LABELS = {
  EN_ATTENTE: "En attente",
  VALIDEE: "Validée",
  REFUSEE: "Refusée",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
};

const TYPE_LABELS = {
  FINANCIERE: "Financière",
  MATERIELLE: "Matérielle",
  ACCOMPAGNEMENT: "Accompagnement",
  LOGEMENT: "Logement",
};

const statusColor = {
  EN_ATTENTE: "orange",
  VALIDEE: "green",
  REFUSEE: "red",
};

const typeColor = {
  FINANCIERE: "blue",
  MATERIELLE: "purple",
  ACCOMPAGNEMENT: "geekblue",
  LOGEMENT: "magenta",
};

const DemandesList = () => {
  const [loading, setLoading] = useState(true);
  const [demandes, setDemandes] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const response = await listDemandes(user?._id ? { femme: user._id } : {});
      const data = response?.data?.data || response?.data?.demandes || response?.data || [];
      setDemandes(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error(error.message || "Erreur lors du chargement des demandes");
      setDemandes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDemandes();
    }
  }, [user]);

  const columns = [
    {
      title: "Titre",
      dataIndex: "titre",
      key: "titre",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (value) => (
        <Tag color={typeColor[value] || "default"}>{TYPE_LABELS[value] || value || "-"}</Tag>
      ),
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      render: (value) => (
        <Tag color={statusColor[value] || "default"}>{STATUS_LABELS[value] || value || "-"}</Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (value) => value || "-",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) =>
        value ? new Date(value).toLocaleDateString("fr-FR") : "-",
    },
  ];

  return (
    <Card>
      <Title level={4}>Mes demandes</Title>
      <Paragraph type="secondary" style={{ marginTop: -8 }}>
        Consultez l'état de vos demandes, suivez leur évolution et préparez-vous à
        recevoir des propositions d'aide, des affectations et des notifications.
      </Paragraph>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : demandes.length === 0 ? (
        <Empty description="Aucune demande trouvée. Déposez votre première demande d'aide." />
      ) : (
        <Table
          rowKey={(record) => record._id || record.id}
          dataSource={demandes}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      )}
    </Card>
  );
};

export default DemandesList;
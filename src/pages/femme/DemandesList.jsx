import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Typography, message, Empty, Spin } from "antd";
import { listDemandes } from "../../api/demandes";

const { Title } = Typography;

const statusColor = {
  EN_ATTENTE: "orange",
  VALIDEE: "green",
  REFUSEE: "red",
};

const typeColor = {
  FINANCIERE: "blue",
  MATERIELLE: "purple",
  ACCOMPAGNEMENT: "geekblue",
  MEDICALE: "magenta",
};

const DemandesList = () => {
  const [loading, setLoading] = useState(true);
  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const response = await listDemandes();
      const data = response?.data?.data || response?.data?.demandes || response?.data || [];
      setDemandes(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error(error.message || "Erreur lors du chargement des demandes");
      setDemandes([]);
    } finally {
      setLoading(false);
    }
  };

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
        <Tag color={typeColor[value] || "default"}>{value || "-"}</Tag>
      ),
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      render: (value) => (
        <Tag color={statusColor[value] || "default"}>{value || "-"}</Tag>
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

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : demandes.length === 0 ? (
        <Empty description="Aucune demande trouvée" />
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
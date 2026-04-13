import React, { useEffect, useState } from "react";
import { Card, Table, Typography, Tag, message, Empty, Spin } from "antd";
import { listDons } from "../../api/dons";

const { Title, Paragraph } = Typography;

const DonsList = () => {
  const [loading, setLoading] = useState(true);
  const [dons, setDons] = useState([]);

  useEffect(() => {
    fetchDons();
  }, []);

  const fetchDons = async () => {
    try {
      setLoading(true);
      const response = await listDons();
      const data = response?.data?.dons || response?.data?.data || response?.data || [];
      setDons(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error(error.message || "Erreur lors du chargement des dons");
      setDons([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Montant / Don",
      key: "montant",
      render: (_, record) =>
        record.type === "MATERIEL"
          ? record.description || "Don matériel"
          : `${record.montant || 0} TND`,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (value) => (
        <Tag color={value === "FINANCIER" ? "green" : "blue"}>{value || "-"}</Tag>
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
      <Title level={4}>Mes dons</Title>
      <Paragraph type="secondary" style={{ marginTop: -8 }}>
        Acteur financier ou matériel, vous soutenez les demandes, financez les besoins
        et aidez indirectement les bénéficiaires.
      </Paragraph>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : dons.length === 0 ? (
        <Empty description="Aucun don trouvé" />
      ) : (
        <Table
          rowKey={(record) => record._id || record.id}
          dataSource={dons}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      )}
    </Card>
  );
};

export default DonsList;
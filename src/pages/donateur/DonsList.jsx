import React, { useEffect, useState } from "react";
import {
  App,
  Card,
  Table,
  Typography,
  Tag,
  Empty,
  Spin,
  Button,
  Modal,
  Select,
  Tooltip,
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { listDons, updateDon } from "../../api/dons";
import { listDemandes } from "../../api/demandes";

const { Title, Paragraph, Text } = Typography;
const GOLD = "#F59E0B";

const DonsList = () => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [dons, setDons] = useState([]);

  // Link modal state
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linking, setLinking] = useState(false);
  const [selectedDon, setSelectedDon] = useState(null);
  const [demandes, setDemandes] = useState([]);
  const [demandesLoading, setDemandesLoading] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);

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

  const openLinkModal = async (don) => {
    setSelectedDon(don);
    setSelectedDemande(null);
    setLinkModalOpen(true);
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
  };

  const handleLink = async () => {
    if (!selectedDemande) {
      message.warning("Veuillez sélectionner une demande.");
      return;
    }
    try {
      setLinking(true);
      await updateDon(selectedDon._id || selectedDon.id, { demande: selectedDemande });
      message.success("Don lié à la demande avec succès !");
      setLinkModalOpen(false);
      fetchDons();
    } catch (err) {
      message.error(err?.message || "Erreur lors de la liaison.");
    } finally {
      setLinking(false);
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
      title: "Demande liée",
      key: "demande",
      render: (_, record) =>
        record.demande ? (
          <Text strong style={{ color: GOLD, fontSize: 13 }}>
            {record.demande?.titre || "Demande liée"}
          </Text>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>
            Don général
          </Text>
        ),
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      render: (value) => {
        const config = {
          CONFIRME:   { color: "success", label: "Confirmé" },
          EN_ATTENTE: { color: "warning", label: "En attente" },
          REFUSE:     { color: "error",   label: "Refusé" },
        };
        const { color, label } = config[value] || { color: "default", label: value || "En attente" };
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) =>
        value ? new Date(value).toLocaleDateString("fr-FR") : "-",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        !record.demande ? (
          <Tooltip title="Lier ce don à une demande pour qu'il compte dans vos statistiques">
            <Button
              size="small"
              icon={<LinkOutlined />}
              onClick={() => openLinkModal(record)}
              style={{ borderColor: GOLD, color: GOLD }}
            >
              Lier à une demande
            </Button>
          </Tooltip>
        ) : (
          <Tag color="gold" style={{ fontSize: 11 }}>Lié</Tag>
        ),
    },
  ];

  return (
    <>
      <Card>
        <Title level={4}>Mes dons</Title>
        <Paragraph type="secondary" style={{ marginTop: -8 }}>
          Les dons liés à une demande comptent dans vos statistiques (femmes aidées,
          propositions liées). Utilisez le bouton{" "}
          <Text strong style={{ color: GOLD }}>Lier à une demande</Text> pour connecter
          vos dons généraux existants.
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
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      {/* Link modal */}
      <Modal
        title="Lier ce don à une demande"
        open={linkModalOpen}
        onCancel={() => setLinkModalOpen(false)}
        onOk={handleLink}
        okText="Lier"
        cancelText="Annuler"
        confirmLoading={linking}
        okButtonProps={{ style: { background: GOLD, borderColor: GOLD } }}
        destroyOnHidden
      >
        <Paragraph type="secondary" style={{ marginBottom: 16 }}>
          Sélectionnez une demande validée à financer. Cela mettra à jour vos
          statistiques (femmes aidées, propositions liées).
        </Paragraph>
        <Select
          style={{ width: "100%" }}
          placeholder="Choisir une demande validée"
          showSearch
          optionFilterProp="label"
          loading={demandesLoading}
          value={selectedDemande}
          onChange={setSelectedDemande}
          notFoundContent={
            demandesLoading ? (
              <Spin size="small" />
            ) : (
              "Aucune demande validée disponible"
            )
          }
          options={demandes.map((d) => ({
            value: d._id,
            label: `${d.titre} — ${d.femme?.firstName || ""} ${d.femme?.lastName || ""}`.trim(),
          }))}
        />
      </Modal>
    </>
  );
};

export default DonsList;

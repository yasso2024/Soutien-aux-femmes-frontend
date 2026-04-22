import React, { useContext, useEffect, useState } from "react";
import { App, Card, Button, Tag, Modal, Empty, Spin, Typography, Avatar, Divider } from "antd";
import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { listAffectations } from "../../api/affectations";

const { Title, Text } = Typography;
const PINK = "#EC7FA7";

const STATUS_COLORS = {
  EN_ATTENTE: "orange",
  ACCEPTEE: "blue",
  REFUSEE: "red",
  TERMINEE: "green",
};

const STATUS_LABELS = {
  EN_ATTENTE: "En attente",
  ACCEPTEE: "Acceptée",
  REFUSEE: "Refusée",
  TERMINEE: "Terminée",
};

export default function AffectationsListFemme() {
  const { message } = App.useApp();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [affectations, setAffectations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAffectation, setSelectedAffectation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadAffectations();
  }, [user]);

  const loadAffectations = async () => {
    try {
      setLoading(true);
      const response = await listAffectations();
      const allAffectations = Array.isArray(response?.data?.affectations)
        ? response.data.affectations
        : Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response)
        ? response
        : [];

      // Backend already filters by femme's demandes for FEMME MALADE role
      setAffectations(allAffectations);
    } catch (error) {
      message.error("Erreur lors du chargement des affectations");
      setAffectations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (affectation) => {
    setSelectedAffectation(affectation);
    setIsModalVisible(true);
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case "ACCEPTEE":
        return <CheckCircleOutlined style={{ color: "#22c55e", marginRight: 8 }} />;
      case "EN_ATTENTE":
        return <ClockCircleOutlined style={{ color: "#f59e0b", marginRight: 8 }} />;
      case "REFUSEE":
        return <CloseCircleOutlined style={{ color: "#ef4444", marginRight: 8 }} />;
      case "TERMINEE":
        return <CheckCircleOutlined style={{ color: "#0ea5e9", marginRight: 8 }} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: "20px 0" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/femme/dashboard")}
          style={{ marginRight: 16 }}
        >
          Retour
        </Button>
        <Title level={3} style={{ margin: 0 }}>
          Mes affectations
        </Title>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      ) : affectations.length === 0 ? (
        <Card>
          <Empty
            description="Aucune affectation pour le moment"
            style={{ margin: "40px 0" }}
          >
            <Button type="primary" onClick={() => navigate("/femme/dashboard")}>
              Retour au tableau de bord
            </Button>
          </Empty>
        </Card>
      ) : (
        <div>
          {affectations.map((affectation) => (
            <Card
              key={affectation._id || affectation.id}
              style={{ marginBottom: 16, cursor: "pointer" }}
              hoverable
              onClick={() => handleViewDetails(affectation)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  {/* En-tête avec statut */}
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                    {getStatutIcon(affectation?.statut)}
                    <Title level={5} style={{ margin: 0, flex: 1 }}>
                      {affectation?.action?.titre || affectation?.demande?.titre || "Affectation"}
                    </Title>
                    <Tag color={STATUS_COLORS[affectation?.statut] || "default"}>
                      {STATUS_LABELS[affectation?.statut] || affectation?.statut}
                    </Tag>
                  </div>

                  {/* Description de l'action */}
                  {affectation?.action?.description && (
                    <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
                      {affectation.action.description.substring(0, 100)}...
                    </Text>
                  )}

                  {/* Informations du bénévole */}
                  {affectation?.benevole && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <Avatar
                        icon={<UserOutlined />}
                        style={{ background: PINK }}
                      />
                      <div>
                        <Text strong>
                          {affectation.benevole.firstName} {affectation.benevole.lastName}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {affectation.benevole.role}
                        </Text>
                      </div>
                    </div>
                  )}

                  {/* Type d'aide et date */}
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {affectation?.typeAide && (
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Type d'aide:
                        </Text>
                        <br />
                        <Tag style={{ marginTop: 4 }}>
                          {affectation.typeAide.replace("_", " ")}
                        </Tag>
                      </div>
                    )}
                    {affectation?.dateAffectation && (
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Date:
                        </Text>
                        <br />
                        <Text style={{ marginTop: 4, display: "block" }}>
                          {new Date(affectation.dateAffectation).toLocaleDateString("fr-FR")}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de détails */}
      <Modal
        title="Détails de l'affectation"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedAffectation && (
          <div>
            {/* Statut */}
            <div style={{ marginBottom: 20 }}>
              <Text strong>Statut:</Text>
              <br />
              <Tag
                color={STATUS_COLORS[selectedAffectation?.statut] || "default"}
                style={{ marginTop: 8 }}
              >
                {STATUS_LABELS[selectedAffectation?.statut] || selectedAffectation?.statut}
              </Tag>
            </div>

            <Divider />

            {/* Action/Demande */}
            <div style={{ marginBottom: 20 }}>
              <Text strong>Action/Projet:</Text>
              <br />
              <Title level={5} style={{ marginTop: 8 }}>
                {selectedAffectation?.action?.titre || selectedAffectation?.demande?.titre}
              </Title>
              <Text type="secondary">
                {selectedAffectation?.action?.description ||
                  selectedAffectation?.demande?.description}
              </Text>
            </div>

            <Divider />

            {/* Bénévole */}
            {selectedAffectation?.benevole && (
              <div style={{ marginBottom: 20 }}>
                <Text strong>Bénévole responsable:</Text>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 8,
                    padding: "12px",
                    background: "#f5f5f5",
                    borderRadius: 8,
                  }}
                >
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ background: PINK }}
                    size={40}
                  />
                  <div>
                    <Text strong>
                      {selectedAffectation.benevole.firstName} {selectedAffectation.benevole.lastName}
                    </Text>
                    <br />
                    <Text type="secondary">Email: {selectedAffectation.benevole.email}</Text>
                    {selectedAffectation.benevole.telephone && (
                      <>
                        <br />
                        <Text type="secondary">
                          Téléphone: {selectedAffectation.benevole.telephone}
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <Divider />

            {/* Type d'aide */}
            {selectedAffectation?.typeAide && (
              <div style={{ marginBottom: 20 }}>
                <Text strong>Type d'aide:</Text>
                <br />
                <Tag style={{ marginTop: 8 }}>
                  {selectedAffectation.typeAide.replace("_", " ")}
                </Tag>
              </div>
            )}

            {/* Dates */}
            <div style={{ marginBottom: 20 }}>
              <Text strong>Date d'affectation:</Text>
              <br />
              <Text style={{ marginTop: 4, display: "block" }}>
                {selectedAffectation?.dateAffectation
                  ? new Date(selectedAffectation.dateAffectation).toLocaleDateString(
                      "fr-FR",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "-"}
              </Text>
            </div>

            {/* Notes */}
            {selectedAffectation?.notesAffectation && (
              <div>
                <Text strong>Notes:</Text>
                <br />
                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    marginTop: 8,
                    padding: "12px",
                    background: "#f5f5f5",
                    borderRadius: 8,
                  }}
                >
                  {selectedAffectation.notesAffectation}
                </Text>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

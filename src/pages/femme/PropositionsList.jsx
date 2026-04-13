import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { AuthContext } from '../../contexts/AuthContext';
import { changePropositionAideStatus, listPropositionsAide, deletePropositionAide } from '../../api/propositionsAide';
import { listDemandes } from '../../api/demandes';

const TEAL = '#0F9488';
const TEAL_LIGHT = '#E1F5EE';
const TEAL_DARK = '#085041';

const statutConfig = {
  PROPOSEE: { label: 'Proposée', bg: '#FFF7ED', color: '#92400E', dot: '#F59E0B' },
  ACCEPTEE: { label: 'Acceptée', bg: '#F0FDF4', color: '#14532D', dot: '#22C55E' },
  REFUSEE: { label: 'Refusée', bg: '#FEF2F2', color: '#991B1B', dot: '#EF4444' },
};

const FILTERS = ['Toutes', 'PROPOSEE', 'ACCEPTEE', 'REFUSEE'];
const FILTER_LABELS = { Toutes: 'Toutes', PROPOSEE: 'Proposées', ACCEPTEE: 'Acceptées', REFUSEE: 'Refusées' };

const styles = {
  page: {
    fontFamily: "'Sora', system-ui, sans-serif",
    minHeight: '100vh',
    padding: '32px 0',
    color: '#1a1a1a',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 28,
    gap: 16,
    flexWrap: 'wrap',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: TEAL,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  addBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: TEAL,
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '11px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  filterRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterChip: (active) => ({
    padding: '6px 16px',
    borderRadius: 99,
    border: active ? `1.5px solid ${TEAL}` : '1.5px solid #e2e8f0',
    background: active ? TEAL_LIGHT : '#fff',
    color: active ? TEAL_DARK : '#64748b',
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    transition: 'all 0.15s',
  }),
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 16,
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #f1f5f9',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  cardAccent: (statut) => ({
    height: 4,
    background: statutConfig[statut]?.dot || TEAL,
  }),
  cardBody: {
    padding: '20px 20px 16px',
    flex: 1,
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  statutPill: (statut) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '3px 10px',
    borderRadius: 99,
    background: statutConfig[statut]?.bg || '#f1f5f9',
    color: statutConfig[statut]?.color || '#475569',
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  }),
  statutDot: (statut) => ({
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: statutConfig[statut]?.dot || '#94a3b8',
    flexShrink: 0,
  }),
  description: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 1.6,
    margin: '0 0 12px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#475569',
    marginTop: 6,
  },
  divider: { height: 1, background: '#f1f5f9' },
  cardFooter: {
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  personInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  femmeLabel: { fontSize: 12, color: '#94a3b8' },
  femmeName: { fontSize: 13, fontWeight: 600, color: '#334155' },
  actionRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  acceptBtn: {
    padding: '6px 14px',
    borderRadius: 8,
    background: '#F0FDF4',
    color: '#166534',
    border: '1px solid #BBF7D0',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  refuseBtn: {
    padding: '6px 14px',
    borderRadius: 8,
    background: '#FEF2F2',
    color: '#B91C1C',
    border: '1px solid #FECACA',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '6px 14px',
    borderRadius: 8,
    background: '#FEF2F2',
    color: '#DC2626',
    border: '1px solid #FECACA',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#94a3b8',
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 600, color: '#64748b', margin: '0 0 8px' },
  emptyText: { fontSize: 14, margin: 0 },
  loadingWrap: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 16,
  },
  skeleton: {
    background: '#f8fafc',
    borderRadius: 16,
    height: 200,
    animation: 'pulse 1.5s ease-in-out infinite',
  },
};

function LinkIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14" stroke="#94a3b8" strokeWidth="1.5" style={{ flexShrink: 0 }}>
      <path d="M6 8a3 3 0 0 0 4.243 0l2-2a3 3 0 0 0-4.244-4.243l-1 1" />
      <path d="M10 8a3 3 0 0 0-4.243 0l-2 2a3 3 0 0 0 4.244 4.243l1-1" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2">
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(15,20,40,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50, borderRadius: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 14, padding: '24px 28px',
        maxWidth: 280, width: '90%',
      }}>
        <p style={{ margin: '0 0 20px', fontSize: 15, color: '#0f172a', lineHeight: 1.5 }}>
          Supprimer cette proposition d'aide définitivement ?
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ ...styles.deleteBtn, background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>
            Annuler
          </button>
          <button onClick={onConfirm} style={styles.deleteBtn}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

const uploadsBaseUrl = `${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/`;

function PropositionCard({ item, user, onDelete, onChangeStatus, updatingStatus }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const statut = item.statut || 'PROPOSEE';
  const cfg = statutConfig[statut] || statutConfig.PROPOSEE;

  const demandeLabel = item.demande
    ? item.demande.titre || 'Demande liée'
    : '—';

  const femmeName = item.demande?.femme
    ? `${item.demande.femme.firstName || ''} ${item.demande.femme.lastName || ''}`.trim() || '—'
    : '—';

  const associationName = item.association
    ? item.association.nomOrganisation || `${item.association.firstName || ''} ${item.association.lastName || ''}`.trim() || '—'
    : '—';

  const isFemme = user?.role === 'FEMME MALADE';
  const footerLabel = isFemme ? 'Association' : 'Femme concernée';
  const footerName = isFemme ? associationName : femmeName;
  const footerAvatar = isFemme ? item.association?.avatar : item.demande?.femme?.avatar;
  const canRespond = isFemme && statut === 'PROPOSEE';

  return (
    <div
      style={{
        ...styles.card,
        boxShadow: hover ? '0 6px 24px rgba(15,148,136,0.12)' : styles.card.boxShadow,
        transform: hover ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={styles.cardAccent(statut)} />
      <div style={styles.cardBody}>
        <div style={styles.cardTop}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Proposition d'aide</span>
          <span style={styles.statutPill(statut)}>
            <span style={styles.statutDot(statut)} />
            {cfg.label}
          </span>
        </div>
        <p style={styles.description}>{item.description || '—'}</p>
        {item.demande && (
          <div style={styles.metaRow}>
            <LinkIcon />
            <span style={{ color: '#64748b', fontSize: 12 }}>
              Demande : <strong style={{ color: '#0f172a' }}>{demandeLabel}</strong>
            </span>
          </div>
        )}
      </div>
      <div style={styles.divider} />
      <div style={styles.cardFooter}>
        <div style={styles.personInfo}>
          <Avatar
            src={footerAvatar ? `${uploadsBaseUrl}${footerAvatar}` : undefined}
            icon={!footerAvatar && <UserOutlined />}
            size={40}
            style={{ flexShrink: 0 }}
          />
          <div style={styles.femmeLabel}>Femme concernée</div>
          <div>
            <div style={styles.femmeLabel}>{footerLabel}</div>
            <div style={styles.femmeName}>{footerName}</div>
          </div>
        </div>
        <div style={styles.actionRow}>
          {canRespond && (
            <>
              <button
                style={styles.acceptBtn}
                onClick={() => onChangeStatus(item._id, 'ACCEPTEE')}
                disabled={updatingStatus}
              >
                Accepter
              </button>
              <button
                style={styles.refuseBtn}
                onClick={() => onChangeStatus(item._id, 'REFUSEE')}
                disabled={updatingStatus}
              >
                Refuser
              </button>
            </>
          )}
          {(user?.role === 'ASSOCIATION' || user?.role === 'ADMINISTRATEUR') && (
            <button style={styles.deleteBtn} onClick={() => setConfirmOpen(true)}>
              Supprimer
            </button>
          )}
        </div>
      </div>
      {confirmOpen && (
        <ConfirmDialog
          onConfirm={() => { setConfirmOpen(false); onDelete(item._id); }}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}

export default function PropositionsAideList() {
  const [propositions, setPropositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Toutes');
  const [refresh, setRefresh] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [demandesResponse, propositionsResponse] = await Promise.all([
          listDemandes(user?._id ? { femme: user._id } : {}),
          listPropositionsAide(),
        ]);

        const demandes = Array.isArray(demandesResponse?.data?.demandes)
          ? demandesResponse.data.demandes
          : [];

        const demandeIds = new Set(
          demandes
            .map((demande) => (demande?._id || demande?.id || '').toString())
            .filter(Boolean)
        );

        const propositions = Array.isArray(propositionsResponse?.data?.propositions)
          ? propositionsResponse.data.propositions
          : [];

        setPropositions(
          propositions.filter((proposition) => {
            const demandeId = (proposition?.demande?._id || proposition?.demande || '').toString();
            return demandeIds.has(demandeId);
          })
        );
      } catch (error) {
        console.error(error.message || 'Erreur lors du chargement');
        setPropositions([]);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchData();
    }
  }, [refresh, user]);

  const handleDelete = async (id) => {
    try {
      await deletePropositionAide(id);
      setRefresh(prev => !prev);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleChangeStatus = async (id, statut) => {
    try {
      setUpdatingId(id);
      await changePropositionAideStatus(id, statut);
      message.success(statut === 'ACCEPTEE' ? 'Proposition acceptée' : 'Proposition refusée');
      setRefresh((prev) => !prev);
    } catch (error) {
      message.error(error.message || 'Erreur lors du changement de statut');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === 'Toutes'
    ? propositions
    : propositions.filter(p => (p.statut || 'PROPOSEE') === filter);

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>Aide & soutien</div>
          <h1 style={styles.title}>Propositions d'aide reçues</h1>
          <p style={styles.subtitle}>
            Après le dépôt de votre demande et sa validation, l'association peut proposer une aide.
            Vous recevez alors une proposition liée à votre demande que vous pouvez accepter ou refuser.
            {' '}{propositions.length} proposition{propositions.length !== 1 ? 's' : ''} au total.
          </p>
        </div>
        {(user?.role === 'ASSOCIATION' || user?.role === 'ADMINISTRATEUR') && (
          <button style={styles.addBtn} onClick={() => navigate('/association/add-proposition-aide')}>
            <PlusIcon /> Nouvelle proposition
          </button>
        )}
      </div>

      <div style={styles.filterRow}>
        {FILTERS.map(f => (
          <button key={f} style={styles.filterChip(filter === f)} onClick={() => setFilter(f)}>
            {FILTER_LABELS[f]}
            {f !== 'Toutes' && (
              <span style={{ marginLeft: 5, opacity: 0.7 }}>
                ({propositions.filter(p => (p.statut || 'PROPOSEE') === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.loadingWrap}>
          {[1, 2, 3].map(i => <div key={i} style={styles.skeleton} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🤝</div>
          <h3 style={styles.emptyTitle}>Aucune proposition trouvée</h3>
          <p style={styles.emptyText}>
            {filter === 'Toutes'
              ? "Une proposition d'aide apparaîtra ici après validation de votre demande, puis vous pourrez l'accepter ou la refuser."
              : `Aucune proposition avec le statut « ${FILTER_LABELS[filter]} ».`}
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map(item => (
            <PropositionCard
              key={item._id}
              item={item}
              user={user}
              onDelete={handleDelete}
              onChangeStatus={handleChangeStatus}
              updatingStatus={updatingId === item._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

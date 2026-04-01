import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { listPropositionsAide, deletePropositionAide } from '../../api/propositionsAide';

const TEAL = '#0F9488';
const TEAL_LIGHT = '#E1F5EE';
const TEAL_DARK = '#085041';

const statutConfig = {
  EN_ATTENTE: { label: 'En attente', bg: '#FFF7ED', color: '#92400E', dot: '#F59E0B' },
  ACCEPTEE:   { label: 'Acceptée',   bg: '#F0FDF4', color: '#14532D', dot: '#22C55E' },
  REFUSEE:    { label: 'Refusée',    bg: '#FEF2F2', color: '#991B1B', dot: '#EF4444' },
};

const FILTERS = ['Toutes', 'EN_ATTENTE', 'ACCEPTEE', 'REFUSEE'];
const FILTER_LABELS = { Toutes: 'Toutes', EN_ATTENTE: 'En attente', ACCEPTEE: 'Acceptées', REFUSEE: 'Refusées' };

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
  },
  femmeInfo: {},
  femmeLabel: { fontSize: 12, color: '#94a3b8' },
  femmeName: { fontSize: 13, fontWeight: 600, color: '#334155' },
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

function PropositionCard({ item, user, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const statut = item.statut || 'EN_ATTENTE';
  const cfg = statutConfig[statut] || statutConfig.EN_ATTENTE;

  const demandeLabel = item.demande
    ? item.demande.titre || 'Demande liée'
    : '—';

  const femmeName = item.demande?.femme
    ? `${item.demande.femme.firstName || ''} ${item.demande.femme.lastName || ''}`.trim() || '—'
    : '—';

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
        <div style={styles.femmeInfo}>
          <div style={styles.femmeLabel}>Femme concernée</div>
          <div style={styles.femmeName}>{femmeName}</div>
        </div>
        {(user?.role === 'ASSOCIATION' || user?.role === 'ADMINISTRATEUR') && (
          <button style={styles.deleteBtn} onClick={() => setConfirmOpen(true)}>
            Supprimer
          </button>
        )}
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
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await listPropositionsAide();
        setPropositions(response.data.propositions);
      } catch (error) {
        console.error(error.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      await deletePropositionAide(id);
      setRefresh(prev => !prev);
    } catch (error) {
      console.error(error.message);
    }
  };

  const filtered = filter === 'Toutes'
    ? propositions
    : propositions.filter(p => (p.statut || 'EN_ATTENTE') === filter);

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>Aide & soutien</div>
          <h1 style={styles.title}>Propositions d'aide</h1>
          <p style={styles.subtitle}>{propositions.length} proposition{propositions.length !== 1 ? 's' : ''} au total</p>
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
                ({propositions.filter(p => (p.statut || 'EN_ATTENTE') === f).length})
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
              ? "Aucune proposition d'aide pour le moment."
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { Badge, Button, Card, Tag, Typography } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const typeColors = {
  Sensibilisation: 'pink',
  Collecte: 'green',
  Formation: 'blue',
  Accompagnement: 'purple',
  default: 'default'
};

const EventCard = ({ event }) => {
  return (
    <Card
      hoverable
      style={{
        borderRadius: 16,
        border: '1px solid #f7d7e5',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(247, 7, 139, 0.08)'
      }}
      styles={{ body: { padding: 24 } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <Tag color={typeColors[event.type] || typeColors.default}>
          {event.type}
        </Tag>
      </div>

      <Title level={5} style={{ marginBottom: 8, color: '#1f1f1f' }}>
        {event.title}
      </Title>

      <Paragraph
        style={{ color: '#666', fontSize: 13, marginBottom: 16 }}
        ellipsis={{ rows: 2 }}
      >
        {event.description}
      </Paragraph>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarOutlined style={{ color: '#f7078b', fontSize: 13 }} />
          <Text style={{ fontSize: 13 }}>{event.date}</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <EnvironmentOutlined style={{ color: '#f7078b', fontSize: 13 }} />
          <Text style={{ fontSize: 13 }}>{event.location}</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TeamOutlined style={{ color: '#f7078b', fontSize: 13 }} />
          <Text style={{ fontSize: 13 }}>{event.organizer}</Text>
        </div>
      </div>

      <Button
        type="primary"
        block
        style={{
          borderRadius: 8,
          background: 'linear-gradient(135deg, #f7078b 0%, #d81b60 100%)',
          border: 'none'
        }}
      >
        Voir les détails
      </Button>
    </Card>
  );
};

export default EventCard;

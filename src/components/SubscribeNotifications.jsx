import React, { useEffect, useState } from 'react';
import { Button, notification, Space } from 'antd';
import { BellOutlined } from '@ant-design/icons';

export default function SubscribeNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      const OS = window.OneSignal;
      if (!OS) return;

      try {
        const perm = OS.Notifications?.permissionNative;
        const subscribed = OS.User?.PushSubscription?.optedIn;
        setPermission(perm);
        setIsSubscribed(subscribed || false);
      } catch (err) {
        console.warn('Error checking OneSignal status:', err);
      }
    };

    // Check immediately
    checkSubscription();

    // Also check when OneSignal is ready
    if (window.OneSignalDeferred) {
      window.OneSignalDeferred.push(checkSubscription);
    }
  }, []);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const OS = window.OneSignal;
      if (!OS) {
        notification.error({
          message: 'Erreur',
          description: 'OneSignal n\'est pas chargé.'
        });
        return;
      }

      // Request permission (shows browser popup)
      const granted = await OS.Notifications.requestPermission();

      if (granted) {
        // Opt in to push notifications
        await OS.User.PushSubscription.optIn();
        setIsSubscribed(true);

        notification.success({
          message: 'Abonné !',
          description: 'Vous recevrez désormais des notifications push.'
        });
      } else {
        notification.warning({
          message: 'Permission refusée',
          description: 'Vous ne recevrez pas de notifications push.'
        });
      }
    } catch (err) {
      console.error('Erreur lors de l\'abonnement:', err);
      notification.error({
        message: 'Erreur',
        description: 'Impossible de s\'abonner aux notifications.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Don't show anything if already subscribed or permission denied
  if (isSubscribed || permission === 'denied') {
    return null;
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <Space>
        <BellOutlined />
        <span>Recevoir des notifications push en temps réel</span>
        <Button
          type="primary"
          size="small"
          loading={loading}
          onClick={handleSubscribe}
        >
          S'abonner
        </Button>
      </Space>
    </div>
  );
}
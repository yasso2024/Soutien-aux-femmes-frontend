// MainLayout.jsx
import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import ChatBot from "../components/chatbot/ChatBot";
import SubscribeNotifications from "../components/SubscribeNotifications";

const { Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f7f8fc" }}>
      <Content style={{ padding: 24 }}>
        <SubscribeNotifications />
        <Outlet />
      </Content>
      <ChatBot />
    </Layout>
  );
};

export default MainLayout;
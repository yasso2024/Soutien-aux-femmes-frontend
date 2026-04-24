import { Button, Col, Divider, Form, Input, message, Row } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../api/auth";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    async function onFinish(values) {
        try {
            const response = await resetPassword(token, values);

            message.success(response?.data?.message || "Mot de passe réinitialisé avec succès.");

            navigate("/login");
        } catch (error) {
            message.error(error.message || "Une erreur est survenue.");
        }
    };
    return (
        <div style={{ minHeight: "100vh", width: "100%" }}>
            <Row justify="center" align='middle' style={{ height: "100vh" }}>
                <Col span={6} style={{ borderRadius: "13px", backgroundColor: "#FAFAFA", padding: 24, boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                    <Divider>
                        oublier le mot de passe
                    </Divider>
                    <Form
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="Nauveau mot de passe"
                            name='newPassword'
                            rules={[
                                { required: true, message: "Password is required" },
                                { min: 8, message: "Password must be 8 chars mininum" }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label=" Confirmer le nouveau mot de passe"
                            name='confirmNewPassword'
                            rules={[
                                { required: true, message: "Confirm Password is required" },
                                { min: 8, message: "Confirm Password must be 8 chars mininum" }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <div style={{ display: "flex", flexDirection: 'column', gap: 14 }}>
                            <Button type="primary" htmlType="submit">
                               Envoyer
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default ResetPassword;
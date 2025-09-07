import { Html, Head, Font, Preview, Row, Section, Text, Button } from "@react-email/components";

interface VVerify {
    username: string;
    otp: string;
}

export default function VVerify({ username, otp }: VVerify) {
    return (
        <Html>
            <Head>
                <title>Verify Your Account</title>
                <Font
                    fontFamily="Poppins"
                    fallbackFontFamily="sans-serif"
                    webFont={{
                        url: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap",
                        format: "woff2",
                    }}
                    fontWeight={"400"}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Verify Your Account</Preview>
            <Section style={{ backgroundColor: "#ffffff", padding: "32px 0" }}>
                <Row style={{ padding: "0 32px" }}>
                    <Text
                        style={{
                            fontFamily: "Inter",
                            fontSize: "32px",
                            fontWeight: "700",
                            color: "#000000",
                        }}
                    >
                        Verify Your Account
                    </Text>
                </Row>
                <Row style={{ padding: "0 32px" }}>
                    <Text
                        style={{
                            fontFamily: "Inter",
                            fontSize: "16px",
                            fontWeight: "400",
                            color: "#000000",
                        }}
                    >
                        Hi {username}, click the button below to verify your account
                    </Text>
                </Row>
                <Row style={{ padding: "0 32px" }}>
                    <Button
                        style={{
                            backgroundColor: "#000000",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#ffffff",
                            textDecoration: "none",
                        }}
                        href={`http://localhost:3000/verify/${otp}`}
                    >
                        Verify
                    </Button>
                </Row>
            </Section>
        </Html>
    );
}
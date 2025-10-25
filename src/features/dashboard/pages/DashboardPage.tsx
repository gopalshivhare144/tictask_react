import { Box, Card, CardContent, Typography, Chip, Paper } from "@mui/material";
import { useAuth } from "../../../shared/hooks/useAuth";
import Layout from "../../../shared/components/Layout";
import { logger } from "../../../shared/utils/logger";

export default function DashboardPage() {
  const { user, token } = useAuth();

  // Decode token payload for display (simplified)
  const getTokenPayload = (token: string) => {
    try {
      const parts = token.split(".");
      if (parts.length >= 2) {
        return JSON.parse(atob(parts[1]));
      }
      return null;
    } catch (error) {
      logger.error("Failed to decode token:", error);
      return null;
    }
  };

  const tokenPayload = token ? getTokenPayload(token) : null;

  return (
    <Layout>
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 4 }}>
          Dashboard
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Welcome, {user?.email}!
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    User ID:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user?.id}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Email:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user?.email}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Role:
                  </Typography>
                  <Chip label={user?.roles} color="primary" size="small" />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Status:
                  </Typography>
                  <Chip label="Authenticated" color="success" size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {tokenPayload && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  JWT Token Information
                </Typography>

                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: "action.hover",
                    maxHeight: 300,
                    overflow: "auto",
                  }}
                >
                  <pre style={{ margin: 0, fontSize: "12px" }}>
                    {JSON.stringify(tokenPayload, null, 2)}
                  </pre>
                </Paper>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 2, display: "block" }}
                >
                  Token is automatically attached to all API requests via Axios
                  interceptor
                </Typography>
              </CardContent>
            </Card>
          )}

          <Card sx={{ bgcolor: "success.lighter" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 1, color: "success.dark", fontWeight: 600 }}
              >
                🎉 Authentication Successful!
              </Typography>
              <Typography variant="body2" color="success.dark">
                You are now logged in and can access protected routes. Your JWT
                token is securely stored and will be automatically included in
                all API requests.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Layout>
  );
}

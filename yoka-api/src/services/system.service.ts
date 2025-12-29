export const getSystemHealth = () => {
  // Business Logic จริงๆ จะอยู่ที่นี่ (เช่น เช็ค DB connection)
  return {
    status: "UP",
    timestamp: new Date(),
    uptime: process.uptime(),
  };
};

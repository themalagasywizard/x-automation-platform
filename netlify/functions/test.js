// Test function without dependencies
exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from test function" })
  };
}; 
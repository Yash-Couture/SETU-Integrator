const axios = require("axios");

// Configure the API base URL and authentication headers
const baseURL = "https://fiu-uat.setu.co"; // Replace with the actual API base URL
const client_id = "CLIENT_ID_FROM_ENV";
const client_secret = "CLIENT_SECRET_FROM_ENV";

const headers = {
  "Content-Type": "application/json",
  "x-client-id": client_id,
  "x-client-secret": client_secret,
};

// Create a consent
async function createConsent() {
  const consentData = JSON.stringify({
    Detail: {
      consentStart: "2023-06-04T08:59:34.487Z",
      consentExpiry: "2023-08-23T05:44:53.822Z",
      Customer: {
        id: "7505130880@onemoney",
      },
      FIDataRange: {
        from: "2021-04-01T00:00:00Z",
        to: "2021-10-01T00:00:00Z",
      },
      consentMode: "STORE",
      consentTypes: ["TRANSACTIONS", "PROFILE", "SUMMARY"],
      fetchType: "PERIODIC",
      Frequency: {
        value: 30,
        unit: "MONTH",
      },
      DataFilter: [
        {
          type: "TRANSACTIONAMOUNT",
          value: "5000",
          operator: ">=",
        },
      ],
      DataLife: {
        value: 1,
        unit: "MONTH",
      },
      DataConsumer: {
        id: "setu-fiu-id",
      },
      Purpose: {
        Category: {
          type: "string",
        },
        code: "101",
        text: "Loan underwriting",
        refUri: "https://api.rebit.org.in/aa/purpose/101.xml",
      },
      fiTypes: ["DEPOSIT"],
    },
    context: [
      {
        key: "accounttype",
        value: "CURRENT",
      },
    ],
    redirectUrl: "https://setu.co",
  });

  try {
    const response = await axios.post(`${baseURL}/consents`, consentData, {
      headers,
    });
    console.log(response.data);
    const consentId = response.data.id;
    console.log("Consent created:", consentId);

    // Approve the consent
    await approveConsent(consentId);
  } catch (error) {
    console.log(error);
    console.error("Failed to create consent:", error.response.data);
  }
}

// Approve a consent
async function approveConsent(consentId) {
  try {
    const response = await axios.post(
      `${baseURL}/consents/webview/${consentId}`,
      null,
      { headers }
    );
    console.log("Consent approved:", response.data);

    // Proceed to create a data session
    createDataSession(consentId);
  } catch (error) {
    console.error("Failed to approve consent:", error.response.data);
  }
}

// Call the createConsent function to start the process
createConsent();

async function createDataSession(consentId) {
  const dataSessionData = JSON.stringify({
    consentId: consentId,
    DataRange: {
      from: "2021-04-01T00:00:00Z",
      to: "2021-09-30T00:00:00Z",
    },
    format: "json",
  });

  try {
    const response = await axios.post(`${baseURL}/sessions`, dataSessionData, {
      headers,
    });
    const sessionId = response.data.id;
    console.log("Data session created:", sessionId);

    // Fetch sample data using the created data session
    fetchSampleData(sessionId);
  } catch (error) {
    console.error("Failed to create data session:", error.response.data);
  }
}

async function fetchSampleData(sessionId) {
  try {
    const response = await axios.get(`${baseURL}/sessions/${sessionId}`, {
      headers,
    });
    const sampleData = response.data;
    console.log("Sample data:", sampleData);
  } catch (error) {
    console.error("Failed to fetch sample data:", error.response.data);
  }
}

const { ensureSessionId } = require('../../lib/server/cookies');
const { getAccessTokenForSession } = require('../../lib/server/delegatedAuth');

/**
 * POST /api/partner-center/create-gdap-request
 * 
 * Creates a new GDAP (Granular Delegated Admin Privileges) relationship request.
 * This sends an invitation to the customer that they must approve.
 * 
 * Request body:
 * {
 *   customerTenantId: string,     // The customer's Azure AD tenant ID
 *   displayName: string,          // Friendly name for the relationship
 *   duration: string,             // ISO 8601 duration, e.g., "P730D" (730 days / 2 years)
 *   roles: string[],              // Array of Azure AD role definition IDs
 *   autoExtendDuration?: string   // Optional: "P180D" to auto-extend
 * }
 * 
 * Returns:
 * {
 *   ok: boolean,
 *   relationship: { id, displayName, status, customerApprovalUrl },
 *   error?: string
 * }
 */
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ 
      ok: false, 
      error: 'Method not allowed',
      relationship: null,
      timestamp: new Date().toISOString() 
    });
    return;
  }

  try {
    const body = req.body || {};
    const { customerTenantId, displayName, duration, roles, autoExtendDuration } = body;

    // Validate required fields
    if (!customerTenantId) {
      res.status(400).json({
        ok: false,
        error: 'Missing required field: customerTenantId',
        relationship: null,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!displayName) {
      res.status(400).json({
        ok: false,
        error: 'Missing required field: displayName',
        relationship: null,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      res.status(400).json({
        ok: false,
        error: 'Missing required field: roles (must be a non-empty array of role IDs)',
        relationship: null,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Get the delegated access token (requires GDAP scope)
    const sessionId = ensureSessionId(req, res);
    const token = await getAccessTokenForSession(sessionId, 'gdap');

    if (!token) {
      res.status(401).json({
        ok: false,
        error: 'Not authenticated. Please connect to Partner Center with GDAP permissions first.',
        relationship: null,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Build the GDAP relationship request payload
    // See: https://learn.microsoft.com/en-us/graph/api/tenantrelationship-post-delegatedadminrelationships
    const gdapPayload = {
      displayName,
      duration: duration || 'P730D', // Default to 2 years
      customer: {
        tenantId: customerTenantId,
      },
      accessDetails: {
        unifiedRoles: roles.map((roleId) => ({
          roleDefinitionId: roleId,
        })),
      },
    };

    // Add auto-extend if specified
    if (autoExtendDuration) {
      gdapPayload.autoExtendDuration = autoExtendDuration;
    }

    // Create the GDAP relationship via Microsoft Graph API
    const graphUrl = 'https://graph.microsoft.com/v1.0/tenantRelationships/delegatedAdminRelationships';
    
    const resp = await fetch(graphUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(gdapPayload),
    });

    const text = await resp.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }

    const ok = resp.status >= 200 && resp.status < 300;

    if (!ok) {
      res.status(resp.status).json({
        ok: false,
        error: `Failed to create GDAP relationship (HTTP ${resp.status}): ${data?.error?.message || 'Unknown error'}`,
        relationship: null,
        debug: { response: data },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Extract the relationship details
    const relationshipId = data?.id;
    const status = data?.status;

    // Construct the customer approval URL
    // The customer clicks this link in their admin center to approve the GDAP request
    const customerApprovalUrl = relationshipId
      ? `https://admin.microsoft.com/AdminPortal/Home#/partners/granularadminrelationships/${encodeURIComponent(relationshipId)}`
      : null;

    res.status(201).json({
      ok: true,
      relationship: {
        id: relationshipId,
        displayName: data?.displayName,
        status,
        duration: data?.duration,
        createdDateTime: data?.createdDateTime,
        endDateTime: data?.endDateTime,
        customerApprovalUrl,
        // Include the activation link that the partner uses after customer approves
        activationUrl: relationshipId
          ? `https://graph.microsoft.com/v1.0/tenantRelationships/delegatedAdminRelationships/${encodeURIComponent(relationshipId)}/requests`
          : null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: (e && e.message) || 'Failed to create GDAP relationship',
      relationship: null,
      timestamp: new Date().toISOString(),
    });
  }
};

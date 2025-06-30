import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardHeader, CardContent } from '../components/layout/Card';
import { Section } from '../components/layout/Section';
import { SettingItem } from '../components/layout/SettingItem';
import { Toggle } from '../components/form/Toggle';
import { Button } from '../components/form/Button';
import { Modal } from '../components/misc/Modal';

// --- Main Settings Page ---
export const ComponentLibrary = () => {
  // State for toggles
  const [companySync, setCompanySync] = useState(true);
  const [tenantLinking, setTenantLinking] = useState(true);
  const [syncTool, setSyncTool] = useState(false);
  const [userSync, setUserSync] = useState(false);
  const [inviteMsUsers, setInviteMsUsers] = useState(false);
  const [forceMsReset, setForceMsReset] = useState(false);
  const [graphSync, setGraphSync] = useState(false);
  const [googleUserSync, setGoogleUserSync] = useState(false);

  // Modal state
  const [modal, setModal] = useState<{
    open: boolean;
    message: string;
    onConfirm: (() => void) | null;
  }>({ open: false, message: '', onConfirm: null });

  // --- Handlers for main toggles with modal logic ---
  const handleCompanySyncToggle = (enabled: boolean) => {
    if (!enabled && (tenantLinking || companySync)) {
      setModal({
        open: true,
        message:
          'Disabling Company Sync will reset all related settings. Do you want to continue?',
        onConfirm: () => {
          setCompanySync(false);
          setTenantLinking(false);
          setModal({ open: false, message: '', onConfirm: null });
        },
      });
    } else {
      setCompanySync(enabled);
      if (enabled) setTenantLinking(true);
      else setTenantLinking(false);
    }
  };

  const handleTenantLinkingToggle = (enabled: boolean) => {
    // Only allow enabling if Company Sync is enabled
    if (companySync) setTenantLinking(enabled);
  };

  const handleUserSyncToggle = (enabled: boolean) => {
    setUserSync(enabled);
    if (!enabled) {
      setInviteMsUsers(false);
      setForceMsReset(false);
      setGraphSync(false);
    }
  };

  const handleSyncToolToggle = (enabled: boolean) => {
    setSyncTool(enabled);
  };

  const handleGoogleUserSyncToggle = (enabled: boolean) => {
    setGoogleUserSync(enabled);
  };

  // --- Modal close/cancel ---
  const closeModal = () => setModal({ open: false, message: '', onConfirm: null });

  // --- Save handler (stub) ---
  const handleSave = () => {
    // Save logic here
    alert('Settings saved!');
  };

  return (
    <PageLayout title="Sync Settings">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Sync Settings</h2>
        <Button variant="primary" onClick={handleSave}>
          Save All Settings
        </Button>
      </div>
      {/* Marketplace Wide Settings */}
      <Section title="Marketplace Wide Settings">
        <Card>
          <CardHeader>Company Settings</CardHeader>
          <CardContent>
            <SettingItem
              title="Company Sync"
              description="When enabled Company Sync will discover companies that don't exist on the marketplace and sync them into the marketplace based on the below settings."
            >
              <div className="flex items-center space-x-2">
                <Toggle enabled={companySync} onChange={handleCompanySyncToggle} />
                <span className={`text-xs font-semibold px-2 py-1 rounded ${companySync ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {companySync ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
            </SettingItem>
          </CardContent>
        </Card>
      </Section>
      {/* Microsoft Settings */}
      <Section title="Microsoft Settings">
        <Card>
          <CardHeader>Tenant Linking</CardHeader>
          <CardContent>
            <SettingItem
              title="Tenant Linking"
              description="When enabled, the Marketplace will allow tenant linking, by sending customers a Reseller Relationship link within an email notification. NOTE: Requires Company Sync to be enabled."
            >
              <div className="flex items-center space-x-2">
                <Toggle enabled={tenantLinking} onChange={handleTenantLinkingToggle} />
                <span className={`text-xs font-semibold px-2 py-1 rounded ${tenantLinking ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {tenantLinking ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
            </SettingItem>
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardHeader>Sync Tool</CardHeader>
          <CardContent>
            <SettingItem
              title="Sync Tool"
              description="Enable or disable the Microsoft Sync Tool."
            >
              <div className="flex items-center space-x-2">
                <Toggle enabled={syncTool} onChange={handleSyncToolToggle} />
                <span className={`text-xs font-semibold px-2 py-1 rounded ${syncTool ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {syncTool ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
            </SettingItem>
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardHeader>User Sync</CardHeader>
          <CardContent>
            <SettingItem
              title="User Sync"
              description="When enabled User Sync will sync user information from the Microsoft Online Portal to the marketplace. It will create new users if required on the marketplace."
            >
              <div className="flex items-center space-x-2">
                <Toggle enabled={userSync} onChange={handleUserSyncToggle} />
                <span className={`text-xs font-semibold px-2 py-1 rounded ${userSync ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {userSync ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
            </SettingItem>
            {/* Sub-toggles for User Sync */}
            {userSync && (
              <div className="ml-6 mt-4 space-y-2">
                <SettingItem
                  title="Enable invitation of Microsoft synced users"
                  description="This setting enables a Company Administrator to invite Microsoft synced external users to the marketplace."
                >
                  <Toggle enabled={inviteMsUsers} onChange={setInviteMsUsers} />
                </SettingItem>
                <SettingItem
                  title="Force Microsoft User to reset on first login"
                  description="By enabling this setting end users assigned to Office 365 will be required to change their password on the first login. This setting doesn't impact admins which must always reset their password on first login."
                >
                  <Toggle enabled={forceMsReset} onChange={setForceMsReset} />
                </SettingItem>
                <SettingItem
                  title="Enable Graph Sync v2"
                  description="Resolve any discrepancies in domains, user accounts and user entitlements that may occur through any actions taken within the Microsoft Portal OR issues migrated from existing platforms."
                >
                  <Toggle enabled={graphSync} onChange={setGraphSync} />
                </SettingItem>
              </div>
            )}
          </CardContent>
        </Card>
      </Section>
      {/* Google Settings */}
      <Section title="Google Settings">
        <Card>
          <CardHeader>Google User Sync</CardHeader>
          <CardContent>
            <SettingItem
              title="Google User Sync"
              description="Enable or disable Google User Sync."
            >
              <div className="flex items-center space-x-2">
                <Toggle enabled={googleUserSync} onChange={handleGoogleUserSyncToggle} />
                <span className={`text-xs font-semibold px-2 py-1 rounded ${googleUserSync ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {googleUserSync ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
            </SettingItem>
          </CardContent>
        </Card>
      </Section>
      {/* Modal for confirmations */}
      <Modal
        open={modal.open}
        title="Are you sure?"
        message={modal.message}
        onCancel={closeModal}
        onConfirm={() => {
          if (modal.onConfirm) modal.onConfirm();
        }}
      />
    </PageLayout>
  );
}; 
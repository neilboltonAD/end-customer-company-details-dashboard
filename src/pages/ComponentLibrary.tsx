import React, { Component } from 'react'
import { PageLayout } from '../components/layout/PageLayout'
import { Card, CardHeader, CardContent } from '../components/layout/Card'
import { Section } from '../components/layout/Section'
import { SettingItem } from '../components/layout/SettingItem'
import { Toggle } from '../components/form/Toggle'
import { RadioButton } from '../components/form/RadioButton'
import { Button } from '../components/form/Button'
import { Text } from '../components/typography/Text'
// Settings content
const SyncSettingsContent = () => {
  return (
    <div className="space-y-6">
      <Section title="Sync Settings">
        <Card>
          <CardHeader>COMPANY SYNC SETTINGS</CardHeader>
          <CardContent>
            <SettingItem
              title="Company Sync"
              description="When enabled Company Sync will discover companies that don't exist on the marketplace and sync them into the marketplace based on the below settings."
            >
              <Toggle enabled={true} />
            </SettingItem>
            <div className="ml-6 mt-4">
              <Text variant="body" className="font-medium mb-2">
                Company Creation
              </Text>
              <div className="space-y-2">
                <RadioButton
                  id="manual"
                  name="creation"
                  checked={true}
                  label="Create companies manually"
                  description="View companies that must be manually created at Manage > Marketplace > Pending Companies."
                />
                <RadioButton
                  id="auto"
                  name="creation"
                  label="Create companies automatically"
                  description="The marketplace creates a company when a new company is created through a third-party developer such as Microsoft."
                />
              </div>
            </div>
            <SettingItem
              title="Microsoft Tenant Porting"
              description="Automate the Microsoft tenant porting process."
            >
              <Toggle enabled={true} />
            </SettingItem>
            <SettingItem
              title="Invite admins when companies are created"
              description="If enabled, the marketplace invites the administrator as the company is created."
            >
              <Toggle enabled={false} />
            </SettingItem>
            <SettingItem
              title="Sales Support can manage pending companies"
              description="If enabled, users with the Sales Support role (SSR) can view and manage pending companies."
            >
              <Toggle enabled={false} />
            </SettingItem>
            <div className="mt-4">
              <Button variant="primary">Save</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardHeader>USER SYNC SETTINGS</CardHeader>
          <CardContent>
            <SettingItem
              title="Microsoft User Sync"
              description="When enabled User Sync will sync user information from the Microsoft Online Portal to the marketplace. It will create new users if required on the marketplace."
            >
              <Toggle enabled={true} />
            </SettingItem>
            <SettingItem
              title="Enable invitation of Microsoft synced users"
              description="This setting enables a Company Administrator to invite Microsoft synced external users to the marketplace."
            >
              <Toggle enabled={false} />
            </SettingItem>
            <div className="mt-4">
              <Button variant="primary">Save</Button>
            </div>
          </CardContent>
        </Card>
      </Section>
    </div>
  )
}
export const ComponentLibrary = () => {
  return (
    <PageLayout title="Sync Settings">
      <SyncSettingsContent />
    </PageLayout>
  )
} 
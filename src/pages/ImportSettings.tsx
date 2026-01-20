import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CatalogLayout } from '../components/layout/CatalogLayout';
import { Badge, Card, DataTable, Inline, NumberInput, Select, Stack, Text, Title, Button } from 'components/DesignSystem';

// Distributor settings type
interface DistributorSettings {
  id: string;
  name: string;
  markupPercentage: number;
}

const defaultDistributorSettings: DistributorSettings[] = [
  { id: 'firstbase', name: 'Firstbase', markupPercentage: 12 },
  { id: 'tdsynnex', name: 'TD SYNNEX', markupPercentage: 15 },
  { id: 'ingrammicro', name: 'Ingram Micro', markupPercentage: 18 },
  { id: 'microsoftmarketplace', name: 'Microsoft Marketplace', markupPercentage: 20 },
];

export const ImportSettings = () => {
  const navigate = useNavigate();
  const [selectedDistributor, setSelectedDistributor] = useState('tdsynnex');
  const [distributorSettings, setDistributorSettings] = useState<DistributorSettings[]>(
    defaultDistributorSettings
  );
  const [hasChanges, setHasChanges] = useState(false);

  const currentSettings = distributorSettings.find(d => d.id === selectedDistributor);

  const handleMarkupChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setDistributorSettings(prev =>
      prev.map(d =>
        d.id === selectedDistributor
          ? { ...d, markupPercentage: Math.min(100, Math.max(0, numValue)) }
          : d
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    setHasChanges(false);
    alert(`Settings saved for ${currentSettings?.name}!\nMarkup: ${currentSettings?.markupPercentage}%`);
  };

  const handleReset = () => {
    const defaultSetting = defaultDistributorSettings.find(d => d.id === selectedDistributor);
    if (defaultSetting) {
      setDistributorSettings(prev =>
        prev.map(d =>
          d.id === selectedDistributor
            ? { ...d, markupPercentage: defaultSetting.markupPercentage }
            : d
        )
      );
      setHasChanges(false);
    }
  };

  return (
    <CatalogLayout>
      <main>
        <Stack gap="lg">
          <div>
            <Title order={2} fw={600}>
              Settings
            </Title>
            <Text c="dimmed" size="sm">
              Select a distributor to view or edit settings. Changes will apply to future imports for the distributor and company.
            </Text>
          </div>

          {/* Distributor Selector */}
          <Card>
            <Select
              label="Distributor"
              data={distributorSettings.map((d) => ({ value: d.id, label: d.name }))}
              value={selectedDistributor}
              onChange={(v) => {
                setSelectedDistributor(v || 'tdsynnex');
                setHasChanges(false);
              }}
              selectProps={{ required: true }}
            />
          </Card>

          {/* Divider */}
          <div />

          {/* Markup Fee Section */}
          <Card>
            <Stack gap="sm">
              <div>
                <Title order={4}>Markup Fee</Title>
                <Text c="dimmed" size="sm">
                  A markup fee applies to the products selected for publishing.
                </Text>
              </div>

              <Inline align="flex-end">
                <NumberInput
                  label="Markup fee for physical products (%)"
                  min={0}
                  max={100}
                  value={currentSettings?.markupPercentage || 0}
                  onChange={(v) => handleMarkupChange(String(v ?? 0))}
                  clampBehavior="strict"
                  w={220}
                />
                <Inline gap="xs">
                  <Button variant="primary" onClick={handleSave}>
                    Save
                  </Button>
                  <Button variant="default" onClick={handleReset} disabled={!hasChanges}>
                    Reset
                  </Button>
                </Inline>
              </Inline>
            </Stack>
          </Card>

          <Card>
            <Stack gap="sm">
              <div>
                <Title order={4}>All Distributor Markups</Title>
                <Text c="dimmed" size="sm">
                  Quick overview of markup percentages for all configured distributors.
                </Text>
              </div>

              <DataTable
                data={distributorSettings.map((dist) => {
                  const defaultMarkup = defaultDistributorSettings.find((d) => d.id === dist.id)?.markupPercentage;
                  const isModified = dist.markupPercentage !== defaultMarkup;
                  return {
                    ...dist,
                    status: isModified ? 'Modified' : 'Default',
                  };
                })}
                columns={[
                  {
                    accessorKey: 'name',
                    header: 'Distributor',
                    enableSorting: true,
                    cell: (row) => (
                      <Inline gap="xs">
                        <Text fw={600} size="sm">
                          {row.name}
                        </Text>
                        {row.id === selectedDistributor && (
                          <Badge color="info" variant="outline">
                            Selected
                          </Badge>
                        )}
                      </Inline>
                    ),
                  },
                  {
                    accessorKey: 'markupPercentage',
                    header: 'Markup %',
                    enableSorting: true,
                    align: 'right',
                    cell: (row) => (
                      <Text size="sm" c="dimmed">
                        {row.markupPercentage}%
                      </Text>
                    ),
                  },
                  {
                    accessorKey: 'status',
                    header: 'Status',
                    enableSorting: true,
                    cell: (row) => (
                      <Badge color={row.status === 'Modified' ? 'pending' : 'success'} variant="outline">
                        {row.status}
                      </Badge>
                    ),
                  },
                ]}
                minWidth={700}
                showSearch
                searchPlaceholder="Search distributors…"
                onRowClick={(row) => {
                  setSelectedDistributor(row.id);
                  setHasChanges(false);
                }}
              />
            </Stack>
          </Card>
        </Stack>
      </main>
    </CatalogLayout>
  );
};


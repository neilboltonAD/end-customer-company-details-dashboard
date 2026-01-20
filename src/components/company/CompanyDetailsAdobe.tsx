import React from 'react';
import { ExpandableSection } from '../layout/ExpandableSection';
import { Button, Card, DataTable, Grid, Inline, Stack, Text, Title } from 'components/DesignSystem';
import type { DataTableColumn } from 'components/DesignSystem';

const adobeLogo = '/adobelogo.png';

export const CompanyDetailsAdobe = () => {
  type AdminRow = { name: string; email: string; phone: string };

  const admins: AdminRow[] = [
    { name: 'asdasd asdasd', email: 'asd@as.com', phone: '2133423456' },
  ];

  const adminColumns: DataTableColumn<AdminRow>[] = [
    { accessorKey: 'name', header: 'Administrator name', enableSorting: true },
    { accessorKey: 'email', header: 'Email ID', enableSorting: true },
    { accessorKey: 'phone', header: 'Phone number', enableSorting: true },
  ];

  return (
    <Stack gap="sm" style={{ marginBottom: 24 }}>
      <Title order={4}>Adobe</Title>

      <ExpandableSection
        title="Adobe"
        sectionId="adobe-main"
        helpContent="Adobe Creative Cloud and Document Cloud services provide access to creative tools, document management, and digital media solutions. This section displays your Adobe subscription details and program status."
      >
        {/* Company Information */}
        <ExpandableSection
          title="Company Information"
          sectionId="adobe-company-info"
          helpContent="Company Information displays your organization's details as registered with Adobe, including contact information, billing details, and account status. This information is used for licensing and support purposes."
        >
          <Stack gap="md">
            <Inline gap="md" align="center" wrap="nowrap">
              <img src={adobeLogo} alt="Adobe Logo" style={{ width: 48, height: 48, borderRadius: 8 }} />
              <div>
                <Text fw={800}>ABD CA</Text>
                <Text size="xs" c="dimmed" ff="monospace">
                  P1005228634
                </Text>
              </div>
            </Inline>

            <Card>
              <Grid cols={{ base: 1, sm: 2 }} spacing="lg">
                <div>
                  <Text fw={700}>Address</Text>
                  <Text size="sm" c="dimmed">
                    asdasd asdasd
                    <br />
                    50 Grove St
                    <br />
                    Somerville, MA 02144
                    <br />
                    US
                  </Text>
                </div>
                <div>
                  <Text fw={700}>Discount Levels</Text>
                  <Text size="xs" c="dimmed">
                    Licenses
                  </Text>
                  <Text size="sm" fw={700} style={{ marginBottom: 8 }}>
                    Level 01
                  </Text>
                  <Text size="xs" c="dimmed">
                    Consumables
                  </Text>
                  <Text size="sm" fw={700}>
                    -
                  </Text>
                </div>
                <div>
                  <Text fw={700}>Preferred Language</Text>
                  <Text size="sm" fw={700}>
                    English (US)
                  </Text>
                </div>
                <div>
                  <Text fw={700}>Anniversary Date</Text>
                  <Text size="sm" fw={700}>
                    07/02/26
                  </Text>
                </div>
                <div>
                  <Text fw={700}>Market Segment</Text>
                  <Text size="sm" fw={700}>
                    Commercial
                  </Text>
                </div>
                <div>
                  <Text fw={700}>Global Customer</Text>
                  <Text size="sm" fw={700}>
                    No
                  </Text>
                </div>
              </Grid>
            </Card>

            <Card>
              <DataTable data={admins} columns={adminColumns} showSearch={false} minWidth={0} />
            </Card>
          </Stack>
        </ExpandableSection>

        {/* VIP Program Status */}
        <ExpandableSection
          title="VIP Program Status"
          sectionId="adobe-vip-status"
          helpContent="The Adobe VIP (Value Incentive Plan) program provides volume licensing options for organizations. This section shows your current VIP status, available benefits, and program eligibility requirements."
        >
          <Stack gap="sm">
            <Card>
              <Inline justify="space-between" align="center" wrap="nowrap">
                <div>
                  <Text fw={700}>3-Year Commit (3YC)</Text>
                  <Text size="xs" c="dimmed">
                    Find out more
                  </Text>
                </div>
                <Button variant="outline">Apply for 3YC</Button>
              </Inline>
            </Card>

            <Card>
              <Inline justify="space-between" align="center" wrap="nowrap">
                <div>
                  <Text fw={700}>High Growth Offers (HGO)</Text>
                  <Text size="xs" c="dimmed">
                    Find out more
                  </Text>
                  <Text size="xs" c="dimmed" style={{ marginTop: 4 }}>
                    3YC is required before making a purchase.
                  </Text>
                </div>
                <Button variant="outline">Check Eligible Offers</Button>
              </Inline>
            </Card>

            <Card>
              <Inline justify="space-between" align="center" wrap="nowrap">
                <div>
                  <Text fw={700}>Linked Membership</Text>
                  <Text size="xs" c="dimmed">
                    Find out more
                  </Text>
                </div>
                <Button variant="outline">Apply for Linked Membership</Button>
              </Inline>
            </Card>
          </Stack>
        </ExpandableSection>

        {/* Update & Schedule New Products at Renewal */}
        <ExpandableSection
          title="Update & Schedule New Products at Renewal"
          sectionId="adobe-renewal-products"
          helpContent="This section allows you to manage product updates and schedule new Adobe products to be added to your subscription at renewal time. This helps ensure you have access to the latest tools and features."
        >
          <Stack gap="sm">
            <Card>
              <Inline justify="space-between" align="center" wrap="nowrap">
                <div>
                  <Text fw={700}>Update Adobe renewal quantity</Text>
                  <Text size="xs" c="dimmed">
                    Find out more
                  </Text>
                </div>
                <Button variant="outline">List Adobe Products</Button>
              </Inline>
            </Card>

            <Card>
              <Inline justify="space-between" align="center" wrap="nowrap">
                <div>
                  <Text fw={700}>Add new Adobe products at renewal</Text>
                  <Text size="xs" c="dimmed">
                    Find out more
                  </Text>
                </div>
                <Button variant="outline">Add New Products</Button>
              </Inline>
            </Card>
          </Stack>
        </ExpandableSection>
      </ExpandableSection>
    </Stack>
  );
};
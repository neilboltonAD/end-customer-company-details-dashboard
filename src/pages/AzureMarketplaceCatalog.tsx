import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  Select,
  Button,
  Group,
  Stack,
  Badge,
  Alert,
  Box,
  ThemeIcon,
  Breadcrumbs,
  Anchor,
  Loader,
  Card,
  Grid,
  SimpleGrid,
  Modal,
  Table,
  Divider,
  ActionIcon,
  Tooltip,
  Tabs,
  SegmentedControl,
  NumberInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  ArrowLeft,
  Search,
  Package,
  Filter,
  ExternalLink,
  ShoppingCart,
  Check,
  AlertCircle,
  Info,
  Building2,
  Cloud,
  RefreshCw,
  Eye,
  ChevronRight,
  DollarSign,
  Calendar,
  Layers,
  CreditCard,
} from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';
import {
  listMarketplaceCatalogProducts,
  ProductSummary,
  PlanSummary,
  PRODUCT_TYPES,
  PRICING_TYPES,
  CSP_STATES,
  AUTHORIZED_SUBSCRIPTION_ID,
} from '../api/azureMarketplaceCatalog';

// ============================================================================
// Order/Subscription Tracking Types
// ============================================================================

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  planId: string;
  planName: string;
  publisherName: string;
  quantity: number;
  pricingType: string;
  status: 'pending' | 'provisioning' | 'active' | 'failed' | 'cancelled';
  createdAt: string;
  billingCycle?: 'monthly' | 'annual' | 'usage-based';
  estimatedMonthlyPrice?: number;
  customerId?: string;
  customerName?: string;
}

// Local storage key for orders
const ORDERS_STORAGE_KEY = 'azure_marketplace_orders_v1';

function loadOrders(): OrderItem[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as OrderItem[];
  } catch {
    return [];
  }
}

function saveOrders(orders: OrderItem[]) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

// ============================================================================
// Main Component
// ============================================================================

export function AzureMarketplaceCatalog() {
  const navigate = useNavigate();
  
  // Product list state
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [demoMessage, setDemoMessage] = useState<string | null>(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState<string>('');
  const [publisherFilter, setPublisherFilter] = useState<string>('');
  const [pricingFilter, setPricingFilter] = useState<string>('');
  
  // Product detail modal
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanSummary | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Orders tracking
  const [orders, setOrders] = useState<OrderItem[]>(loadOrders());
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<string>('catalog');

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const result = await listMarketplaceCatalogProducts({
      filter: productTypeFilter ? { productType: productTypeFilter } : undefined,
      // Note: Don't use expand: ['plans'] as it nullifies startingPrice in the Azure API response
      top: 500, // Increased to get more products
    });
    
    if (result.ok && result.products) {
      setProducts(result.products);
      setIsDemo(result.isDemo || false);
      setDemoMessage(result.message || null);
    } else {
      notifications.show({
        title: 'Error fetching products',
        message: result.error || 'Unknown error',
        color: 'red',
      });
    }
    setLoading(false);
  };

  // Get unique publishers for filter
  const publishers = useMemo(() => {
    const unique = new Set<string>();
    products.forEach(p => {
      if (p.publisherDisplayName) unique.add(p.publisherDisplayName);
    });
    return Array.from(unique).sort();
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches = 
          p.displayName?.toLowerCase().includes(q) ||
          p.publisherDisplayName?.toLowerCase().includes(q) ||
          p.summary?.toLowerCase().includes(q) ||
          p.productType?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      
      // Product type
      if (productTypeFilter && p.productType !== productTypeFilter) {
        return false;
      }
      
      // Publisher
      if (publisherFilter && p.publisherDisplayName !== publisherFilter) {
        return false;
      }
      
      // Pricing
      if (pricingFilter && !p.pricingTypes?.includes(pricingFilter)) {
        return false;
      }
      
      return true;
    });
  }, [products, searchQuery, productTypeFilter, publisherFilter, pricingFilter]);

  // Handle placing an order
  const handlePlaceOrder = () => {
    if (!selectedProduct || !selectedPlan) return;
    
    // Calculate estimated price
    const pricing = selectedPlan.pricing;
    let estimatedMonthlyPrice: number | undefined;
    if (pricing) {
      if (pricing.billingPeriod === 'monthly') {
        estimatedMonthlyPrice = pricing.retailPrice * quantity;
      } else if (pricing.billingPeriod === 'hourly') {
        // Estimate monthly cost based on 730 hours/month
        estimatedMonthlyPrice = pricing.retailPrice * 730 * quantity;
      } else if (pricing.billingPeriod === 'annual') {
        estimatedMonthlyPrice = (pricing.retailPrice / 12) * quantity;
      }
    }
    
    const newOrder: OrderItem = {
      id: `ORD-${Date.now()}`,
      productId: selectedProduct.uniqueProductId || selectedProduct.productId || selectedProduct.displayName,
      productName: selectedProduct.displayName,
      planId: selectedPlan.planId,
      planName: selectedPlan.displayName,
      publisherName: selectedProduct.publisherDisplayName,
      quantity,
      pricingType: selectedPlan.pricingTypes?.[0] || 'Unknown',
      status: 'pending',
      createdAt: new Date().toISOString(),
      billingCycle: selectedPlan.pricingTypes?.includes('Subscription') ? 'monthly' : 'usage-based',
      estimatedMonthlyPrice,
    };
    
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
    
    const priceMessage = estimatedMonthlyPrice ? ` (Est. $${estimatedMonthlyPrice.toFixed(2)}/mo)` : '';
    notifications.show({
      title: 'Order placed',
      message: `${selectedProduct.displayName} - ${selectedPlan.displayName}${priceMessage} added to orders`,
      color: 'green',
      icon: <Check size={16} />,
    });
    
    setSelectedProduct(null);
    setSelectedPlan(null);
    setQuantity(1);
  };

  // Get pricing badge color
  const getPricingBadgeColor = (pricingType: string) => {
    const pt = PRICING_TYPES.find(p => p.value === pricingType);
    return pt?.color || 'gray';
  };

  // Render product card
  const renderProductCard = (product: ProductSummary) => (
    <Card
      key={product.uniqueProductId || product.productId || product.displayName}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
      onClick={() => setSelectedProduct(product)}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Box style={{ flex: 1 }}>
            <Text size="lg" fw={600} lineClamp={1}>
              {product.displayName}
            </Text>
            <Text size="sm" c="dimmed" lineClamp={1}>
              {product.publisherDisplayName}
            </Text>
          </Box>
          {product.publisherType === 'Microsoft' && (
            <Badge color="blue" size="sm" variant="light">
              Microsoft
            </Badge>
          )}
        </Group>

        <Text size="sm" c="dimmed" lineClamp={2} style={{ minHeight: 40 }}>
          {product.description || product.summary || 'No description available'}
        </Text>

        <Group gap="xs" wrap="wrap">
          <Badge variant="outline" size="sm" color="gray">
            {PRODUCT_TYPES.find(pt => pt.value === product.productType)?.label || product.productType}
          </Badge>
          {product.pricingTypes?.slice(0, 2).map(pt => (
            <Badge key={pt} size="sm" color={getPricingBadgeColor(pt)}>
              {PRICING_TYPES.find(p => p.value === pt)?.label || pt}
            </Badge>
          ))}
        </Group>

        {/* Show starting price if available */}
        {product.startingPrice && (
          <Group gap="xs" align="baseline">
            <Text size="lg" fw={700} c="teal">
              {product.startingPrice.currency || 'USD'} {(product.startingPrice.minTermPrice ?? 0).toFixed(2)}
            </Text>
            <Text size="xs" c="dimmed">
              / {product.startingPrice.termUnits === 'P1Y' ? 'year' : 'month'}
            </Text>
          </Group>
        )}

        {product.plans && product.plans.length > 0 && (
          <Text size="xs" c="dimmed">
            {product.plans.length} plan{product.plans.length > 1 ? 's' : ''} available
          </Text>
        )}
      </Stack>
    </Card>
  );

  // Render orders table
  const renderOrdersTable = () => (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Order ID</Table.Th>
          <Table.Th>Product</Table.Th>
          <Table.Th>Plan</Table.Th>
          <Table.Th>Qty</Table.Th>
          <Table.Th>Est. Monthly</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Created</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {orders.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={7}>
              <Text ta="center" c="dimmed" py="xl">
                No orders yet. Browse the catalog to place orders.
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          orders.map(order => (
            <Table.Tr key={order.id}>
              <Table.Td>
                <Text size="sm" ff="monospace">{order.id}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" fw={500}>{order.productName}</Text>
                <Text size="xs" c="dimmed">{order.publisherName}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{order.planName}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{order.quantity}</Text>
              </Table.Td>
              <Table.Td>
                {order.estimatedMonthlyPrice !== undefined ? (
                  <Text size="sm" fw={600} c="blue">
                    ${order.estimatedMonthlyPrice.toFixed(2)}
                  </Text>
                ) : (
                  <Badge size="sm" color={getPricingBadgeColor(order.pricingType)}>
                    {order.pricingType}
                  </Badge>
                )}
              </Table.Td>
              <Table.Td>
                <Badge
                  size="sm"
                  color={
                    order.status === 'active' ? 'green' :
                    order.status === 'pending' ? 'yellow' :
                    order.status === 'provisioning' ? 'blue' :
                    order.status === 'failed' ? 'red' : 'gray'
                  }
                >
                  {order.status}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Text size="sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>
              </Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );

  return (
    <Box bg="gray.0" mih="100vh">
      <TopNavbar />
      
      <Container size="xl" py="xl">
        <Stack gap="lg">
          {/* Breadcrumbs */}
          <Breadcrumbs>
            <Anchor onClick={() => navigate('/operations/microsoft')} size="sm">
              Operations
            </Anchor>
            <Anchor onClick={() => navigate('/vendor-integrations')} size="sm">
              Vendor Integrations
            </Anchor>
            <Text size="sm">Azure Marketplace Catalog</Text>
          </Breadcrumbs>

          {/* Header */}
          <Group justify="space-between" align="flex-start">
            <Box>
              <Group gap="sm" mb="xs">
                <ActionIcon
                  variant="subtle"
                  onClick={() => navigate(-1)}
                  size="lg"
                >
                  <ArrowLeft size={20} />
                </ActionIcon>
                <Title order={2}>Azure Marketplace Catalog</Title>
              </Group>
              <Text c="dimmed" size="sm">
                Discover and transact Azure Marketplace products via the Catalog API
              </Text>
            </Box>
            
            <Group gap="sm">
              <Badge
                size="lg"
                variant="light"
                color="blue"
                leftSection={<Cloud size={14} />}
              >
                Subscription: {AUTHORIZED_SUBSCRIPTION_ID.slice(0, 8)}...
              </Badge>
              <Button
                variant="light"
                leftSection={<ShoppingCart size={16} />}
                onClick={() => setActiveTab('orders')}
              >
                Orders ({orders.length})
              </Button>
            </Group>
          </Group>

          {/* Demo mode alert */}
          {isDemo && (
            <Alert
              icon={<Info size={16} />}
              color="blue"
              title="Demo Mode"
            >
              <Group justify="space-between" align="center">
                <Text size="sm">
                  {demoMessage || 'Showing demo products. Connect to Azure for real catalog data.'}
                </Text>
                <Button
                  size="xs"
                  variant="filled"
                  color="blue"
                  leftSection={<Cloud size={14} />}
                  onClick={() => {
                    window.location.href = 'http://localhost:4000/api/partner-center/connect-azure';
                  }}
                >
                  Connect Azure
                </Button>
              </Group>
            </Alert>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onChange={(v) => setActiveTab(v || 'catalog')}>
            <Tabs.List>
              <Tabs.Tab value="catalog" leftSection={<Package size={16} />}>
                Product Catalog
              </Tabs.Tab>
              <Tabs.Tab
                value="orders"
                leftSection={<ShoppingCart size={16} />}
                rightSection={
                  orders.length > 0 && (
                    <Badge size="sm" color="blue" variant="filled">
                      {orders.length}
                    </Badge>
                  )
                }
              >
                Orders & Billing
              </Tabs.Tab>
            </Tabs.List>

            {/* Catalog Tab */}
            <Tabs.Panel value="catalog" pt="lg">
              <Stack gap="lg">
                {/* Filters */}
                <Paper p="md" withBorder>
                  <Group gap="md" wrap="wrap">
                    <TextInput
                      placeholder="Search products..."
                      leftSection={<Search size={16} />}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ flex: 1, minWidth: 200 }}
                    />
                    <Select
                      placeholder="Product Type"
                      data={PRODUCT_TYPES}
                      value={productTypeFilter}
                      onChange={(v) => setProductTypeFilter(v || '')}
                      clearable
                      style={{ minWidth: 180 }}
                    />
                    <Select
                      placeholder="Publisher"
                      data={[
                        { value: '', label: 'All Publishers' },
                        ...publishers.map(p => ({ value: p, label: p })),
                      ]}
                      value={publisherFilter}
                      onChange={(v) => setPublisherFilter(v || '')}
                      clearable
                      style={{ minWidth: 180 }}
                    />
                    <Select
                      placeholder="Pricing"
                      data={[
                        { value: '', label: 'All Pricing' },
                        ...PRICING_TYPES.map(p => ({ value: p.value, label: p.label })),
                      ]}
                      value={pricingFilter}
                      onChange={(v) => setPricingFilter(v || '')}
                      clearable
                      style={{ minWidth: 160 }}
                    />
                    <Button
                      variant="light"
                      leftSection={<RefreshCw size={16} />}
                      onClick={fetchProducts}
                      loading={loading}
                    >
                      Refresh
                    </Button>
                  </Group>
                </Paper>

                {/* Results count */}
                <Text size="sm" c="dimmed">
                  Showing {filteredProducts.length} of {products.length} products
                </Text>

                {/* Product grid */}
                {loading ? (
                  <Box ta="center" py="xl">
                    <Loader size="lg" />
                    <Text c="dimmed" mt="md">Loading catalog...</Text>
                  </Box>
                ) : filteredProducts.length === 0 ? (
                  <Paper p="xl" ta="center" withBorder>
                    <Package size={48} color="gray" />
                    <Title order={4} mt="md" c="dimmed">No products found</Title>
                    <Text c="dimmed" size="sm">Try adjusting your filters</Text>
                  </Paper>
                ) : (
                  <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                    {filteredProducts.map(renderProductCard)}
                  </SimpleGrid>
                )}
              </Stack>
            </Tabs.Panel>

            {/* Orders Tab */}
            <Tabs.Panel value="orders" pt="lg">
              <Stack gap="lg">
                <Group justify="space-between">
                  <Box>
                    <Title order={4}>Orders & Subscriptions</Title>
                    <Text size="sm" c="dimmed">
                      Track your Azure Marketplace orders and billing
                    </Text>
                  </Box>
                  {orders.length > 0 && (
                    <Button
                      variant="subtle"
                      color="red"
                      onClick={() => {
                        setOrders([]);
                        saveOrders([]);
                        notifications.show({
                          title: 'Orders cleared',
                          message: 'All orders have been cleared',
                          color: 'blue',
                        });
                      }}
                    >
                      Clear All Orders
                    </Button>
                  )}
                </Group>

                <Paper withBorder>
                  {renderOrdersTable()}
                </Paper>

                {/* Billing summary */}
                {orders.length > 0 && (
                  <Paper p="lg" withBorder>
                    <Title order={5} mb="md">Billing Summary</Title>
                    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                      <Card withBorder>
                        <Group>
                          <ThemeIcon size="lg" color="green" variant="light">
                            <DollarSign size={20} />
                          </ThemeIcon>
                          <Box>
                            <Text size="xs" c="dimmed">Active Subscriptions</Text>
                            <Text size="lg" fw={600}>
                              {orders.filter(o => o.status === 'active').length}
                            </Text>
                          </Box>
                        </Group>
                      </Card>
                      <Card withBorder>
                        <Group>
                          <ThemeIcon size="lg" color="yellow" variant="light">
                            <Calendar size={20} />
                          </ThemeIcon>
                          <Box>
                            <Text size="xs" c="dimmed">Pending Orders</Text>
                            <Text size="lg" fw={600}>
                              {orders.filter(o => o.status === 'pending').length}
                            </Text>
                          </Box>
                        </Group>
                      </Card>
                      <Card withBorder>
                        <Group>
                          <ThemeIcon size="lg" color="blue" variant="light">
                            <Layers size={20} />
                          </ThemeIcon>
                          <Box>
                            <Text size="xs" c="dimmed">Total Products</Text>
                            <Text size="lg" fw={600}>
                              {new Set(orders.map(o => o.productId)).size}
                            </Text>
                          </Box>
                        </Group>
                      </Card>
                    </SimpleGrid>
                  </Paper>
                )}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>

      {/* Product Detail Modal */}
      <Modal
        opened={!!selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
          setSelectedPlan(null);
          setQuantity(1);
        }}
        title={
          <Group gap="sm">
            <Package size={20} />
            <Text fw={600}>{selectedProduct?.displayName}</Text>
          </Group>
        }
        size="lg"
      >
        {selectedProduct && (
          <Stack gap="lg">
            {/* Product info */}
            <Box>
              <Group gap="xs" mb="sm">
                <Badge variant="light" color="gray">
                  {PRODUCT_TYPES.find(pt => pt.value === selectedProduct.productType)?.label || selectedProduct.productType}
                </Badge>
                {selectedProduct.publisherType === 'Microsoft' && (
                  <Badge color="blue" variant="light">Microsoft</Badge>
                )}
              </Group>
              <Text size="sm" c="dimmed" mb="xs">
                by {selectedProduct.publisherDisplayName}
              </Text>
              <Text size="sm">
                {selectedProduct.description || selectedProduct.summary || selectedProduct.longSummary || 'No description available'}
              </Text>
            </Box>

            <Divider />

            {/* Plans */}
            <Box>
              <Text fw={600} mb="sm">Available Plans</Text>
              <Stack gap="sm">
                {selectedProduct.plans && selectedProduct.plans.length > 0 ? (
                  selectedProduct.plans.map(plan => (
                    <Card
                      key={plan.planId}
                      padding="sm"
                      radius="md"
                      withBorder
                      style={{
                        cursor: 'pointer',
                        borderColor: selectedPlan?.planId === plan.planId ? 'var(--mantine-color-blue-5)' : undefined,
                        backgroundColor: selectedPlan?.planId === plan.planId ? 'var(--mantine-color-blue-0)' : undefined,
                      }}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <Group justify="space-between">
                        <Box style={{ flex: 1 }}>
                          <Group justify="space-between" align="flex-start">
                            <Text fw={500}>{plan.displayName}</Text>
                            {plan.pricing && (
                              <Text fw={700} c="blue" size="lg">
                                {plan.pricing.retailPrice === 0 ? 'Free' : 
                                  `$${plan.pricing.retailPrice.toFixed(2)}/${plan.pricing.billingPeriod === 'monthly' ? 'mo' : plan.pricing.billingPeriod === 'hourly' ? 'hr' : plan.pricing.billingPeriod}`
                                }
                              </Text>
                            )}
                          </Group>
                          {plan.pricing && plan.pricing.unitOfMeasure && (
                            <Text size="xs" c="dimmed" mb={4}>
                              per {plan.pricing.unitOfMeasure}
                            </Text>
                          )}
                          <Group gap="xs" mt={4}>
                            {plan.pricingTypes?.map(pt => (
                              <Badge key={pt} size="xs" color={getPricingBadgeColor(pt)}>
                                {PRICING_TYPES.find(p => p.value === pt)?.label || pt}
                              </Badge>
                            ))}
                            {plan.cspState && (
                              <Badge
                                size="xs"
                                color={CSP_STATES[plan.cspState]?.color || 'gray'}
                                variant="outline"
                              >
                                {CSP_STATES[plan.cspState]?.label || plan.cspState}
                              </Badge>
                            )}
                          </Group>
                        </Box>
                        {selectedPlan?.planId === plan.planId && (
                          <ThemeIcon color="blue" size="sm" radius="xl">
                            <Check size={14} />
                          </ThemeIcon>
                        )}
                      </Group>
                    </Card>
                  ))
                ) : selectedProduct?.startingPrice ? (
                  <Card padding="sm" radius="md" withBorder>
                    <Group justify="space-between" align="center">
                      <Box>
                        <Text fw={500}>Standard Pricing</Text>
                        <Text size="xs" c="dimmed">
                          {selectedProduct.productFamily || selectedProduct.serviceFamily || 'Microsoft Product'}
                        </Text>
                      </Box>
                      <Box ta="right">
                        <Text size="lg" fw={700} c="teal">
                          {selectedProduct.startingPrice.currency || 'USD'} {selectedProduct.startingPrice.minTermPrice?.toFixed(2) || '0.00'}
                        </Text>
                        <Text size="xs" c="dimmed">
                          per {selectedProduct.startingPrice.termUnits === 'P1Y' ? 'year' : 'month'}
                        </Text>
                      </Box>
                    </Group>
                  </Card>
                ) : (
                  <Text size="sm" c="dimmed">No plans or pricing available</Text>
                )}
              </Stack>
            </Box>

            {/* Quantity selector */}
            {selectedPlan && (
              <>
                <Divider />
                <Group>
                  <NumberInput
                    label="Quantity"
                    value={quantity}
                    onChange={(v) => setQuantity(Number(v) || 1)}
                    min={1}
                    max={100}
                    style={{ width: 120 }}
                  />
                </Group>
              </>
            )}

            {/* Action buttons */}
            <Group justify="flex-end" gap="sm">
              <Button
                variant="subtle"
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedPlan(null);
                }}
              >
                Cancel
              </Button>
              <Button
                leftSection={<ShoppingCart size={16} />}
                disabled={!selectedPlan}
                onClick={handlePlaceOrder}
              >
                Add to Orders
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}

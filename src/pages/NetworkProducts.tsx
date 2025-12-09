import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Group,
  Table,
  Badge,
  Anchor,
  Box,
  ActionIcon,
  Collapse,
  Select,
  Checkbox,
  Stack,
} from '@mantine/core';
import { Search, Filter, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { Sidebar } from '../components/navigation/Sidebar';

// Product status type
type ProductStatus = 'available' | 'added' | 'request';

interface NetworkProduct {
  id: string;
  name: string;
  description?: string;
  developer: string;
  image?: string;
  status: ProductStatus;
  tags?: string[];
}

// Sample product data based on the screenshot
const networkProducts: NetworkProduct[] = [
  {
    id: '1',
    name: 'Atletico Madrid',
    description: 'This has tiered editions yes',
    developer: 'Shastaqa',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=80&h=80&fit=crop',
    status: 'available',
  },
  {
    id: '2',
    name: 'Dio Old',
    description: 'Ronnie James Dio',
    developer: 'Bears Organization',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop',
    status: 'available',
  },
  {
    id: '3',
    name: 'Exchange Online V2',
    description: 'Hosted Email for Business',
    developer: 'Microsoft SKU test',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg/80px-Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg.png',
    status: 'available',
  },
  {
    id: '4',
    name: 'Manchester United',
    description: 'Glory Glory Manchester United!',
    developer: 'Shastaqa',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/80px-Manchester_United_FC_crest.svg.png',
    status: 'available',
  },
  {
    id: '5',
    name: 'Office 365 Enterprise V3',
    description: 'Office 365',
    developer: 'Microsoft SKU test',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg/80px-Microsoft_Office_logo_%282019%E2%80%93present%29.svg.png',
    status: 'added',
  },
  {
    id: '6',
    name: 'Orange Soda App',
    description: 'orange soda is very good.',
    developer: 'NFL',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=80&h=80&fit=crop',
    status: 'available',
  },
  {
    id: '7',
    name: 'Cloud Storage Pro',
    description: 'Enterprise cloud storage solution',
    developer: 'AppDirect',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=80&h=80&fit=crop',
    status: 'request',
  },
  {
    id: '8',
    name: 'Analytics Dashboard',
    description: 'Business intelligence platform',
    developer: 'AppDirect',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=80&h=80&fit=crop',
    status: 'request',
  },
  {
    id: '9',
    name: 'Dev Tools Suite',
    description: 'Complete development toolkit',
    developer: 'Appdirect Developer - Usage QA',
    image: '',
    status: 'request',
    tags: ['IMPORT APP'],
  },
  {
    id: '10',
    name: 'Insights Pro',
    description: 'Advanced analytics and insights',
    developer: 'AppInsights',
    image: '',
    status: 'request',
    tags: ['IMPORT APP'],
  },
  {
    id: '11',
    name: 'Premium Add-on',
    description: 'Enhanced features package',
    developer: 'AppDirect',
    image: '',
    status: 'request',
    tags: ['ADD-ON'],
  },
  {
    id: '12',
    name: 'AppHelp Support',
    description: 'Customer support solution',
    developer: 'AppHelp',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=80&h=80&fit=crop',
    status: 'request',
  },
  {
    id: '13',
    name: 'Automation Studio',
    description: 'Workflow automation platform',
    developer: 'AppDirect',
    image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=80&h=80&fit=crop',
    status: 'request',
  },
  {
    id: '14',
    name: 'Connect Hub',
    description: 'Integration platform',
    developer: 'AppDirect',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=80&h=80&fit=crop',
    status: 'request',
    tags: ['IMPORT APP'],
  },
  {
    id: '15',
    name: 'Data Sync',
    description: 'Real-time data synchronization',
    developer: 'AppDirect',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=80&h=80&fit=crop',
    status: 'request',
  },
  {
    id: '16',
    name: 'CMS Enterprise',
    description: 'Content management system',
    developer: 'CMS_TEST',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=80&h=80&fit=crop',
    status: 'request',
    tags: ['IMPORT APP'],
  },
  {
    id: '17',
    name: 'Marketing Suite',
    description: 'Complete marketing toolkit',
    developer: 'Appdirect',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&h=80&fit=crop',
    status: 'request',
    tags: ['IMPORT APP'],
  },
  {
    id: '18',
    name: 'AD Company Tools',
    description: 'Business productivity suite',
    developer: 'AD Company',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=80&h=80&fit=crop',
    status: 'request',
    tags: ['IMPORT APP'],
  },
  {
    id: '19',
    name: 'Standard App',
    description: 'General purpose application',
    developer: 'AppDirect',
    image: '',
    status: 'request',
  },
  {
    id: '20',
    name: 'CB Solutions',
    description: 'Custom business solutions',
    developer: 'CB',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg/80px-Microsoft_Office_logo_%282019%E2%80%93present%29.svg.png',
    status: 'request',
  },
];

// Product image component with fallback
const ProductImage = ({ src, name }: { src?: string; name: string }) => {
  if (!src) {
    return (
      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
        <Star size={20} className="text-gray-400" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      className="w-12 h-12 rounded object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
        (e.target as HTMLImageElement).parentElement!.innerHTML = `
          <div class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
        `;
      }}
    />
  );
};

// Status button component
const StatusButton = ({ status, onAdd }: { status: ProductStatus; onAdd: () => void }) => {
  switch (status) {
    case 'added':
      return (
        <Button 
          variant="outline" 
          color="gray" 
          size="xs"
          disabled
          style={{ minWidth: 110 }}
        >
          Currently Added
        </Button>
      );
    case 'request':
      return (
        <Button 
          variant="outline" 
          color="gray" 
          size="xs"
          onClick={onAdd}
          style={{ minWidth: 110 }}
        >
          Request to Add
        </Button>
      );
    default:
      return (
        <Button 
          variant="outline" 
          color="gray" 
          size="xs"
          onClick={onAdd}
          style={{ minWidth: 110 }}
        >
          Add to Staging
        </Button>
      );
  }
};

export const NetworkProducts = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState(networkProducts);
  
  // Filter states
  const [developerFilter, setDeveloperFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Get unique developers for filter
  const developers = [...new Set(networkProducts.map(p => p.developer))].sort();

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDeveloper = !developerFilter || product.developer === developerFilter;
    const matchesStatus = !statusFilter || product.status === statusFilter;
    
    return matchesSearch && matchesDeveloper && matchesStatus;
  });

  const handleAddProduct = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, status: 'added' as ProductStatus } : p
    ));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <TopNavbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Anchor 
              component="button"
              onClick={() => navigate('/products')}
              c="teal"
              size="sm"
            >
              Catalog
            </Anchor>
            <span className="mx-2">›</span>
            <span>Appdirect Network Products</span>
          </div>

          {/* Title */}
          <Title order={2} fw={400} mb="lg" className="text-gray-800">
            Add from the Network Catalog
          </Title>

          {/* Filters and Search Row */}
          <Group justify="space-between" mb="md">
            <Button
              variant="outline"
              color="gray"
              leftSection={showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>

            <TextInput
              placeholder="Search product names and IDs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              rightSection={<Search size={16} className="text-gray-400" />}
              style={{ width: 300 }}
            />
          </Group>

          {/* Collapsible Filters */}
          <Collapse in={showFilters}>
            <Paper withBorder p="md" mb="md" radius="md">
              <Group>
                <Select
                  label="Developer"
                  placeholder="All developers"
                  data={developers}
                  value={developerFilter}
                  onChange={setDeveloperFilter}
                  clearable
                  style={{ width: 200 }}
                />
                <Select
                  label="Status"
                  placeholder="All statuses"
                  data={[
                    { value: 'available', label: 'Available' },
                    { value: 'added', label: 'Currently Added' },
                    { value: 'request', label: 'Request to Add' },
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  clearable
                  style={{ width: 200 }}
                />
                <Button 
                  variant="subtle" 
                  color="gray"
                  onClick={() => {
                    setDeveloperFilter(null);
                    setStatusFilter(null);
                  }}
                  mt={24}
                >
                  Clear Filters
                </Button>
              </Group>
            </Paper>
          </Collapse>

          {/* Products Table */}
          <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                  <Table.Th style={{ width: '50%' }}>Application</Table.Th>
                  <Table.Th>Developer</Table.Th>
                  <Table.Th style={{ width: 100 }}></Table.Th>
                  <Table.Th style={{ width: 130 }}></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredProducts.map((product) => (
                  <Table.Tr key={product.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <ProductImage src={product.image} name={product.name} />
                        <div>
                          <Anchor 
                            component="button"
                            c="teal"
                            fw={500}
                            size="sm"
                          >
                            {product.name}
                          </Anchor>
                          {product.description && (
                            <Text size="xs" c="dimmed">{product.description}</Text>
                          )}
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">{product.developer}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        {product.tags?.map(tag => (
                          <Badge 
                            key={tag} 
                            size="xs" 
                            variant="light" 
                            color="gray"
                            style={{ textTransform: 'uppercase', fontSize: 9 }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <StatusButton 
                        status={product.status} 
                        onAdd={() => handleAddProduct(product.id)}
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>

          {/* Results count */}
          <Text size="sm" c="dimmed" mt="md">
            Showing {filteredProducts.length} of {products.length} products
          </Text>
        </main>
      </div>
    </div>
  );
};


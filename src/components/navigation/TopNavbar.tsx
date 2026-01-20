import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SearchIcon, PlusIcon, BellIcon, Settings2Icon, ArrowDownLeft, ArrowUpRight, Clock, ExternalLink, PlugZap } from 'lucide-react'
import { Avatar } from '../misc/Avatar'
import { mockTransferRequests, formatDate, getDaysUntilExpiration, formatCurrency } from '../company/p2p/mockData'
import { getPartnerCenterHealth, getPartnerCenterStatus } from '../../api/partnerCenter'
import { PartnerCenterConnectorModal } from '../microsoft/PartnerCenterConnectorModal'
import { ActionIcon, Badge, Button, Card, Inline, Popover, Stack, Text, TextInput, Title } from 'components/DesignSystem'

const NavLink = ({
  to,
  children,
  active,
  isNew,
}: {
  to: string
  children: React.ReactNode
  active?: boolean
  isNew?: boolean
}) => (
  <Link
    to={to}
    style={{
      textDecoration: 'none',
      color: active ? 'white' : 'var(--mantine-color-gray-3)',
      padding: '4px 6px',
      position: 'relative',
      fontSize: 14,
      fontWeight: 600,
    }}
  >
    <Inline gap={6} align="center" wrap="nowrap">
      <Text size="sm" style={{ color: active ? 'white' : 'var(--mantine-color-gray-3)' }}>
        {children}
      </Text>
      {isNew && (
        <Badge size="xs" color="success" variant="filled">
          New
        </Badge>
      )}
    </Inline>
    {active && (
      <span
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -10,
          height: 2,
          background: 'var(--mantine-color-blue-6)',
        }}
      />
    )}
  </Link>
)

export const TopNavbar = ({ embedded }: { embedded?: boolean }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname
  const [connectorStatus, setConnectorStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown')
  const [connectorModalOpen, setConnectorModalOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Get pending P2P transfers for notifications
  const pendingIncoming = mockTransferRequests.filter(t => t.direction === 'Incoming' && t.status === 'Pending')
  const pendingOutgoing = mockTransferRequests.filter(t => t.direction === 'Outgoing' && t.status === 'Pending')
  const totalPending = pendingIncoming.length + pendingOutgoing.length

  // Background health check on load.
  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        const status = await getPartnerCenterStatus()
        const health = await getPartnerCenterHealth()
        if (!cancelled) {
          setConnectorStatus(status.ok && health.ok ? 'connected' : 'disconnected')
        }
      } catch (e: any) {
        if (!cancelled) {
          setConnectorStatus('disconnected')
        }
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  const handleConnectorSync = async () => {
    setConnectorModalOpen(true)
  }

  const handleViewAll = () => {
    setNotificationsOpen(false)
    navigate('/operations/companies')
  }

  const handleTransferClick = (customerName: string) => {
    setNotificationsOpen(false)
    navigate(`/operations/companies/${encodeURIComponent(customerName)}`)
  }

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
        paddingLeft: 16,
        paddingRight: 16,
        height: '100%',
        background: embedded ? 'transparent' : 'var(--mantine-color-gray-9)',
      }}
    >
      <Inline gap="xl" align="center" wrap="nowrap">
        {/* App Grid Icon */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 4,
                background: 'var(--mantine-color-gray-5)',
                borderRadius: 2,
              }}
            />
          ))}
        </div>

        <Inline gap="lg" align="center" wrap="nowrap">
          {/* Marketplace Logo */}
          <Link to="/home" style={{ textDecoration: 'none', color: 'white' }}>
            <Inline gap="sm" align="center" wrap="nowrap">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--mantine-color-blue-6)',
                  borderRadius: 8,
                  padding: 6,
                }}
              >
                <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }} fill="currentColor">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </div>
              <Text size="sm" fw={700} style={{ color: 'white' }}>
                Marketplace
              </Text>
            </Inline>
          </Link>

          {/* Navigation Links */}
          <Inline gap="md" align="center" wrap="nowrap">
            <NavLink to="/home" active={currentPath === '/home'}>
              Home
            </NavLink>
            <NavLink to="/operations" active={currentPath === '/operations' || currentPath.startsWith('/operations/')} isNew>
              Operations
            </NavLink>
            <NavLink to="/products" active={currentPath === '/products' || currentPath.startsWith('/products/')} isNew>
              Products
            </NavLink>
            <NavLink to="/settings" active={currentPath === '/settings' || currentPath.startsWith('/settings/')} isNew>
              Settings
            </NavLink>
            <NavLink to="/reports" active={currentPath === '/reports'}>
              Reports
            </NavLink>
            <NavLink to="/themes" active={currentPath === '/themes'}>
              Themes
            </NavLink>
            <NavLink to="/programs" active={currentPath === '/programs'}>
              Programs
            </NavLink>
          </Inline>
        </Inline>
      </Inline>

      <Inline gap="sm" align="center" wrap="nowrap">
        <TextInput
          placeholder="Search"
          size="sm"
          leftIcon={<SearchIcon size={14} />}
          styles={{
            input: {
              background: 'rgba(255,255,255,0.08)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.16)',
            },
          }}
        />

        <Button variant="primary" size="sm" rightIcon={<PlusIcon size={16} />}>
          Create
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleConnectorSync}
          rightIcon={<PlugZap size={16} />}
          style={{
            background:
              connectorStatus === 'connected'
                ? 'var(--mantine-color-green-0)'
                : connectorStatus === 'disconnected'
                ? 'var(--mantine-color-red-0)'
                : 'rgba(255,255,255,0.08)',
            borderColor:
              connectorStatus === 'connected'
                ? 'var(--mantine-color-green-2)'
                : connectorStatus === 'disconnected'
                ? 'var(--mantine-color-red-2)'
                : 'rgba(255,255,255,0.16)',
            color:
              connectorStatus === 'connected'
                ? 'var(--mantine-color-green-9)'
                : connectorStatus === 'disconnected'
                ? 'var(--mantine-color-red-9)'
                : 'white',
          }}
          leftIcon={
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background:
                  connectorStatus === 'connected'
                    ? 'var(--mantine-color-green-6)'
                    : connectorStatus === 'disconnected'
                    ? 'var(--mantine-color-red-6)'
                    : 'var(--mantine-color-gray-5)',
                display: 'inline-block',
              }}
            />
          }
        >
          Connector Sync
        </Button>

        <PartnerCenterConnectorModal
          opened={connectorModalOpen}
          onClose={() => setConnectorModalOpen(false)}
          onOpenSettings={() => {
            navigate('/settings/vendor-integrations/microsoft')
            setConnectorModalOpen(false)
          }}
          onStatusChange={(s) => setConnectorStatus(s)}
        />

        {/* Notifications */}
        <Popover
          width={420}
          position="bottom"
          opened={notificationsOpen}
          onChange={setNotificationsOpen}
          trigger={
            <div style={{ position: 'relative' }}>
              <ActionIcon
                aria-label="Notifications"
                onClick={() => setNotificationsOpen((v) => !v)}
                customFill={notificationsOpen ? 'var(--mantine-color-blue-6)' : 'rgba(255,255,255,0.08)'}
                customBorder="1px solid rgba(255,255,255,0.16)"
                style={{ color: 'white' }}
              >
                <BellIcon size={18} />
              </ActionIcon>
              {totalPending > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 16,
                    height: 16,
                    borderRadius: 999,
                    background: 'var(--mantine-color-green-6)',
                    color: 'white',
                    fontSize: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--mantine-color-dark-9)',
                  }}
                >
                  {totalPending}
                </span>
              )}
            </div>
          }
        >
          <Stack gap="sm">
            <Inline justify="space-between" align="center" wrap="nowrap">
              <Title order={5} m={0}>
                Notifications
              </Title>
              {totalPending > 0 && (
                <Badge size="sm" color="danger" variant="filled">
                  {totalPending}
                </Badge>
              )}
            </Inline>

            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              <Stack gap="sm">
                {pendingIncoming.length > 0 && (
                  <Card>
                    <Stack gap="xs">
                      <Inline gap="xs" align="center" wrap="nowrap">
                        <ArrowDownLeft size={16} />
                        <Text size="xs" fw={700} style={{ textTransform: 'uppercase' }}>
                          Incoming P2P Transfers
                        </Text>
                        <Badge size="xs" color="info">
                          {pendingIncoming.length}
                        </Badge>
                      </Inline>
                      <Stack gap="xs">
                        {pendingIncoming.map((transfer) => {
                          const daysRemaining = getDaysUntilExpiration(transfer.expirationDate)
                          const isUrgent = daysRemaining <= 7
                          return (
                            <Card
                              key={transfer.id}
                              interactive
                              onClick={() => handleTransferClick(transfer.customerName)}
                              style={isUrgent ? { border: '1px solid var(--mantine-color-yellow-3)', background: 'var(--mantine-color-yellow-0)' } : undefined}
                            >
                              <Stack gap={6}>
                                <Inline justify="space-between" align="flex-start" wrap="nowrap">
                                  <Inline gap="xs" align="center" wrap="nowrap">
                                    <Text fw={700} size="sm">
                                      Transfer from {transfer.sourcePartner.name}
                                    </Text>
                                    {isUrgent && (
                                      <Badge size="xs" color="pending" variant="filled">
                                        Urgent
                                      </Badge>
                                    )}
                                  </Inline>
                                  <Badge size="xs" color="pending" variant="outline">
                                    Pending
                                  </Badge>
                                </Inline>
                                <Text size="xs" c="dimmed">
                                  {transfer.lineItems.length} subscription{transfer.lineItems.length !== 1 ? 's' : ''} • ~{formatCurrency(transfer.totalMonthlyValue)}/mo
                                </Text>
                                <Inline gap={6} align="center" wrap="nowrap">
                                  <Clock size={14} />
                                  <Text size="xs" c="dimmed" style={isUrgent ? { color: 'var(--mantine-color-yellow-9)', fontWeight: 700 } : undefined}>
                                    Expires {formatDate(transfer.expirationDate)} ({daysRemaining} days)
                                  </Text>
                                </Inline>
                              </Stack>
                            </Card>
                          )
                        })}
                      </Stack>
                    </Stack>
                  </Card>
                )}

                {pendingOutgoing.length > 0 && (
                  <Card>
                    <Stack gap="xs">
                      <Inline gap="xs" align="center" wrap="nowrap">
                        <ArrowUpRight size={16} />
                        <Text size="xs" fw={700} style={{ textTransform: 'uppercase' }}>
                          Outgoing P2P Transfers
                        </Text>
                        <Badge size="xs" color="default">
                          {pendingOutgoing.length}
                        </Badge>
                      </Inline>
                      <Stack gap="xs">
                        {pendingOutgoing.map((transfer) => (
                          <Card key={transfer.id} interactive onClick={() => handleTransferClick(transfer.customerName)}>
                            <Stack gap={6}>
                              <Inline justify="space-between" align="flex-start" wrap="nowrap">
                                <Text fw={700} size="sm">
                                  Transfer to {transfer.targetPartner.name}
                                </Text>
                                <Badge size="xs" color="default" variant="outline">
                                  Awaiting
                                </Badge>
                              </Inline>
                              <Text size="xs" c="dimmed">
                                {transfer.lineItems.length} subscription{transfer.lineItems.length !== 1 ? 's' : ''} • ~{formatCurrency(transfer.totalMonthlyValue)}/mo
                              </Text>
                              <Inline gap={6} align="center" wrap="nowrap">
                                <Clock size={14} />
                                <Text size="xs" c="dimmed">
                                  Awaiting partner response
                                </Text>
                              </Inline>
                            </Stack>
                          </Card>
                        ))}
                      </Stack>
                    </Stack>
                  </Card>
                )}

                {totalPending === 0 && (
                  <Card>
                    <Stack gap="sm" align="center">
                      <BellIcon size={28} />
                      <Text size="sm" c="dimmed">
                        No pending notifications
                      </Text>
                    </Stack>
                  </Card>
                )}
              </Stack>
            </div>

            <Button
              variant="link"
              onClick={() => {
                handleViewAll()
              }}
              rightIcon={<ExternalLink size={16} />}
            >
              View all P2P Transfers
            </Button>
          </Stack>
        </Popover>

        {/* Settings */}
        <ActionIcon
          aria-label="Settings"
          customFill="rgba(255,255,255,0.08)"
          customBorder="1px solid rgba(255,255,255,0.16)"
          style={{ color: 'white' }}
        >
          <Settings2Icon size={18} />
        </ActionIcon>

        {/* Avatar */}
        <Avatar initials="NB" />
      </Inline>
    </nav>
  )
}

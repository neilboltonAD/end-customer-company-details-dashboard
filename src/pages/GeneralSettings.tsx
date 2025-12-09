import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';

// Form Section Component
const FormSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border border-gray-200 rounded mb-6">
    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h2>
    </div>
    <div className="p-4 space-y-4">{children}</div>
  </div>
);

// Form Field Component
const FormField = ({
  label,
  required = false,
  description,
  children,
}: {
  label: string;
  required?: boolean;
  description?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {required && <span className="text-red-500 mr-1">*</span>}
      {label}
    </label>
    {children}
    {description && (
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    )}
  </div>
);

// Text Input Component
const TextInput = ({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
);

// Text Area Component
const TextArea = ({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="w-full max-w-lg px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
  />
);

// File Input Component
const FileInput = ({
  onChange,
}: {
  onChange: (file: File | null) => void;
}) => (
  <div className="flex items-center space-x-3">
    <input
      type="text"
      readOnly
      placeholder="No file chosen"
      className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 text-gray-500"
    />
    <button
      type="button"
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0] || null;
          onChange(file);
        };
        input.click();
      }}
      className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
    >
      Choose File
    </button>
  </div>
);

// Checkbox Component
const Checkbox = ({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}) => (
  <div>
    <label className="flex items-start space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
    {description && (
      <p className="text-xs text-gray-500 mt-1 ml-6">{description}</p>
    )}
  </div>
);

export const GeneralSettings = () => {
  // About section
  const [marketplaceName, setMarketplaceName] = useState('DiSTI');
  const [companyName, setCompanyName] = useState('DiSTI');

  // Email settings
  const [sendEmailsFrom, setSendEmailsFrom] = useState('no-reply@appdirect.com');
  const [bccEmails, setBccEmails] = useState('nobody@appdirect.com');
  const [customSmtp, setCustomSmtp] = useState(false);

  // Support resources
  const [supportCenterUrl, setSupportCenterUrl] = useState('http://support.appdirect.com');
  const [contactSupportUrl, setContactSupportUrl] = useState('http://support1.appdirect.com');
  const [supportEmail, setSupportEmail] = useState('support@test.appdirect.com');
  const [supportPhone, setSupportPhone] = useState('(877) 404-APPS');

  // Legal URLs
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [privacyPolicy, setPrivacyPolicy] = useState('');

  // SEO
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [robotsTxt, setRobotsTxt] = useState(
    'User-agent: *\nDisallow: /*LinkListener-popularSlider-seeAllFromFeatured\nDisallow: /*LinkListener-featuredSlider-seeAllFromFeatured'
  );
  const [noIndexMetaTag, setNoIndexMetaTag] = useState(false);

  // Analytics
  const [gaTrackingId, setGaTrackingId] = useState('UA-XXXX');

  // Accessibility
  const [legalCompanyName, setLegalCompanyName] = useState('');
  const [accessibilityEmail, setAccessibilityEmail] = useState('');

  const handleSave = () => {
    alert('Settings saved!');
  };

  return (
    <PageLayout title="General Settings" activeItem="General Settings">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">General Settings</h1>

        {/* ABOUT Section */}
        <FormSection title="ABOUT">
          <FormField
            label="Marketplace Name"
            required
            description='Appears in customer emails, support text, and within the marketplace page titles. Customers see, "Welcome to {My Marketplace Name}!" when they first sign up.'
          >
            <TextInput value={marketplaceName} onChange={setMarketplaceName} />
          </FormField>

          <FormField
            label="Company Name"
            required
            description='Company name is used in page titles and appears in account areas including the "From" field in a customer invoice.'
          >
            <TextInput value={companyName} onChange={setCompanyName} />
          </FormField>

          <FormField
            label="Marketplace Logo"
            description="Supports JPG and PNG formats."
          >
            <FileInput onChange={() => {}} />
          </FormField>

          <FormField
            label="Marketplace Favicon"
            description="Appears in the browser's address bar and next to the page's name in a list of bookmarks."
          >
            <FileInput onChange={() => {}} />
          </FormField>
        </FormSection>

        {/* EMAIL SETTINGS Section */}
        <FormSection title="EMAIL SETTINGS">
          <FormField
            label="Send Customer Emails from"
            required
            description='Appears in the "From" field in all customer emails. This must be a valid email address to receive customer replies.'
          >
            <TextInput value={sendEmailsFrom} onChange={setSendEmailsFrom} />
          </FormField>

          <FormField
            label="BCC Customer Emails to"
            description="When a valid email address is entered, that account is BCC'd on all marketplace emails. These emails may contain sensitive information."
          >
            <TextInput value={bccEmails} onChange={setBccEmails} />
          </FormField>

          <FormField label="Custom SMTP Configuration">
            <Checkbox
              label="Use a different SMTP server to deliver emails"
              checked={customSmtp}
              onChange={setCustomSmtp}
            />
          </FormField>
        </FormSection>

        {/* SUPPORT RESOURCES Section */}
        <FormSection title="SUPPORT RESOURCES">
          <p className="text-sm text-gray-600 mb-4">
            Support resources used in emails, your marketplace header or footer, and support text throughout the site.
          </p>

          <FormField label="Support Center URL">
            <TextInput value={supportCenterUrl} onChange={setSupportCenterUrl} />
          </FormField>

          <FormField label="Contact Support URL">
            <TextInput value={contactSupportUrl} onChange={setContactSupportUrl} />
          </FormField>

          <FormField label="Support Email" required>
            <TextInput value={supportEmail} onChange={setSupportEmail} type="email" />
          </FormField>

          <FormField label="Support Phone">
            <TextInput value={supportPhone} onChange={setSupportPhone} />
          </FormField>
        </FormSection>

        {/* LEGAL URLS Section */}
        <FormSection title="LEGAL URLS">
          <FormField
            label="Terms and Conditions"
            description="This link appears when customers activate their account. They must click the link, and agree to the terms of service."
          >
            <TextInput value={termsAndConditions} onChange={setTermsAndConditions} />
          </FormField>

          <FormField
            label="Privacy Policy"
            description="This link appears in the marketplace footer. When clicked, it displays the Marketplace Privacy Policy."
          >
            <TextInput value={privacyPolicy} onChange={setPrivacyPolicy} />
          </FormField>
        </FormSection>

        {/* SEO Section */}
        <FormSection title="SEO">
          <FormField
            label="Marketplace Meta Description"
            description="Description that appears on search engine results."
          >
            <TextArea value={metaDescription} onChange={setMetaDescription} />
          </FormField>

          <FormField label="Marketplace Meta Keywords">
            <TextArea value={metaKeywords} onChange={setMetaKeywords} />
          </FormField>

          <FormField
            label="Edit robots.txt"
            description={
              <>
                The robots.txt file informs search engine crawlers what is excluded from site indexing. For examples and information about
                configuring robot.txt files,{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  click here
                </a>
                .
              </>
            }
          >
            <TextArea value={robotsTxt} onChange={setRobotsTxt} rows={4} />
          </FormField>

          <FormField label="No-Index Meta Tag">
            <Checkbox
              label="Insert a No-Index meta tag on all pages of the marketplace"
              checked={noIndexMetaTag}
              onChange={setNoIndexMetaTag}
              description="When enabled, all marketplace pages contain a meta tag that instructs search engine crawlers to not index them. Enable this only if you want no marketplace page to appear in search engine results. This option should not be used in conjunction with a robots.txt entry that disallows crawling."
            />
          </FormField>
        </FormSection>

        {/* ANALYTICS Section */}
        <FormSection title="ANALYTICS">
          <FormField
            label="Google Analytics Tracking ID"
            description="Tracking ID where page tracking data is sent. Your Google Analytics account contains this Tracking ID, which can also be called the Property ID. It usually begins with UA-. No page tracking data is collected if this field is blank."
          >
            <TextInput value={gaTrackingId} onChange={setGaTrackingId} />
          </FormField>
        </FormSection>

        {/* ACCESSIBILITY STATEMENT Section */}
        <FormSection title="ACCESSIBILITY STATEMENT">
          <FormField
            label="Legal Company Name"
            description="The company name displayed on the template accessibility statement. If left blank, your Storefront company name will be used."
          >
            <TextInput value={legalCompanyName} onChange={setLegalCompanyName} />
          </FormField>

          <FormField
            label="Accessibility Contact Email"
            description="The contact email shown on the template accessibility statement. If left blank, your Storefront contact email will be used."
          >
            <TextInput value={accessibilityEmail} onChange={setAccessibilityEmail} type="email" />
          </FormField>
        </FormSection>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-teal-700 text-white font-medium rounded hover:bg-teal-800 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </PageLayout>
  );
};


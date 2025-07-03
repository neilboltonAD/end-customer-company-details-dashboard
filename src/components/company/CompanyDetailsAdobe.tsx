import React from 'react';
import { ExpandableSection } from '../layout/ExpandableSection';

const adobeLogo = '/adobelogo.png';

export const CompanyDetailsAdobe = () => (
  <div className="mb-8">
    <div className="text-lg font-bold text-gray-800 mb-2">Adobe</div>
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
        <div className="w-full">
          <div className="flex items-center mb-6">
            <img src={adobeLogo} alt="Adobe Logo" className="w-12 h-12 mr-4 rounded" />
            <div>
              <div className="text-lg font-bold text-gray-800">ABD CA</div>
              <div className="text-xs text-gray-500 font-mono">P1005228634</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full">
            <div>
              <div className="font-semibold text-gray-700 mb-1">Address</div>
              <div className="text-sm text-gray-600">asdasd asdasd<br />50 Grove St<br />Somerville, MA 02144<br />US</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">Discount Levels</div>
              <div className="text-xs text-gray-600">Licenses</div>
              <div className="text-sm text-gray-800 font-semibold mb-2">Level 01</div>
              <div className="text-xs text-gray-600">Consumables</div>
              <div className="text-sm text-gray-800 font-semibold">-</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">Preferred Language</div>
              <div className="text-sm text-gray-800 font-semibold">English (US)</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">Anniversary Date</div>
              <div className="text-sm text-gray-800 font-semibold">07/02/26</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">Market Segment</div>
              <div className="text-sm text-gray-800 font-semibold">Commercial</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">Global Customer</div>
              <div className="text-sm text-gray-800 font-semibold">No</div>
            </div>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full text-sm text-gray-700 border-t">
              <thead>
                <tr>
                  <th className="py-2 px-2 text-left font-semibold">Administrator name</th>
                  <th className="py-2 px-2 text-left font-semibold">Email ID</th>
                  <th className="py-2 px-2 text-left font-semibold">Phone number</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-2">asdasd asdasd</td>
                  <td className="py-2 px-2">asd@as.com</td>
                  <td className="py-2 px-2">2133423456</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ExpandableSection>

      {/* VIP Program Status */}
              <ExpandableSection 
          title="VIP Program Status" 
          sectionId="adobe-vip-status"
          helpContent="The Adobe VIP (Value Incentive Plan) program provides volume licensing options for organizations. This section shows your current VIP status, available benefits, and program eligibility requirements."
        >
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-4 w-full">
            <div>
              <div className="font-semibold text-gray-700">3-Year Commit (3YC)</div>
              <a href="#" className="text-xs text-blue-600">Find out more</a>
            </div>
            <button className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors text-sm ml-4">Apply for 3YC</button>
          </div>
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-4 w-full">
            <div>
              <div className="font-semibold text-gray-700">High Growth Offers (HGO)</div>
              <a href="#" className="text-xs text-blue-600">Find out more</a>
              <div className="text-xs text-gray-500 mt-1">3YC is required before making a purchase.</div>
            </div>
            <button className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors text-sm ml-4">Check Eligible Offers</button>
          </div>
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-4 w-full">
            <div>
              <div className="font-semibold text-gray-700">Linked Membership</div>
              <a href="#" className="text-xs text-blue-600">Find out more</a>
            </div>
            <button className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors text-sm ml-4">Apply for Linked Membership</button>
          </div>
        </div>
      </ExpandableSection>

      {/* Update & Schedule New Products at Renewal */}
              <ExpandableSection 
          title="Update & Schedule New Products at Renewal" 
          sectionId="adobe-renewal-products"
          helpContent="This section allows you to manage product updates and schedule new Adobe products to be added to your subscription at renewal time. This helps ensure you have access to the latest tools and features."
        >
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-4 w-full">
            <div>
              <div className="font-semibold text-gray-700">Update Adobe renewal quantity</div>
              <a href="#" className="text-xs text-blue-600">Find out more</a>
            </div>
            <button className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors text-sm ml-4">List Adobe Products</button>
          </div>
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-4 w-full">
            <div>
              <div className="font-semibold text-gray-700">Add new Adobe products at renewal</div>
              <a href="#" className="text-xs text-blue-600">Find out more</a>
            </div>
            <button className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors text-sm ml-4">Add New Products</button>
          </div>
        </div>
      </ExpandableSection>
    </ExpandableSection>
  </div>
); 
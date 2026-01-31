import { Shield, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-base-primary" size={32} />
            <h1 className="text-3xl font-bold">Terms of Use & Disclaimer</h1>
          </div>

          <div className="prose max-w-none">
            {/* Warning Banner */}
            <div className="bg-warning/10 border border-warning rounded-lg p-6 mb-8 not-prose">
              <div className="flex gap-3">
                <AlertTriangle className="text-warning flex-shrink-0 mt-1" size={24} />
                <div>
                  <h2 className="text-lg font-bold text-warning mb-2">Important Notice</h2>
                  <p className="text-sm text-gray-700">
                    By connecting your wallet and using BaseReview, you accept these terms in full.
                    Please read carefully before using this platform.
                  </p>
                </div>
              </div>
            </div>

            {/* NO LIABILITY */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-danger">⚠️</span>
                NO LIABILITY
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By using BaseReview, you acknowledge and agree that the developers, creators, operators,
                and affiliates of this platform shall not be held liable for any direct, indirect,
                incidental, special, consequential, or exemplary damages, including but not limited to
                loss of funds, assets, profits, data, or any other losses arising from your use of this service.
              </p>
            </section>

            {/* USE AT YOUR OWN RISK */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-danger">⚠️</span>
                USE AT YOUR OWN RISK
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                BaseReview is an experimental decentralized application provided "as is" without warranties
                of any kind. Smart contracts may contain bugs, vulnerabilities, or behave unexpectedly.
                You are solely responsible for your interactions with the blockchain and any assets you deposit.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Smart contracts are unaudited and may contain critical vulnerabilities</li>
                <li>Reviews are user-generated and may contain inaccurate or malicious information</li>
                <li>The platform cannot guarantee the authenticity or accuracy of any review</li>
                <li>Scam detection mechanisms may fail to identify malicious applications</li>
                <li>Platform availability is not guaranteed and may be interrupted at any time</li>
              </ul>
            </section>

            {/* NOT LEGAL ADVICE */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">NOT LEGAL OR FINANCIAL ADVICE</h2>
              <p className="text-gray-700 leading-relaxed">
                This platform is a technical tool only and does not constitute legal, financial, investment,
                or professional advice of any kind. All information provided is for informational purposes only.
                Consult qualified professionals before making any financial or legal decisions.
              </p>
            </section>

            {/* IRREVERSIBLE TRANSACTIONS */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-danger">⚠️</span>
                IRREVERSIBLE TRANSACTIONS
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Blockchain transactions are irreversible. Once assets are deposited, staked, or transferred,
                they cannot be recovered by the platform or its developers.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Verify all addresses and configurations carefully before confirming transactions</li>
                <li>Double-check review details, stakes, and contract interactions</li>
                <li>There is no customer support to reverse transactions or recover funds</li>
                <li>Lost private keys mean permanent loss of access to your assets</li>
              </ul>
            </section>

            {/* USER RESPONSIBILITIES */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">USER RESPONSIBILITIES</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <strong>Due Diligence:</strong> Always conduct your own research (DYOR) before interacting
                  with any reviewed application. BaseReview is a tool to aid research, not a guarantee of safety.
                </li>
                <li>
                  <strong>Honest Reviews:</strong> Provide truthful, accurate reviews based on your actual
                  experience. False or malicious reviews may result in reputation penalties and stake forfeiture.
                </li>
                <li>
                  <strong>Security:</strong> Protect your wallet private keys and seed phrases. Never share them
                  with anyone. The platform will never ask for your private keys.
                </li>
                <li>
                  <strong>Compliance:</strong> You are responsible for ensuring compliance with all applicable
                  laws and regulations in your jurisdiction.
                </li>
              </ul>
            </section>

            {/* REGULATORY COMPLIANCE */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">REGULATORY COMPLIANCE</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You are responsible for ensuring compliance with all applicable laws and regulations in your
                jurisdiction. The availability of this service does not imply legality in your location.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Some jurisdictions may prohibit or restrict the use of cryptocurrency platforms</li>
                <li>Tax obligations related to crypto transactions are your responsibility</li>
                <li>KYC/AML requirements may apply in your jurisdiction</li>
                <li>The platform does not provide legal or tax advice</li>
              </ul>
            </section>

            {/* INTELLECTUAL PROPERTY */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">INTELLECTUAL PROPERTY</h2>
              <p className="text-gray-700 leading-relaxed">
                Reviews and content you submit remain your property, but you grant BaseReview a worldwide,
                royalty-free license to display, distribute, and use this content for platform operations.
                You may not submit content that violates intellectual property rights of others.
              </p>
            </section>

            {/* PROHIBITED USE */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">PROHIBITED USE</h2>
              <p className="text-gray-700 mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Submit false, misleading, or fraudulent reviews</li>
                <li>Manipulate the reputation system or engage in vote manipulation</li>
                <li>Create multiple accounts to circumvent platform restrictions (Sybil attacks)</li>
                <li>Harass, threaten, or defame other users or developers</li>
                <li>Attempt to exploit vulnerabilities in the smart contracts</li>
                <li>Use the platform for money laundering or other illegal activities</li>
                <li>Scrape or collect data from the platform without permission</li>
              </ul>
            </section>

            {/* DISPUTE RESOLUTION */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">DISPUTE RESOLUTION</h2>
              <p className="text-gray-700 leading-relaxed">
                Disputes between users and developers are resolved through the platform's on-chain dispute
                mechanism. The community votes on disputes, and decisions are final and binding. There is no
                appeal process or arbitration.
              </p>
            </section>

            {/* PLATFORM CHANGES */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">PLATFORM CHANGES</h2>
              <p className="text-gray-700 leading-relaxed">
                BaseReview reserves the right to modify, suspend, or discontinue the platform at any time
                without notice. These terms may be updated periodically. Continued use of the platform
                constitutes acceptance of updated terms.
              </p>
            </section>

            {/* THIRD-PARTY SERVICES */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">THIRD-PARTY SERVICES</h2>
              <p className="text-gray-700 leading-relaxed">
                BaseReview integrates with third-party services including IPFS, blockchain networks, and
                wallet providers. We are not responsible for the availability, security, or operation of
                these third-party services.
              </p>
            </section>

            {/* PRIVACY */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">PRIVACY</h2>
              <p className="text-gray-700 leading-relaxed">
                BaseReview is a decentralized platform built on public blockchain. All interactions,
                reviews, and transactions are publicly visible on the blockchain. Your wallet address
                is visible to all users. No personal information is collected or stored by the platform.
              </p>
            </section>

            {/* CONTACT */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">CONTACT</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For questions about these terms:
              </p>
              <ul className="list-none space-y-2 text-gray-700">
                <li>Email: legal@basereview.xyz</li>
                <li>Discord: discord.gg/basereview</li>
                <li>GitHub: github.com/basereview/issues</li>
              </ul>
            </section>

            {/* ACCEPTANCE */}
            <div className="bg-base-primary/10 border-2 border-base-primary rounded-lg p-6 mt-8 not-prose">
              <h2 className="text-lg font-bold mb-3">Acceptance of Terms</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                By connecting your wallet and using BaseReview, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Use. If you do not agree to these
                terms, do not use this platform.
              </p>
              <p className="text-xs text-gray-600 mt-4">
                Last Updated: January 31, 2024
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-8 not-prose">
              <Link to="/" className="btn btn-primary">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

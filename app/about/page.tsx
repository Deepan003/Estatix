// app/about/page.tsx
'use client'; // Ensure this is the very first line

import { Header } from '@/components/Header';
import { Leaf, ShieldCheck, Cpu, Building, Users } from 'lucide-react'; // Added icons
import { motion } from 'framer-motion';

// Team members list - Sourced from SRS document
const teamMembers = [
  { name: 'Adrika Kundu', id: '12023052004001' },       // [cite: 186]
  { name: 'Deepan Pramanick', id: '12023052004005' },   // [cite: 188]
  { name: 'Naman Kejriwal', id: '12023052004018' },     // [cite: 190]
  { name: 'Aditya Kumar Singh', id: '12023052004026' }, // [cite: 192]
];

// Animation variants for sections and items
const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const itemVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "backOut" } }
};

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-16">
        {/* About Section */}
        <motion.section
          className="text-center mb-20"
          variants={sectionVariant}
          initial="hidden"
          animate="visible"
        >
          <Building className="w-16 h-16 text-emerald-600 mx-auto mb-4"/>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">About EstatiX</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {/* Description based on SRS Purpose [cite: 4] */}
            EstatiX is redefining the real estate experience by prioritizing **security, intelligence, and sustainability**[cite: 4]. Our platform connects buyers and sellers with verified eco-friendly properties [cite: 6], leveraging AI for smarter matching [cite: 7] and ensuring transparent, secure transactions[cite: 8]. We aim to build a future where finding a home aligns with sustainable living goals[cite: 4].
          </p>
        </motion.section>

        {/* Features Section */}
        <motion.section
            className="py-20 bg-gradient-to-br from-white to-emerald-50 rounded-xl shadow-lg mb-20"
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible" // Animate when scrolling into view
            viewport={{ once: true, amount: 0.3 }} // Trigger animation once
        >
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-16">Why Choose EstatiX?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <motion.div variants={itemVariant} className="flex flex-col items-center">
                <Leaf className="w-12 h-12 text-emerald-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Eco-Verified Listings</h3>
                <p className="text-gray-600 text-sm">Find homes rigorously checked for sustainability, complete with 'Green Tags' and detailed eco-scores[cite: 6, 16].</p>
              </motion.div>
              {/* Feature 2 */}
              <motion.div variants={itemVariant} className="flex flex-col items-center">
                <ShieldCheck className="w-12 h-12 text-emerald-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
                <p className="text-gray-600 text-sm">Experience safe and transparent deals using secure escrow services and streamlined e-signing processes[cite: 8, 19, 34, 35].</p>
              </motion.div>
              {/* Feature 3 */}
              <motion.div variants={itemVariant} className="flex flex-col items-center">
                <Cpu className="w-12 h-12 text-emerald-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
                <p className="text-gray-600 text-sm">Receive personalized property suggestions based on your lifestyle, commute, and long-term sustainability factors, not just price[cite: 7, 17, 93].</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
            className="text-center"
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
          <Users className="w-16 h-16 text-emerald-600 mx-auto mb-4"/>
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Meet Team CodeBlooded</h2> {/* [cite: 177] */}
          <div className="flex flex-wrap justify-center gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                className="bg-white p-6 rounded-lg shadow-md w-60 transform transition-all hover:shadow-xl hover:-translate-y-2 border border-gray-100"
                 // Staggered animation for team members
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-emerald-700">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.id}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm mt-16 border-t border-gray-200">
        © {new Date().getFullYear()} EstatiX by Team CodeBlooded. {/* [cite: 177] */}
      </footer>
    </div>
  );
}
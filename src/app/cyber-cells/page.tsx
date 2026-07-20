"use client";

import { useState, useMemo } from 'react';
import { Phone, MapPin, Globe, Search, Shield, Mail, ExternalLink, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// ── DATA SOURCE ───────────────────────────────────────────────────────────────
// Source: cybercrime.gov.in/Webform/Crime_NodalGrivanceList.aspx
// Ministry of Home Affairs, Government of India
// This is the official State/UT Nodal Officer list for the National Cyber Crime
// Reporting Portal (NCRP). Last verified: July 2026.
// ─────────────────────────────────────────────────────────────────────────────

interface StateEntry {
  state: string;
  nodalEmail: string;
  grievancePhone: string;
  grievanceEmail: string;
  officialWebsite?: string;
  onlinePortal: string;
  region: 'South' | 'North' | 'East' | 'West' | 'Central' | 'Northeast' | 'UT';
}

const STATE_DATA: StateEntry[] = [
  {
    state: "Andaman & Nicobar",
    nodalEmail: "spcid.and@nic.in",
    grievancePhone: "03192-232334",
    grievanceEmail: "igp.and@nic.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "UT",
  },
  {
    state: "Andhra Pradesh",
    nodalEmail: "cybercrimes1930@cid.appolice.gov.in",
    grievancePhone: "0863-2340559",
    grievanceEmail: "cybercrimes-cid@ap.gov.in",
    officialWebsite: "https://appolice.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "South",
  },
  {
    state: "Arunachal Pradesh",
    nodalEmail: "spsit@arunpol.nic.in",
    grievancePhone: "9436040703",
    grievanceEmail: "takeringu@ips.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "Northeast",
  },
  {
    state: "Assam",
    nodalEmail: "sp-cid-cyber2@assampolice.gov.in",
    grievancePhone: "0361-2521618",
    grievanceEmail: "igp-cid@assampolice.gov.in",
    officialWebsite: "https://assampolice.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "Northeast",
  },
  {
    state: "Bihar",
    nodalEmail: "cybercell-bih@nic.in",
    grievancePhone: "0612-2238098",
    grievanceEmail: "cybercell-bih@nic.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "East",
  },
  {
    state: "Chandigarh (UT)",
    nodalEmail: "spops-chd@nic.in",
    grievancePhone: "0172-2700056",
    grievanceEmail: "dig-chd@nic.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "UT",
  },
  {
    state: "Chhattisgarh",
    nodalEmail: "aigtech-phq.cg@gov.in",
    grievancePhone: "0771-2511989",
    grievanceEmail: "girijashankar.ips.@gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "Central",
  },
  {
    state: "Dadra & Nagar Haveli and Daman & Diu",
    nodalEmail: "sp-dmn-dd@nic.in",
    grievancePhone: "0260-2220140",
    grievanceEmail: "digp-daman-dd@nic.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "UT",
  },
  {
    state: "Delhi",
    nodalEmail: "dcp-ifso@delhipolice.gov.in",
    grievancePhone: "011-20892633",
    grievanceEmail: "jointcp.ifsosplcell@delhipolice.gov.in",
    officialWebsite: "https://cyber.delhipolice.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "North",
  },
  {
    state: "Goa",
    nodalEmail: "spcyber@goapolice.gov.in",
    grievancePhone: "0832-2420883",
    grievanceEmail: "digpgoa@goapolice.gov.in",
    officialWebsite: "https://goapolice.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "West",
  },
  {
    state: "Gujarat",
    nodalEmail: "cc-cid@gujarat.gov.in",
    grievancePhone: "079-23250798",
    grievanceEmail: "cc-cid@gujarat.gov.in",
    officialWebsite: "https://gujaratpolice.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "West",
  },
  {
    state: "Haryana",
    nodalEmail: "sp-cybercrimephq.pol@hry.gov.in",
    grievancePhone: "0172-2524058",
    grievanceEmail: "sp-cybercrimephq.pol@hry.gov.in",
    officialWebsite: "https://haryanapolice.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "North",
  },
  {
    state: "Himachal Pradesh",
    nodalEmail: "dig-cybercr-hp@nic.in",
    grievancePhone: "0177-2620331",
    grievanceEmail: "adgp-cid-hp@nic.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "North",
  },
  {
    state: "Jammu & Kashmir",
    nodalEmail: "ssp-cicejk@jkpolice.gov.in",
    grievancePhone: "0191-25822926",
    grievanceEmail: "adgpcidjk@jkpolice.gov.in",
    officialWebsite: "https://jkpolice.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "North",
  },
  {
    state: "Jharkhand",
    nodalEmail: "sp-cid@jhpolice.gov.in",
    grievancePhone: "0651-2220060",
    grievanceEmail: "cyberps@jhpolice.gov.in",
    officialWebsite: "https://jhpolice.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "East",
  },
  {
    state: "Karnataka",
    nodalEmail: "spctrcid@ksp.gov.in",
    grievancePhone: "080-22942475",
    grievanceEmail: "spctrcid@ksp.gov.in",
    officialWebsite: "https://ksp.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "South",
  },
  {
    state: "Kerala",
    nodalEmail: "spcyberops.pol@kerala.gov.in",
    grievancePhone: "0471-2300042",
    grievanceEmail: "adgpcyberops.pol@kerala.gov.in",
    officialWebsite: "https://cyberdome.kerala.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "South",
  },
  {
    state: "Ladakh (UT)",
    nodalEmail: "soto-igp@police.ladakh.gov.in",
    grievancePhone: "9541902324",
    grievanceEmail: "aig-civl@police.ladakh.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "UT",
  },
  {
    state: "Lakshadweep (UT)",
    nodalEmail: "lak-sop@nic.in",
    grievancePhone: "04896-262258",
    grievanceEmail: "lak-sop@nic.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "UT",
  },
  {
    state: "Madhya Pradesh",
    nodalEmail: "dig2-cybercell@mppolice.gov.in",
    grievancePhone: "0755-2511989",
    grievanceEmail: "dig2-cybercell@mppolice.gov.in",
    officialWebsite: "https://mppolice.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "Central",
  },
  {
    state: "Maharashtra",
    nodalEmail: "dig.cbr-mah@gov.in",
    grievancePhone: "022-22160080",
    grievanceEmail: "sp.cbr-mah@gov.in",
    officialWebsite: "https://mhcyber.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "West",
  },
  {
    state: "Manipur",
    nodalEmail: "sp-cybercrime.mn@manipur.gov.in",
    grievancePhone: "0385-2444888",
    grievanceEmail: "grievance.ncrp@gmail.com",
    onlinePortal: "https://cybercrime.gov.in",
    region: "Northeast",
  },
  {
    state: "Meghalaya",
    nodalEmail: "ccw-meg@gov.in",
    grievancePhone: "9402519391",
    grievanceEmail: "ccw-meg@gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "Northeast",
  },
  {
    state: "Mizoram",
    nodalEmail: "cybercrime.sp@mizoram.gov.in",
    grievancePhone: "0389-2334682",
    grievanceEmail: "polmizo@rediffmail.com",
    onlinePortal: "https://cybercrime.gov.in",
    region: "Northeast",
  },
  {
    state: "Nagaland",
    nodalEmail: "spcyber-ngl@gov.in",
    grievancePhone: "6009308003",
    grievanceEmail: "adgplo.ngl@gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "Northeast",
  },
  {
    state: "Odisha",
    nodalEmail: "igp2-cidcb@odishapolice.gov.in",
    grievancePhone: "0674-2913100",
    grievanceEmail: "adgcidcb.orpol@nic.in",
    officialWebsite: "https://odishapolice.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "East",
  },
  {
    state: "Puducherry (UT)",
    nodalEmail: "cybercell-police.py@gov.in",
    grievancePhone: "0413-2231313",
    grievanceEmail: "igp@py.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "UT",
  },
  {
    state: "Punjab",
    nodalEmail: "aigcc@punjabpolice.gov.in",
    grievancePhone: "0172-2226258",
    grievanceEmail: "igp.cyber.c.police@punjabpolice.gov.in",
    officialWebsite: "https://punjabpolice.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "North",
  },
  {
    state: "Rajasthan",
    nodalEmail: "sp.cybercrime@rajpolice.gov.in",
    grievancePhone: "0141-2821741",
    grievanceEmail: "sp.cybercrime@rajpolice.gov.in",
    officialWebsite: "https://police.rajasthan.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "North",
  },
  {
    state: "Sikkim",
    nodalEmail: "spcid@sikkimpolice.nic.in",
    grievancePhone: "9046245066",
    grievanceEmail: "cybercrime666sk@gmail.com",
    onlinePortal: "https://cybercrime.gov.in",
    region: "Northeast",
  },
  {
    state: "Tamil Nadu",
    nodalEmail: "sp1-ccdtnpolice@gov.in",
    grievancePhone: "044-29580300",
    grievanceEmail: "sp1-ccdtnpolice@gov.in",
    officialWebsite: "https://tnpolice.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "South",
  },
  {
    state: "Telangana",
    nodalEmail: "spoperations-csb-ts@tspolice.gov.in",
    grievancePhone: "040-29320049",
    grievanceEmail: "director-tscsb@tspolice.gov.in",
    officialWebsite: "https://tspolice.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "South",
  },
  {
    state: "Tripura",
    nodalEmail: "spcybercrime@tripurapolice.nic.in",
    grievancePhone: "0381-2376979",
    grievanceEmail: "spscrb@tripurapolice.nic.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "Northeast",
  },
  {
    state: "Uttarakhand",
    nodalEmail: "nileshanad.bharne@ips.gov.in",
    grievancePhone: "0135-2655900",
    grievanceEmail: "spstf-uk@nic.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "North",
  },
  {
    state: "Uttar Pradesh",
    nodalEmail: "sp-cyber.lu@up.gov.in",
    grievancePhone: "0522-2390538",
    grievanceEmail: "adg-cybercrime.lu@up.gov.in",
    officialWebsite: "https://uppolice.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "North",
  },
  {
    state: "West Bengal",
    nodalEmail: "dig1-ccw@policewb.gov.in",
    grievancePhone: "033-22021200",
    grievanceEmail: "ncrp-ccw@policewb.gov.in",
    officialWebsite: "https://wbpolice.gov.in",
    onlinePortal: "https://cybercrime.gov.in",
    region: "East",
  },
];

const REGIONS = ['All', 'South', 'North', 'East', 'West', 'Central', 'Northeast', 'UT'] as const;
type Region = typeof REGIONS[number];

const REGION_COLORS: Record<string, string> = {
  South: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  North: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  East: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  West: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Central: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  Northeast: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  UT: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
};

// Expanded state card
function StateCard({ entry, index }: { entry: StateEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="border border-border rounded-xl bg-card overflow-hidden hover:border-primary/40 transition-colors"
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded(p => !p)}
        className="w-full flex items-center justify-between p-4 text-left gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">{entry.state}</p>
            <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', REGION_COLORS[entry.region])}>
              {entry.region}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href={`tel:${entry.grievancePhone.replace(/[^0-9+]/g, '')}`}
            onClick={e => e.stopPropagation()}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary bg-primary/5 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" /> {entry.grievancePhone}
          </a>
          {expanded
            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
            : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border/50 pt-3 space-y-3">
              {/* Phone (mobile view) */}
              <div className="sm:hidden">
                <a
                  href={`tel:${entry.grievancePhone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  <Phone className="h-4 w-4" /> {entry.grievancePhone}
                </a>
              </div>

              {/* Nodal email */}
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Nodal Officer Email</p>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&to=${entry.nodalEmail}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {entry.nodalEmail}
                  </a>
                </div>
              </div>

              {/* Grievance email */}
              {entry.grievanceEmail !== entry.nodalEmail && (
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Grievance Officer Email</p>
                    <a
                      href={`https://mail.google.com/mail/?view=cm&to=${entry.grievanceEmail}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {entry.grievanceEmail}
                    </a>
                  </div>
                </div>
              )}

              {/* Links row */}
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={entry.onlinePortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/5 transition-colors"
                >
                  <Globe className="h-3 w-3" /> File Online
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
                {entry.officialWebsite && (
                  <a
                    href={entry.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" /> State Police Site
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CyberCellsPage() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState<Region>('All');

  const filtered = useMemo(() =>
    STATE_DATA.filter(e =>
      (region === 'All' || e.region === region) &&
      e.state.toLowerCase().includes(search.toLowerCase())
    ),
    [search, region]
  );

  return (
    <div className="w-full max-w-5xl mx-auto">

      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Cyber Cell Locator</h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm">
          Official contact details for all 36 States & UTs — sourced directly from
          the Ministry of Home Affairs National Cyber Crime Reporting Portal
        </p>
      </motion.div>

      {/* Source badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-2 mb-6"
      >
        <div className="flex items-center gap-2 text-xs bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-3 py-1.5 rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Verified from cybercrime.gov.in — Ministry of Home Affairs, Govt. of India
        </div>
      </motion.div>

      {/* National helpline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <p className="font-bold text-foreground text-lg">🚨 National Cyber Crime Helpline</p>
            </div>
            <p className="text-sm text-muted-foreground">24/7 — Report cybercrime, freeze fraud transactions immediately</p>
            <p className="text-xs text-muted-foreground mt-1">Also dial <strong>112</strong> for emergency police assistance</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="tel:1930"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-2xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
            >
              <Phone className="h-5 w-5" /> 1930
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-primary hover:underline text-center"
            >
              <Globe className="h-5 w-5" />
              <span className="text-xs">cybercrime.gov.in</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* How to contact box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-muted/40 rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {[
          { step: '1', title: 'Call 1930', desc: 'For financial fraud — call immediately to freeze money', icon: '📞' },
          { step: '2', title: 'File Online', desc: 'Visit cybercrime.gov.in to register complaint 24/7', icon: '💻' },
          { step: '3', title: 'Visit State Cell', desc: 'Contact your state nodal officer using details below', icon: '🏛️' },
        ].map(s => (
          <div key={s.step} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border/50">
            <span className="text-2xl flex-shrink-0">{s.icon}</span>
            <div>
              <p className="font-semibold text-sm text-foreground">{s.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Email note */}
      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-5">
        <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <span>
          Email links open in Gmail (new tab). If they don't open, copy the email address and compose manually.
          All email IDs are official government addresses from the NCRP portal.
        </span>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search state or UT..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {REGIONS.map(r => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full border transition-all',
                region === r
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-muted-foreground mb-3">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {STATE_DATA.length} states/UTs
      </p>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No results for &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((entry, i) => (
            <StateCard key={entry.state} entry={entry} index={i} />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-start gap-2 text-xs text-muted-foreground border border-border/50 rounded-xl p-4 bg-muted/20"
      >
        <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-yellow-500" />
        <div>
          <p className="font-medium text-foreground mb-1">Data Source & Accuracy Notice</p>
          <p>
            All contact details are sourced from the official{' '}
            <a href="https://cybercrime.gov.in/Webform/Crime_NodalGrivanceList.aspx" target="_blank"
              rel="noopener noreferrer" className="text-primary hover:underline">
              National Cyber Crime Reporting Portal
            </a>{' '}
            (Ministry of Home Affairs, Government of India). Officer names and phone numbers
            may change due to transfers and postings. For the most current information,
            always verify at <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer"
              className="text-primary hover:underline">cybercrime.gov.in</a>.
            When in doubt, call <strong>1930</strong> — it works nationwide.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
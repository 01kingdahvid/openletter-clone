'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './deep.module.css';

// Helper to obfuscate email (show only domain)
const obfuscateEmail = (email) => {
  const [localPart, domain] = email.split('@');
  if (!domain) return email;
  const obfuscatedLocal = '*'.repeat(Math.min(localPart.length, 8));
  return `${obfuscatedLocal}@${domain}`;
};

// Generate mock signatures (total static count = 1675 but we generate a representative subset for demo)
const generateMockSignatures = (count) => {
  const firstNames = ['Alex', 'Jamie', 'Taylor', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Quinn', 'Blake', 'Avery', 'Cameron', 'Dakota', 'Emerson', 'Finley', 'Harper', 'Logan', 'Peyton', 'Reese', 'Sawyer', 'Skyler'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  const countries = ['United States', 'Germany', 'United Kingdom', 'France', 'Canada', 'Australia', 'Netherlands', 'Sweden', 'Japan', 'South Korea', 'Brazil', 'India', 'Italy', 'Spain', 'Mexico', 'South Africa', 'Nigeria', 'Singapore'];
  const honorsList = [
    'Professor of Computer Science, MIT',
    'Senior Researcher, AI Ethics Lab',
    'Director, Digital Rights Foundation',
    'Policy Lead, Algorithmic Accountability Initiative',
    'Assistant Professor, University of Osnabrück, Brown University',
    'PhD Candidate, Stanford University',
    'Postdoctoral Fellow, Oxford Internet Institute',
    'Lead Engineer, Deepfake Detection Team',
    'Human Rights Attorney, Electronic Frontier Foundation',
    'Research Scientist, Max Planck Institute'
  ];
  
  const signatures = [];
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const country = countries[Math.floor(Math.random() * countries.length)];
    const honors = honorsList[Math.floor(Math.random() * honorsList.length)];
    const verified = Math.random() > 0.3;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${country.replace(/\s/g, '').toLowerCase()}.edu`;
    signatures.push({ id: i, name, country, honors, verified, email });
  }
  return signatures;
};

// All mock signatures (subset of total 1675 for demo)
const ALL_SIGNATURES = generateMockSignatures(180);
const TOTAL_SIGNATURES_COUNT = 1675; // Static total as per design

export default function DisruptingDeepfakesPage() {
  // State for signatures list with infinite scroll
  const [filteredSignatures, setFilteredSignatures] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' or 'verified'
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Modal state
  const [selectedSignature, setSelectedSignature] = useState(null);
  
  // Sticky bar visibility (when image card scrolled past)
  const [showStickyBar, setShowStickyBar] = useState(false);
  const imageCardRef = useRef(null);
  const signaturesContainerRef = useRef(null);
  
  // Filter and search logic
  useEffect(() => {
    let filtered = [...ALL_SIGNATURES];
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(sig => 
        sig.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType === 'verified') {
      filtered = filtered.filter(sig => sig.verified);
    }
    setFilteredSignatures(filtered);
    setVisibleCount(12); // Reset visible count on filter/search
  }, [searchTerm, filterType]);
  
  // Visible signatures slice for infinite scroll
  const visibleSignatures = filteredSignatures.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSignatures.length;
  
  // Load more signatures (infinite scroll)
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    // Simulate async load delay for spinner effect
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 12, filteredSignatures.length));
      setIsLoadingMore(false);
    }, 800);
  }, [isLoadingMore, hasMore, filteredSignatures.length]);
  
  // Intersection Observer for infinite scroll
  const observerRef = useRef(null);
  const lastSignatureElementRef = useCallback((node) => {
    if (isLoadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [isLoadingMore, hasMore, loadMore]);
  
  // Intersection Observer for sticky bar (detect when image card leaves viewport)
  useEffect(() => {
    const currentCard = imageCardRef.current;
    if (!currentCard) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-48px 0px 0px 0px' }
    );
    observer.observe(currentCard);
    return () => observer.disconnect();
  }, []);
  
  // Handle Sign This Letter button (both inside card and sticky bar)
  const handleSignLetter = () => {
    alert('Signature feature coming soon. This would open a form to add your name.');
  };
  
  // Open modal with signature details
  const openModal = (sig) => {
    setSelectedSignature(sig);
  };
  
  const closeModal = () => {
    setSelectedSignature(null);
  };
  
  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return (
    <main className={styles.container}>
      {/* Image Card with Map and Overlay Signature Row */}
      <div className={styles.imageCard} ref={imageCardRef}>
        <div className={styles.mapImageWrapper}>
          {/* User will replace this src with their own map image */}
          <img 
            src="/map-placeholder.jpg" 
            alt="World map showing deepfake impact areas" 
            className={styles.mapImage}
            onError={(e) => {
              e.target.src = 'https://placehold.co/1200x600/2c3e50/ffffff?text=World+Map+(Upload+Your+Image)';
            }}
          />
        </div>
        <div className={styles.signatureOverlay}>
          <div className={styles.signatureStats}>
            <div style={{display: "flex", justifyContent: 'center'}}> <span className={styles.signatureCount}>{TOTAL_SIGNATURES_COUNT.toLocaleString()} signatures</span>
            <button onClick={handleSignLetter} className={styles.signButtonSmall}>Sign this letter</button></div>
           
            <div className={styles.notableSigners}>Irene Chen and Huw Price have signed</div>
          </div>
        </div>
      </div>
      
      {/* Context Section: Date, Title, Subtitle, Paragraph */}
      <div className={styles.contextSection}>
        <div className={styles.date}>{currentDate}</div>
        <h1 className={styles.title}>Disrupting the Deepfake Supply Chain</h1>
        <h2 className={styles.subtitle}>A call for new laws and regulations to protect everyone from the harms of deepfakes</h2>
        <p className={styles.contextText}>
          Context: Many experts have warned that artificial intelligence (“AI”) could cause significant harm to humanity if not handled responsibly. 
          The impact of AI is compounded significantly by its ability to imitate real humans. In the statement below, “deepfakes” refers to non-consensual 
          or grossly misleading AI-generated voices, images, or videos, that a reasonable person would mistake as real. This does not include slight alterations 
          to an image or voice, nor innocuous entertainment or satire that is easily recognized as synthetic. Today, deepfakes often involve sexual imagery, 
          fraud, or political disinformation. Since AI is progressing rapidly and making deepfakes much easier to create, safeguards are needed for the 
          functioning and integrity of our digital infrastructure.
        </p>
      </div>
      
      {/* Statement Container (Blue background) */}
      <div className={styles.statementContainer}>
        <div className={styles.statementHeading}>Statement</div>
        <div className={styles.statementContent}>
          <p className={styles.statementText}>
            Deepfakes are a growing threat to society, and governments must impose obligations throughout the supply chain to stop the proliferation of deepfakes. 
            New laws should:
          </p>
          <ul className={styles.statementList}>
            <li>1. Fully criminalize deepfake child pornography, even when only fictional children are depicted;</li>
            <li>2. Establish criminal penalties for anyone who knowingly creates or knowingly facilitates the spread of harmful deepfakes; and</li>
            <li>3. Require software developers and distributors to prevent their audio and visual products from creating harmful deepfakes, and to be held liable if their preventive measures are too easily circumvented.</li>
            <li>4. If designed wisely, such laws could nurture socially responsible businesses, and would not need to be excessively burdensome.</li>
          </ul>
        </div>
      </div>
      
      {/* Reasons Div */}
      <div className={styles.reasonsContainer}>
        <p className={styles.reasonsIntro}>
          Reasons: Not all signers will have the same reasons for supporting the statement above, and they may not all agree on the content below. 
          Nonetheless, at least some early signers were motivated by one or more of the following points:
        </p>
        <ul className={styles.reasonsList}>
          <li><strong>Nonconsensual pornography:</strong> AI-generated pornography is a rapidly growing industry, and many targets are minors. One report found that deepfake pornography makes up 98% of all deepfake videos online, following a 400% increase in deepfake sexual content from 2022 to 2023, reaching monthly traffic exceeding 34 million in 2023, with 99% percent of those targeted being women. This follows a pre-existing trend in technology-facilitated gender-based violence, where 58% of young women and girls globally have experienced online harassment on social media platforms, with disproportionate impact experienced on the basis of gender, race, ethnicity, sexual orientation, religion, and other factors.</li>
          <li><strong>Fraud:</strong> Deepfake fraud for impersonation and identity theft is a threat to both individuals and businesses. AI can make convincing deepfake videos of private individuals using as little as one photo. Deepfake fraud reportedly increased by 3000% in 2023.</li>
          <li><strong>Elections:</strong> With half of the world’s population facing elections soon, the widespread creation and proliferation of deepfakes is a growing threat to democratic processes around the world. True-to-life deepfakes of celebrities and political figures are already spreading rapidly.</li>
          <li><strong>Practicality:</strong> On a positive note, it is possible for cameras to generate tamper-proof digital seals on unaltered photographs and videos of the real world, using cryptographic signature techniques similar to website certificates and login credentials. If broadly employed, these seals would allow anyone to use open-source authentication apps to verify that a properly signed photo or video is authentic. Device manufacturers, software developers, and media companies should work together and popularize these or similar content authentication methods.</li>
          <li><strong>Urgency:</strong> Unprecedented AI progress is making deepfake creation fast, cheap, and easy. The total number of deepfakes has grown by 550% from 2019 to 2023.</li>
          <li><strong>Inadequate laws:</strong> Current laws do not adequately target and limit deepfake production and dissemination, and even requirements on creators — who are often underage — are ineffective. The whole deepfake supply chain should be held accountable, just as they are for malware and child pornography.</li>
          <li><strong>Mass confusion:</strong> For a modern society to function, people need to have access to believable, authentic information. Misleading the public through the use of AI should be regulated and enforced through specific, formalized laws. It’s becoming harder and harder to know what is real on the internet, and lines need to be drawn to protect our ability to recognize real human beings.</li>
          <li><strong>Performers:</strong> As audience members, we delight in the feats of real human performers in dance, film, magic, music, sports, and theater. If broadcast entertainment becomes saturated with deepfakes, the connection between audience and performers will erode, and deepfakes will unfairly displace the people whose works were used to “train” AI in the first place.</li>
        </ul>
      </div>
      
      {/* Signature Container with Search/Filter and Infinite Scroll */}
      <div className={styles.signaturesSection} ref={signaturesContainerRef}>
        <div className={styles.signaturesHeader}>
          <div className={styles.totalSignatures}>{TOTAL_SIGNATURES_COUNT.toLocaleString()} signatures</div>
          <div className={styles.controlsRow}>
            <input 
              type="text" 
              placeholder="Search by name..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className={styles.filterSelect}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All signers</option>
              <option value="verified">Verified only</option>
            </select>
          </div>
        </div>
        
        <div className={styles.signaturesList}>
          {visibleSignatures.map((sig, idx) => {
            const isLast = idx === visibleSignatures.length - 1;
            return (
              <div 
                key={sig.id} 
                className={styles.signatureCard}
                ref={isLast ? lastSignatureElementRef : null}
                onClick={() => openModal(sig)}
              >
                <div className={styles.signatureAvatar}>
                  {sig.verified && (
                    <span className={styles.verifiedBadge} title="Verified">✓</span>
                  )}
                  {!sig.verified && <span className={styles.unverifiedBadge}></span>}
                </div>
                <div className={styles.signatureInfo}>
                  <div className={styles.signatureName}>{sig.name}</div>
                  <div className={styles.signatureCountry}>{sig.country}</div>
                  <div className={styles.signatureHonors}>{sig.honors}</div>
                </div>
              </div>
            );
          })}
          {isLoadingMore && (
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner}></div>
              <span>Loading more signatures...</span>
            </div>
          )}
          {!hasMore && filteredSignatures.length > 0 && (
            <div className={styles.endMessage}>— End of signatures —</div>
          )}
          {filteredSignatures.length === 0 && !isLoadingMore && (
            <div className={styles.noResults}>No matching signatures found</div>
          )}
        </div>
      </div>
      
      {/* Sticky Bottom Bar (appears when image card is scrolled past) */}
      {showStickyBar && (
        <div className={styles.stickyBar}>
          <div className={styles.stickyLeft}>
            <span className={styles.stickyCount}>{TOTAL_SIGNATURES_COUNT.toLocaleString()} <br/> signatures</span>
            <div className={styles.stickyBorder}></div>
          </div>
          <button onClick={handleSignLetter} className={styles.stickySignButton}>Sign this letter</button>
        </div>
      )}
      
      {/* Modal for Signature Details */}
      {selectedSignature && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalVerified}>
                {selectedSignature.verified && (
                  <span className={styles.verifiedBadgeLarge}>✓</span>
                )}
                <span className={styles.modalName}>{selectedSignature.name}</span>
              </div>
              <button className={styles.modalClose} onClick={closeModal}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalDetail}><strong>Country:</strong> {selectedSignature.country}</div>
              <div className={styles.modalDetail}><strong>Honors / Affiliation:</strong> {selectedSignature.honors}</div>
            </div>
            <div className={styles.modalFooter}>
              <span>Verified email</span>
              <span className={styles.modalEmail}>{obfuscateEmail(selectedSignature.email)}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { Tilt } from 'react-tilt';
import { knowledge } from '../constants';
import { fadeIn } from '../utils/motion';
import './KnowledgeHub.css';

// Define the link mapping for each knowledge category
const knowledgeLinks = {
  'Diseases & Prevention': 'https://www.nadis.org.uk/disease-a-z/cattle',
  'Optimal Nutrition': 'https://www.msdvetmanual.com/management-and-nutrition/nutrition-dairy-cattle/nutritional-requirements-of-dairy-cattle',
  'Breeding Techniques': 'https://www.msdvetmanual.com/management-and-nutrition/management-of-reproduction-cattle/breeding-programs-in-cattle-reproduction',
  'Health Monitoring': 'https://nedap-livestockmanagement.com/solutions/nedap-cowcontrol/health-monitoring/',
  'Manure Management': 'https://www.kalro.org/navcdp/docs/livestock/MANAGEMENT%20AND%20UTILIZATION%20OF%20MANURE%20IN%20SMALLHOLDER%20DAIRY%20FARMS.pdf',
  'Market Insights': 'https://www.cattlerange.com/pages/market-reports/market-reports-analysis/'
};

const KnowledgeCard = ({ index, title, icon }: { index: number; title: string; icon: string }) => {
  const cardLink = knowledgeLinks[title as keyof typeof knowledgeLinks];

  const handleClick = () => {
    window.open(cardLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <Tilt className="knowledge-card">
        <motion.div
          variants={fadeIn('right', 'spring', 0.5 * index, 0.75)}
          className="card-container"
        >
          <div className="card-content">
            <img src={icon} alt={title} className="card-icon" />
            <h3 className="card-title">{title}</h3>
          </div>
        </motion.div>
      </Tilt>
    </div>
  );
};

const KnowledgeHub = () => {
  return (
    <div className="knowledge-hub-container">
      <motion.div initial="hidden" animate="visible" transition={{ duration: 0.5 }}>
        <h2 className="knowledge-title">Knowledge Hub</h2>
        <p className="knowledge-description">
          Explore essential topics to manage your cattle effectively.
        </p>
      </motion.div>
      <div className="knowledge-cards">
        {knowledge.map((item, index) => (
          <KnowledgeCard key={item.title} index={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default KnowledgeHub;
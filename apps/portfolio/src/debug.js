// Debug script to check if data is loading correctly

// Import the data
import glossaryData from './data/glossaryData';
import domainKnowledgeData from './data/domainKnowledgeData';
import sampleBlogData from './data/sampleBlogData';

// Function to log data to console
export function debugData() {
  console.log('=== DEBUG DATA ===');
  
  // Check glossary data
  console.log('Glossary Data:', glossaryData);
  console.log('Glossary Items Count:', glossaryData.length);
  
  // Group glossary items by first letter
  const glossaryByLetter = {};
  glossaryData.forEach(item => {
    const firstLetter = item.acronym[0].toUpperCase();
    if (!glossaryByLetter[firstLetter]) {
      glossaryByLetter[firstLetter] = [];
    }
    glossaryByLetter[firstLetter].push(item);
  });
  console.log('Glossary Items By Letter:', glossaryByLetter);
  
  // Check domain knowledge data
  console.log('Domain Knowledge Data:', domainKnowledgeData);
  console.log('Domain Categories Count:', domainKnowledgeData.categories.length);
  
  // Check sample blog data
  console.log('Sample Blog Data:', sampleBlogData);
  console.log('Sample Blogs Count:', sampleBlogData.length);
  
  // Check if blog content is valid JSON
  sampleBlogData.forEach((blog, index) => {
    try {
      const content = JSON.parse(blog.content);
      console.log(`Blog ${index + 1} content is valid JSON:`, Array.isArray(content));
    } catch (error) {
      console.error(`Blog ${index + 1} content is NOT valid JSON:`, error);
    }
  });
  
  console.log('=== END DEBUG DATA ===');
}

// Call the debug function
debugData();

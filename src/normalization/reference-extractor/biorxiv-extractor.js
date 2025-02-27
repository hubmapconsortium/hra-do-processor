class BioRxivExtractor {
  /**
   * Extracts bioRxiv references from text
   * 
   * @param {string} text - Text to extract from
   * @returns {string[]} - Array of bioRxiv IRIs
   */
  extract(text) {
    const references = [];
    
    // Pattern for bioRxiv URLs
    const biorxivUrlPattern = /https?:\/\/(www\.)?biorxiv\.org\/content\/[^\s\)\]>]+/g;
    let match;
    
    while ((match = biorxivUrlPattern.exec(text)) !== null) {
      references.push(this.cleanUrl(match[0]));
    }
    
    // Pattern for bare bioRxiv IDs
    const bareBiorxivPattern = /\bbioRxiv:([^\s\)\]>]+)/g;
    
    while ((match = bareBiorxivPattern.exec(text)) !== null) {
      references.push(`https://www.biorxiv.org/content/${match[1]}`);
    }
    
    return references;
  }
  
  /**
   * Cleans a URL by removing trailing punctuation and non-URL characters
   * 
   * @param {string} url - The URL to clean
   * @returns {string} - The cleaned URL
   */
  cleanUrl(url) {
    return url.replace(/[.,;:)\]]+$/, '');
  }
}

export { BioRxivExtractor };
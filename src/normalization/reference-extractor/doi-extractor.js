class DOIExtractor {
  /**
   * Extracts DOI references from text
   * 
   * @param {string} text - Text to extract from
   * @returns {string[]} - Array of DOI IRIs
   */
  extract(text) {
    const references = [];
    
    // Pattern for DOI URLs (https://doi.org/...)
    const doiUrlPattern = /https?:\/\/doi\.org\/[^\s\)\]>]+/g;
    let match;
    
    while ((match = doiUrlPattern.exec(text)) !== null) {
      references.push(this.cleanUrl(match[0]));
    }
    
    // Pattern for bare DOIs (doi:10.xxxx/yyyy or DOI: 10.xxxx/yyyy)
    const bareDoiPattern = /\b(?:doi:?|DOI:?)\s*(10\.[^\s\)\]>]+)/g;
    
    while ((match = bareDoiPattern.exec(text)) !== null) {
      references.push(`https://doi.org/${match[1]}`);
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

export { DOIExtractor };
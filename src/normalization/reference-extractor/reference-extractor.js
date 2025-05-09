class ReferenceExtractor {
  constructor() {
    // Registry of extraction strategies
    this.strategies = new Map();
  }
  
  /**
   * Registers a new extraction strategy
   * 
   * @param {string} name - Unique identifier for the strategy
   * @param {Object} strategy - Strategy object with extract() method
   * @returns {ReferenceExtractor} - Returns this for method chaining
   */
  registerStrategy(name, strategy) {
    if (typeof strategy.extract !== 'function') {
      throw new Error('Strategy must implement extract() method');
    }
    this.strategies.set(name, strategy);
    return this;
  }
  
  /**
   * Removes a strategy from the registry
   * 
   * @param {string} name - Strategy identifier to remove
   * @returns {boolean} - True if strategy was removed, false if not found
   */
  unregisterStrategy(name) {
    return this.strategies.delete(name);
  }
  
  /**
   * Gets a list of all registered strategy names
   * 
   * @returns {string[]} - Array of strategy names
   */
  getRegisteredStrategies() {
    return Array.from(this.strategies.keys());
  }
  
  /**
   * Extracts references from text using specified strategies
   * 
   * @param {string} text - Text to extract references from
   * @param {string[]} [strategyNames] - Strategies to use (defaults to all)
   * @returns {string[]} - Array of extracted reference IRIs
   */
  extract(text, strategyNames) {
    if (!text || typeof text !== 'string') {
      return [];
    }
    
    // If no specific strategies provided, use all registered strategies
    const strategiesToUse = strategyNames || Array.from(this.strategies.keys());
    
    // Apply each requested strategy and collect results
    const allReferences = [];
    
    for (const name of strategiesToUse) {
      const strategy = this.strategies.get(name);
      if (strategy) {
        const references = strategy.extract(text);
        allReferences.push(...references);
      }
    }
    
    // Return unique references
    return [...new Set(allReferences)];
  }
}

export { ReferenceExtractor };
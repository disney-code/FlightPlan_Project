function extractPairsWithMultipleCoordinates(results) {
	const extractedPairs = {};
      
	for (const key in results) {
	  if (results.hasOwnProperty(key) && Array.isArray(results[key]) && results[key].length > 1) {
	    extractedPairs[key] = results[key];
	  }
	}
      
	return extractedPairs;
      }
      
const results = {
	KAT: [[13.03, 7.69]],
	MABIX: [[3.27, 94.85]],
	BATAR: [[2.17, 102.09]]
      };
      
const extractedPairs = extractPairsWithMultipleCoordinates(results);
      
console.log(extractedPairs);
      
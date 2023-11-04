function findObjectsWithMultipleCoordinates(data) {
	const result = [];
	
	for (const item of data) {
	  for (const key in item) {
	    const coordinates = item[key];
      
	    if (Array.isArray(coordinates) && coordinates.length > 1) {
	      const selectedCoordinate = chooseMostSuitableCoordinate(coordinates);
	      result.push({ [key]: selectedCoordinate });
	    }
	  }
	}
      
	return result;
      }
      
      function chooseMostSuitableCoordinate(coordinates) {
	// You can implement your logic here to choose the most suitable coordinate.
	// For example, you can choose the middle coordinate.
	const middleIndex = Math.floor(coordinates.length / 2);
	return coordinates[middleIndex];
      }
      
      const data = [
	{ HSN: [[29.93, 122.36],[563,544]] },
	{ TOGUG: [[29.2, 122.53]] },
	{ BEGMO: [[28, 122.83]] },
	{ LAPUG: [[1.69, 103.4], [123, 117.38]] },
	{ BEBEM: [[22.95, 116.36]] },
	{ DOTMI: [[22, 72, 116.17]] },
	{ MONTA: [[21.56, 116.20], [34.54, 133.116], [10.92, 122.52]] },
	{ ARROW: [[-35, 173.83], [19.84, 114.37], [22.36, -155.21]] },
	{ EPDOS: [[19, 113.56]] }
      ];
      
      const result = findObjectsWithMultipleCoordinates(data);
      console.log(result);
      
// once all the objects are created, add a random color to each object
export function addColor(newObjects: any[]) {
	// console.log('Starting addColors...')
	const colors = [
		'#275D38',
		'#1e482c',
		'#00867d',
		'#095c8',
		'#595478',
		'#e15230',
		'#d45d00',
		'#095c8',
		'#00688c',
		'#004c48',
		'#4b3430',
		'#5b2924',
		'#b09747x'
	]

	// return {...newEvent, backgroundColor: colors[Math.floor(Math.random() * colors.length)]};
	return newObjects.map(obj => ({
        ...obj,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)]
    }));
}
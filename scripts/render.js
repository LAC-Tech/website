import fs from 'fs';
import ejs from 'ejs'

export default opts => {
	const {
		templatePath,
		outputPath,
		data,
		body
	} = opts

	ejs.renderFile(templatePath, {...data, body}, async (err, str) => {
		if (err) {
			console.error('Error rendering template:', err)
			process.exit(1)
		}

		fs.writeFileSync(outputPath, str, 'utf-8');
	})
}

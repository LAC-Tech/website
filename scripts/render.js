import fs from 'fs/promises';
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
			console.error('Error rendering template:', err);
			process.exit(1);
		}

		await fs.writeFile(outputPath, str, 'utf-8');

		console.log(`File '${outputPath}' generated successfully.`);
	})
}

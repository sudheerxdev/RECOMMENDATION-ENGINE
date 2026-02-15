import mongoose from 'mongoose';
import CareerPath from '../src/models/CareerPath.js';
import { connectDB } from '../src/config/db.js';
import { DEFAULT_CAREER_PATHS } from '../src/data/defaultCareerTaxonomy.js';
import { getEmbedding } from '../src/services/embeddingService.js';

const run = async () => {
  try {
    await connectDB();

    for (const career of DEFAULT_CAREER_PATHS) {
      const embedding = await getEmbedding(
        [
          career.title,
          career.description,
          `Required skills: ${career.requiredSkills.join(', ')}`,
          `Interests: ${career.interests.join(', ')}`
        ].join('\n')
      );

      await CareerPath.updateOne(
        { title: career.title },
        {
          $set: {
            ...career,
            embedding
          }
        },
        { upsert: true }
      );
    }

    // eslint-disable-next-line no-console
    console.log(`Seeded ${DEFAULT_CAREER_PATHS.length} career paths.`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to seed career paths:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();

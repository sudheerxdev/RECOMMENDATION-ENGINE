import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    careerPaths: {
      type: [String],
      default: []
    },
    missingSkills: {
      type: [String],
      default: []
    },
    roadmap: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    courses: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    projects: {
      type: [String],
      default: []
    },
    jobs: {
      type: [String],
      default: []
    },
    recommendationPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  { timestamps: true }
);

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

export default Recommendation;

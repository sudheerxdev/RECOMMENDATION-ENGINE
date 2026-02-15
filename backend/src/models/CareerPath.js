import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: String,
    provider: String,
    type: {
      type: String,
      enum: ['course', 'article', 'certification', 'video', 'documentation']
    },
    url: String,
    skill: String
  },
  { _id: false }
);

const roadmapStepSchema = new mongoose.Schema(
  {
    phase: String,
    duration: String,
    objectives: [String]
  },
  { _id: false }
);

const careerPathSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    optionalSkills: {
      type: [String],
      default: []
    },
    interests: {
      type: [String],
      default: []
    },
    experienceLevels: {
      type: [String],
      enum: ['entry', 'mid', 'senior'],
      default: ['entry', 'mid', 'senior']
    },
    relatedJobRoles: {
      type: [String],
      default: []
    },
    tags: {
      type: [String],
      default: []
    },
    learningResources: {
      type: [resourceSchema],
      default: []
    },
    projectIdeas: {
      type: [String],
      default: []
    },
    roadmapTemplate: {
      type: [roadmapStepSchema],
      default: []
    },
    popularityScore: {
      type: Number,
      default: 0.5
    },
    embedding: {
      type: [Number],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const CareerPath = mongoose.model('CareerPath', careerPathSchema);

export default CareerPath;

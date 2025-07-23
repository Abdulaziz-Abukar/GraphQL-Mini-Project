const Skill = require("./models/Skill");
const Module = require("./models/Module");

const typeDefs = `#graphql
    type Skill {
        id: ID!
        title: String!
        status: String
        modules: [Module]
    }

    type Module {
        id: ID!
        title: String!
        description: String
        skill: Skill
    }

    type Query {
        getAllSkills(options: SkillQueryInput): [Skill]
        getSkill(id: ID!): Skill
        getModulesBySkill(skillId: ID!): [Module]
    }

    input SkillQueryInput {
        filter: SkillFilter
        sortBy: String
        sortOrder: Int
        page: Int
        limit: Int
    }

    input SkillFilter {
        title: String
        status: String
    }

    type Mutation {
        addSkill(input: SkillInput!): Skill
        updateSkill(id: ID!, fields: SkillInput!): Skill
        deleteSkill(id: ID!): Skill
        addModule(input: ModuleInput!): Module
        deleteModule(id: ID!): Module
    }

    input SkillInput {
        title: String!
        status: String
    }

    input ModuleInput {
        title: String!
        description: String
        skillId: ID!
    }
`;

const resolvers = {
  Query: {
    getAllSkills: async (_, { options }) => {
      try {
        const {
          filter = {},
          sortBy = "title",
          sortOrder = 1,
          page = 1,
          limit = 10,
        } = options;

        // build dynamic mongoDB query
        const query = {};

        if (filter.title) {
          query.title = { $regex: filter.title, $options: "i" }; // case-insenitive partial match
        }
        if (filter.status) {
          query.status = filter.status;
        }

        // Build sort object (e.g., 1 = ascending, -1 = descending)
        const sortObj = { [sortBy]: sortOrder };
        // Calculate skip for pagination
        const skip = (page - 1) * limit;

        // Query the database
        const skills = await Skill.find(query)
          .sort(sortObj)
          .skip(skip)
          .limit(limit);

        return skills;
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
    getSkill: async (_, { id }) => {
      try {
        return await Skill.findById(id);
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
    getModulesBySkill: async (_, { skillId }) => {
      try {
        return await Module.find({ skill: skillId });
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
  },

  Mutation: {
    addSkill: async (_, { input }) => {
      try {
        const { title, status } = input;

        const titleDupeFinder = await Skill.findOne({ title });

        if (titleDupeFinder) {
          throw new Error("Duplicate skill found");
        }

        const newSkill = new Skill({ title, status });
        return await newSkill.save();
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },

    updateSkill: async (_, { id, fields }) => {
      try {
        const { title, status } = fields;
        const updates = {};

        if (title) updates.title = title;
        if (status) updates.status = status;

        const updated = await Skill.findByIdAndUpdate(id, updates, {
          new: true,
        });

        if (!updated) throw new Error("Skill not found");
        return updated;
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
    deleteSkill: async (_, { id }) => {
      try {
        const hasModules = await Module.findOne({ skill: id });
        if (hasModules)
          throw new Error("Error: Cannot delete skill with modules");
        const deleted = await Skill.findByIdAndDelete(id);

        if (!deleted) throw new Error("Skill not found");
        return deleted;
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
    addModule: async (_, { input }) => {
      try {
        let { title, description, skillId } = input;
        if (description === undefined) description = "This is a module";

        const skill = await Skill.findById(skillId);
        if (!skill) throw new Error("Skill not found");

        const moduleTitleDupe = await Module.findOne({ title });

        if (moduleTitleDupe) throw new Error("ERROR DUPE FOUND");
        const newModule = new Module({ title, description, skill: skillId });
        return await newModule.save();
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
    deleteModule: async (_, { id }) => {
      try {
        const deleted = await Module.findByIdAndDelete(id);

        if (!deleted) throw new Error("Error: Module not found");
        return deleted;
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
  },

  Skill: {
    modules: async (parent) => {
      return await Module.find({ skill: parent.id });
    },
  },
  Module: {
    skill: async (parent) => {
      return await Skill.findById(parent.skill);
    },
  },
};

module.exports = { typeDefs, resolvers };
